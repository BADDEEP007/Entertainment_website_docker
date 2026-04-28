# Pinggy Image Generation Endpoint

## Overview
This endpoint calls an external Pinggy URL to generate images and returns a URL that can be used directly in the frontend.

## Endpoint Details

**URL:** `/generate-image-pinggy`  
**Method:** `POST`  
**Content-Type:** `application/json`

## Request Format

```json
{
  "prompt": "your image generation prompt here"
}
```

### Example Request

```bash
curl -X POST http://localhost:3000/generate-image-pinggy \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "a beautiful sunset over mountains"
  }'
```

## Response Format

### Success Response (200 OK)

```json
{
  "status": "success",
  "url": "http://localhost:3000/images/pinggy_1234567890.png"
}
```

### Error Responses

#### Missing Prompt (400 Bad Request)
```json
{
  "status": "error",
  "error": "Prompt is required"
}
```

#### Missing PINGGY_URL Configuration (500 Internal Server Error)
```json
{
  "status": "error",
  "error": "PINGGY_URL not configured in environment variables"
}
```

#### Pinggy Service Error (503 Service Unavailable)
```json
{
  "status": "error",
  "error": "No response from Pinggy service",
  "details": "error details here"
}
```

#### Other Errors (500 Internal Server Error)
```json
{
  "status": "error",
  "error": "error message here"
}
```

## How It Works

1. **Receives prompt** from the frontend
2. **Validates** that prompt is provided
3. **Checks** PINGGY_URL environment variable is configured
4. **Calls** the Pinggy service at `{PINGGY_URL}/generate` with the prompt
5. **Receives** image data as a buffer (binary data)
6. **Converts** buffer to base64 format
7. **Saves** the image to `Saved_Images/` folder with filename `pinggy_{timestamp}.png`
8. **Generates** a public URL for the image
9. **Returns** the URL to the frontend

## Environment Variables

Add this to your `.env` file:

```env
PINGGY_URL=https://your-pinggy-url.com
BACKEND_URL=http://localhost:3000
```

### Example Configuration

```env
# For local development
PINGGY_URL=https://abc123.pinggy.io
BACKEND_URL=http://localhost:3000

# For production
PINGGY_URL=https://your-production-pinggy-url.com
BACKEND_URL=https://your-backend-domain.com
```

## Image Storage

- **Directory:** `Saved_Images/`
- **Filename Format:** `pinggy_{timestamp}.png`
- **Example:** `pinggy_1704123456789.png`
- **Access URL:** `{BACKEND_URL}/images/{filename}`

## Frontend Integration

### Using Axios

```javascript
import axios from 'axios';

const generateImage = async (prompt) => {
  try {
    const response = await axios.post('http://localhost:3000/generate-image-pinggy', {
      prompt: prompt
    });
    
    const imageUrl = response.data.url;
    console.log('Image URL:', imageUrl);
    
    // Display image in your UI
    document.getElementById('myImage').src = imageUrl;
    
  } catch (error) {
    console.error('Error generating image:', error.response?.data || error.message);
  }
};

// Usage
generateImage('a beautiful sunset over mountains');
```

### Using Fetch

```javascript
const generateImage = async (prompt) => {
  try {
    const response = await fetch('http://localhost:3000/generate-image-pinggy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      const imageUrl = data.url;
      console.log('Image URL:', imageUrl);
      
      // Display image in your UI
      document.getElementById('myImage').src = imageUrl;
    } else {
      console.error('Error:', data.error);
    }
    
  } catch (error) {
    console.error('Error generating image:', error);
  }
};

// Usage
generateImage('a beautiful sunset over mountains');
```

## Timeout Configuration

The endpoint has a **2-minute timeout** (120,000ms) to allow for longer image generation times. You can adjust this in the code:

```javascript
timeout: 120000 // 2 minutes in milliseconds
```

## Error Handling

The endpoint handles three types of errors:

1. **Response Errors** - Pinggy service returned an error status code
2. **Request Errors** - No response received from Pinggy service
3. **Setup Errors** - Error occurred while setting up the request

All errors are logged to the console and returned to the client with appropriate status codes.

## Testing

### Test with cURL

```bash
# Test the endpoint
curl -X POST http://localhost:3000/generate-image-pinggy \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test image"}'

# Expected response
{
  "status": "success",
  "url": "http://localhost:3000/images/pinggy_1704123456789.png"
}
```

### Test with Postman

1. Create a new POST request
2. URL: `http://localhost:3000/generate-image-pinggy`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
   ```json
   {
     "prompt": "a beautiful sunset over mountains"
   }
   ```
5. Send request
6. Copy the URL from the response and open it in a browser to view the image

## Troubleshooting

### "PINGGY_URL not configured"
- Make sure you have `PINGGY_URL` in your `.env` file
- Restart the server after adding the environment variable

### "No response from Pinggy service"
- Check if the Pinggy URL is correct and accessible
- Verify your internet connection
- Check if the Pinggy service is running

### "Timeout" errors
- Increase the timeout value if image generation takes longer
- Check Pinggy service performance

### Images not displaying
- Verify `BACKEND_URL` is set correctly in `.env`
- Check if the `Saved_Images` folder exists and has write permissions
- Ensure the `/images` static route is configured in Express

## Security Considerations

1. **Input Validation** - Always validate and sanitize prompts
2. **Rate Limiting** - Consider adding rate limiting to prevent abuse
3. **File Size Limits** - Monitor disk space usage for saved images
4. **CORS** - Configure CORS properly for production
5. **Authentication** - Add authentication if needed for production use

## Performance Tips

1. **Cleanup Old Images** - Implement a cron job to delete old images
2. **Image Optimization** - Consider compressing images before saving
3. **CDN** - Use a CDN for serving images in production
4. **Caching** - Implement caching for frequently requested prompts
