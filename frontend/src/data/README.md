# Image Models Configuration Guide

This directory contains the configuration for AI image generation models used in the application.

## File Structure

- `imageModels.js` - Main configuration file containing all model definitions

## Adding Model Descriptions

To add a description for a model, edit `imageModels.js` and update the `description` field:

```javascript
{
    id: "stabilityai/stable-diffusion-3.5-large",
    name: "Stable Diffusion 3.5 Large",
    shortName: "SD 3.5 Large",
    description: "A powerful general-purpose image generation model with high quality output and versatile style capabilities. Perfect for creating detailed, realistic images across various subjects.",
    sampleImages: [],
    category: "General",
    icon: "🎨"
}
```

## Adding Sample Images

To add sample images for a model, add image URLs to the `sampleImages` array:

```javascript
{
    id: "SeeSee21/Z-Anime",
    name: "Z-Anime",
    shortName: "Z-Anime",
    description: "Specialized anime-style image generation with vibrant colors and dynamic compositions.",
    sampleImages: [
        "https://example.com/anime-sample-1.jpg",
        "https://example.com/anime-sample-2.jpg",
        "https://example.com/anime-sample-3.jpg"
    ],
    category: "Anime",
    icon: "🎭"
}
```

## Adding New Models

To add a new model to the application:

1. Open `imageModels.js`
2. Add a new object to the `IMAGE_MODELS` array:

```javascript
{
    id: "model-provider/model-name",           // Unique identifier (usually HuggingFace path)
    name: "Full Model Name",                   // Complete model name
    shortName: "Short Name",                   // Abbreviated name for UI
    description: "Model description here",     // Detailed description
    sampleImages: ["url1", "url2", "url3"],   // Array of sample image URLs
    category: "Category Name",                 // Category (e.g., "Anime", "Realistic", "Artistic")
    icon: "🎨"                                 // Emoji icon for the model
}
```

## Model Categories

Current categories include:
- **General** - All-purpose image generation
- **Anime** - Anime and manga style
- **Realistic** - Photorealistic images
- **Artistic** - Artistic and stylized effects
- **Design** - Logo and design work
- **Pixel Art** - Retro pixel art style

You can add new categories as needed.

## Best Practices

1. **Descriptions**: Keep descriptions concise but informative (2-3 sentences)
2. **Sample Images**: Use 3-6 high-quality sample images per model
3. **Image URLs**: Use reliable hosting (CDN recommended)
4. **Icons**: Choose relevant emoji icons that represent the model's style
5. **Short Names**: Keep under 15 characters for better UI display

## Image Requirements

- **Format**: JPG or PNG
- **Size**: Recommended 512x512 or 1024x1024
- **Quality**: High quality, representative of model output
- **Hosting**: Use stable, fast hosting (CDN preferred)

## Example Complete Model Entry

```javascript
{
    id: "aleksa-codes/flux-ghibsky-illustration",
    name: "Ghibli Sky Illustration",
    shortName: "Ghibli Sky",
    description: "Creates beautiful Studio Ghibli-inspired illustrations with dreamy skies, soft colors, and whimsical atmospheres. Perfect for fantasy landscapes and magical scenes.",
    sampleImages: [
        "https://cdn.example.com/ghibli-sample-1.jpg",
        "https://cdn.example.com/ghibli-sample-2.jpg",
        "https://cdn.example.com/ghibli-sample-3.jpg"
    ],
    category: "Anime",
    icon: "☁️"
}
```

## Testing Changes

After updating `imageModels.js`:

1. Save the file
2. Refresh the application
3. Open the model selector
4. Verify your changes appear correctly
5. Test the expanded view for each updated model

## Notes

- Changes to this file require a page refresh to take effect
- The application will automatically use the updated data
- No code changes are needed in other files
- Keep the file properly formatted (use a linter if available)
