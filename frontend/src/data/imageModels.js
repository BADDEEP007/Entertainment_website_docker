/**
 * Image Generation Model Configuration
 * 
 * Using Stable Diffusion XL Base 1.0 for image generation
 */

export const IMAGE_MODELS = [
    {
        id: "stabilityai/stable-diffusion-xl-base-1.0",
        name: "Stable Diffusion XL",
        shortName: "SDXL",
        description: "A powerful image generation model capable of creating high-quality, detailed images across various styles and subjects.",
        sampleImages: [],
        category: "General",
        icon: "🎨"
    }
]

// Export the single model for easy access
export const DEFAULT_MODEL = IMAGE_MODELS[0];
