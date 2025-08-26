// Centralized path configuration for consistent imports
export const paths = {
  // Components
  components: {
    layout: '@/components/layout',
    features: '@/components/features',
    ui: '@/components/ui'
  },
  
  // Providers
  providers: '@/providers',
  
  // Hooks
  hooks: '@/hooks',
  
  // Utils
  utils: '@/utils',
  
  // Config
  config: '@/config',
  
  // Types
  types: '@/types',
  
  // Lib
  lib: '@/lib'
} as const

// Helper function to get component paths
export const getComponentPath = (category: keyof typeof paths.components, name: string) => {
  return `${paths.components[category]}/${name}`
}

// Helper function to get feature component path
export const getFeaturePath = (name: string) => {
  return getComponentPath('features', name)
}

// Helper function to get layout component path
export const getLayoutPath = (name: string) => {
  return getComponentPath('layout', name)
}
