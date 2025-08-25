use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use anchor_spl::associated_token::{AssociatedToken, Create};

declare_id!("CcEMnmzGM2YcvrNDFLm8XURssU9gxTUpm1Qu2Pdes7HL");

#[program]
pub mod vibes_presale {
    use super::*;

    /// Initialize the presale configuration
    pub fn initialize_presale(
        ctx: Context<InitializePresale>,
        listing_timestamp: i64,
        sol_to_vibes_rate: u64,
        usdc_to_vibes_rate: u64,
    ) -> Result<()> {
        let presale_config = &mut ctx.accounts.presale_config;
        
        presale_config.authority = ctx.accounts.authority.key();
        presale_config.vibes_mint = ctx.accounts.vibes_mint.key();
        presale_config.listing_timestamp = listing_timestamp;
        presale_config.sol_to_vibes_rate = sol_to_vibes_rate;
        presale_config.usdc_to_vibes_rate = usdc_to_vibes_rate;
        presale_config.total_sold = 0;
        presale_config.is_active = true;
        presale_config.bump = ctx.bumps.presale_config;

        msg!("Presale initialized with listing timestamp: {}", listing_timestamp);
        Ok(())
    }

    /// Purchase tokens with SOL
    pub fn purchase_with_sol(
        ctx: Context<PurchaseWithSol>,
        sol_amount: u64,
    ) -> Result<()> {
        let presale_config = &ctx.accounts.presale_config;
        
        require!(presale_config.is_active, PresaleError::PresaleNotActive);
        require!(sol_amount > 0, PresaleError::InvalidAmount);

        // Calculate VIBES tokens to receive
        // Formula: VIBES = SOL_AMOUNT * (SOL_USD_PRICE / TOKEN_USD_PRICE)
        // For simplicity in this contract, we use the configured rate
        let vibes_amount = sol_amount
            .checked_mul(presale_config.sol_to_vibes_rate)
            .ok_or(PresaleError::CalculationOverflow)?;

        // Transfer SOL from user to presale vault
        let transfer_instruction = anchor_lang::system_program::Transfer {
            from: ctx.accounts.user.to_account_info(),
            to: ctx.accounts.presale_vault.to_account_info(),
        };

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_instruction,
        );

        anchor_lang::system_program::transfer(cpi_context, sol_amount)?;

        // Create or update user purchase record
        let user_purchase = &mut ctx.accounts.user_purchase;
        user_purchase.user = ctx.accounts.user.key();
        user_purchase.total_tokens_purchased += vibes_amount;
        user_purchase.total_sol_spent += sol_amount;
        user_purchase.purchase_count += 1;
        
        // Initialize vesting schedule if first purchase
        if user_purchase.vesting_schedule.total_tokens == 0 {
            user_purchase.vesting_schedule = VestingSchedule {
                total_tokens: vibes_amount,
                listing_timestamp: presale_config.listing_timestamp,
                claimed_amounts: [0; 4], // 4 periods: 40%, 20%, 20%, 20%
                claimed_flags: [false; 4],
            };
        } else {
            user_purchase.vesting_schedule.total_tokens += vibes_amount;
        }

        user_purchase.bump = ctx.bumps.user_purchase;

        // Update global stats
        let presale_config = &mut ctx.accounts.presale_config;
        presale_config.total_sold += vibes_amount;

        emit!(PurchaseEvent {
            user: ctx.accounts.user.key(),
            sol_amount,
            vibes_amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("Purchase completed: {} SOL for {} VIBES", sol_amount, vibes_amount);
        Ok(())
    }

    /// Purchase tokens with USDC
    pub fn purchase_with_usdc(
        ctx: Context<PurchaseWithUsdc>,
        usdc_amount: u64,
    ) -> Result<()> {
        let presale_config = &ctx.accounts.presale_config;
        
        require!(presale_config.is_active, PresaleError::PresaleNotActive);
        require!(usdc_amount > 0, PresaleError::InvalidAmount);

        // Calculate VIBES tokens: VIBES = USDC_AMOUNT / TOKEN_USD_PRICE
        let vibes_amount = usdc_amount
            .checked_mul(presale_config.usdc_to_vibes_rate)
            .ok_or(PresaleError::CalculationOverflow)?;

        // Transfer USDC from user to presale vault
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_usdc_account.to_account_info(),
                to: ctx.accounts.presale_usdc_vault.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        );

        token::transfer(transfer_ctx, usdc_amount)?;

        // Update user purchase record
        let user_purchase = &mut ctx.accounts.user_purchase;
        user_purchase.user = ctx.accounts.user.key();
        user_purchase.total_tokens_purchased += vibes_amount;
        user_purchase.total_usdc_spent += usdc_amount;
        user_purchase.purchase_count += 1;

        // Initialize or update vesting schedule
        if user_purchase.vesting_schedule.total_tokens == 0 {
            user_purchase.vesting_schedule = VestingSchedule {
                total_tokens: vibes_amount,
                listing_timestamp: presale_config.listing_timestamp,
                claimed_amounts: [0; 4],
                claimed_flags: [false; 4],
            };
        } else {
            user_purchase.vesting_schedule.total_tokens += vibes_amount;
        }

        user_purchase.bump = ctx.bumps.user_purchase;

        // Update global stats
        let presale_config = &mut ctx.accounts.presale_config;
        presale_config.total_sold += vibes_amount;

        emit!(PurchaseEvent {
            user: ctx.accounts.user.key(),
            sol_amount: 0,
            vibes_amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        msg!("USDC Purchase completed: {} USDC for {} VIBES", usdc_amount, vibes_amount);
        Ok(())
    }

    /// Claim vested tokens for a specific period
    pub fn claim_vested_tokens(
        ctx: Context<ClaimVestedTokens>,
        period: u8,
    ) -> Result<()> {
        require!(period < 4, PresaleError::InvalidPeriod);

        let user_purchase = &mut ctx.accounts.user_purchase;
        let current_timestamp = Clock::get()?.unix_timestamp;
        
        // Check if listing has occurred
        require!(
            current_timestamp >= user_purchase.vesting_schedule.listing_timestamp,
            PresaleError::TokensNotListed
        );

        // Check if period is unlocked
        let period_timestamp = calculate_period_timestamp(
            user_purchase.vesting_schedule.listing_timestamp,
            period,
        );
        
        require!(
            current_timestamp >= period_timestamp,
            PresaleError::PeriodNotUnlocked
        );

        // Check if already claimed
        require!(
            !user_purchase.vesting_schedule.claimed_flags[period as usize],
            PresaleError::AlreadyClaimed
        );

        // Calculate claimable amount for this period
        let claimable_amount = calculate_period_amount(
            user_purchase.vesting_schedule.total_tokens,
            period,
        );

        // Mark as claimed
        user_purchase.vesting_schedule.claimed_flags[period as usize] = true;
        user_purchase.vesting_schedule.claimed_amounts[period as usize] = claimable_amount;

        // Transfer VIBES tokens to user
        let seeds = &[
            b"presale_config",
            &[ctx.accounts.presale_config.bump],
        ];
        let signer = &[&seeds[..]];

        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.presale_vibes_vault.to_account_info(),
                to: ctx.accounts.user_vibes_account.to_account_info(),
                authority: ctx.accounts.presale_config.to_account_info(),
            },
            signer,
        );

        token::transfer(transfer_ctx, claimable_amount)?;

        emit!(ClaimEvent {
            user: ctx.accounts.user.key(),
            period,
            amount: claimable_amount,
            timestamp: current_timestamp,
        });

        msg!("Claimed {} VIBES for period {}", claimable_amount, period);
        Ok(())
    }

    /// Update presale rates (only authority)
    pub fn update_rates(
        ctx: Context<UpdateRates>,
        new_sol_rate: u64,
        new_usdc_rate: u64,
    ) -> Result<()> {
        let presale_config = &mut ctx.accounts.presale_config;
        
        presale_config.sol_to_vibes_rate = new_sol_rate;
        presale_config.usdc_to_vibes_rate = new_usdc_rate;

        msg!("Rates updated: SOL={}, USDC={}", new_sol_rate, new_usdc_rate);
        Ok(())
    }

    /// Pause/unpause presale (only authority)
    pub fn toggle_presale(ctx: Context<TogglePresale>) -> Result<()> {
        let presale_config = &mut ctx.accounts.presale_config;
        presale_config.is_active = !presale_config.is_active;

        msg!("Presale active status: {}", presale_config.is_active);
        Ok(())
    }
}

// Helper functions
fn calculate_period_timestamp(listing_timestamp: i64, period: u8) -> i64 {
    listing_timestamp + (period as i64 * 30 * 24 * 60 * 60) // 30 days per period
}

fn calculate_period_amount(total_tokens: u64, period: u8) -> u64 {
    match period {
        0 => total_tokens * 40 / 100, // 40% on listing
        1 | 2 | 3 => total_tokens * 20 / 100, // 20% each month
        _ => 0,
    }
}

// Account structs
#[derive(Accounts)]
pub struct InitializePresale<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + PresaleConfig::INIT_SPACE,
        seeds = [b"presale_config"],
        bump
    )]
    pub presale_config: Account<'info, PresaleConfig>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub vibes_mint: Account<'info, Mint>,
    
    /// CHECK: This is the vault to receive SOL payments
    #[account(
        mut,
        seeds = [b"presale_vault"],
        bump
    )]
    pub presale_vault: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PurchaseWithSol<'info> {
    #[account(
        mut,
        seeds = [b"presale_config"],
        bump = presale_config.bump
    )]
    pub presale_config: Account<'info, PresaleConfig>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + UserPurchase::INIT_SPACE,
        seeds = [b"user_purchase", user.key().as_ref()],
        bump
    )]
    pub user_purchase: Account<'info, UserPurchase>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    /// CHECK: This is the vault to receive SOL payments
    #[account(
        mut,
        seeds = [b"presale_vault"],
        bump
    )]
    pub presale_vault: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PurchaseWithUsdc<'info> {
    #[account(
        mut,
        seeds = [b"presale_config"],
        bump = presale_config.bump
    )]
    pub presale_config: Account<'info, PresaleConfig>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + UserPurchase::INIT_SPACE,
        seeds = [b"user_purchase", user.key().as_ref()],
        bump
    )]
    pub user_purchase: Account<'info, UserPurchase>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(mut)]
    pub user_usdc_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub presale_usdc_vault: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimVestedTokens<'info> {
    #[account(
        seeds = [b"presale_config"],
        bump = presale_config.bump
    )]
    pub presale_config: Account<'info, PresaleConfig>,
    
    #[account(
        mut,
        seeds = [b"user_purchase", user.key().as_ref()],
        bump = user_purchase.bump
    )]
    pub user_purchase: Account<'info, UserPurchase>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = vibes_mint,
        associated_token::authority = user
    )]
    pub user_vibes_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub presale_vibes_vault: Account<'info, TokenAccount>,
    
    pub vibes_mint: Account<'info, Mint>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateRates<'info> {
    #[account(
        mut,
        seeds = [b"presale_config"],
        bump = presale_config.bump,
        has_one = authority
    )]
    pub presale_config: Account<'info, PresaleConfig>,
    
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct TogglePresale<'info> {
    #[account(
        mut,
        seeds = [b"presale_config"],
        bump = presale_config.bump,
        has_one = authority
    )]
    pub presale_config: Account<'info, PresaleConfig>,
    
    pub authority: Signer<'info>,
}

// Data structs
#[account]
#[derive(InitSpace)]
pub struct PresaleConfig {
    pub authority: Pubkey,
    pub vibes_mint: Pubkey,
    pub listing_timestamp: i64,
    pub sol_to_vibes_rate: u64,
    pub usdc_to_vibes_rate: u64,
    pub total_sold: u64,
    pub is_active: bool,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct UserPurchase {
    pub user: Pubkey,
    pub total_tokens_purchased: u64,
    pub total_sol_spent: u64,
    pub total_usdc_spent: u64,
    pub purchase_count: u32,
    pub vesting_schedule: VestingSchedule,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct VestingSchedule {
    pub total_tokens: u64,
    pub listing_timestamp: i64,
    pub claimed_amounts: [u64; 4], // Amount claimed for each period
    pub claimed_flags: [bool; 4],  // Whether each period has been claimed
}

// Events
#[event]
pub struct PurchaseEvent {
    pub user: Pubkey,
    pub sol_amount: u64,
    pub vibes_amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct ClaimEvent {
    pub user: Pubkey,
    pub period: u8,
    pub amount: u64,
    pub timestamp: i64,
}

// Errors
#[error_code]
pub enum PresaleError {
    #[msg("Presale is not active")]
    PresaleNotActive,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Calculation overflow")]
    CalculationOverflow,
    #[msg("Invalid period")]
    InvalidPeriod,
    #[msg("Tokens not listed yet")]
    TokensNotListed,
    #[msg("Period not unlocked yet")]
    PeriodNotUnlocked,
    #[msg("Already claimed")]
    AlreadyClaimed,
}
