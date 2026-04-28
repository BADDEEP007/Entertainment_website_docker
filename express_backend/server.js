import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";
import { ChatGroq } from "@langchain/groq"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { HfInference } from "@huggingface/inference";
import morgan from 'morgan';

// Load the prompt template for Stable Diffusion XL
const sdxl_prompt = fs.readFileSync(path.join(process.cwd(), 'Prompts', 'stable-diffusion-xl.txt'),'utf-8');

dotenv.config();

const app = express();
app.use(morgan('dev'));
app.use(cors({
  origin: ["http://localhost:5173","http://13.127.44.168:5173"]
}));

// Make the 'Saved_Images' folder accessible to the browser
const uploadDir = "Saved_Images"
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

app.use(express.json());
app.use("/images", express.static(uploadDir));

const cache = new Map();

app.get("/", (_req, res) => {
  res.status(200).json({ msg: "server is running" })
})

app.post("/get_prompt", async (req, res) => {
  const { prompt } = req.body

  if (!prompt) return res.status(400).json({ status: "error", Message: "Prompt is missing" })

  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile"
  });

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", sdxl_prompt],
    ["user", "{userInput}"]
  ]);

  const Detailed_Prompt = promptTemplate.pipe(model).pipe(new StringOutputParser());
  
  try {
    const response = await Detailed_Prompt.invoke({
      userInput: prompt
    })
    if (response) {
      res.status(200).json({
        status: "Success",
        detailed_prompt: response
      })
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      Messages: error.message
    })
  }
})

const hf = new HfInference(process.env.HF_API_KEY)

// Image generation endpoint - using Stable Diffusion XL only
app.post("/generate-image", async (req, res) => {
  const { prompts } = req.body;
  
  if (!prompts) return res.status(400).json({ status: "error", error: "Prompt is required" });

  if (cache.has(prompts)) {
    return res.status(200).json({ status: "success", image: cache.get(prompts) });
  }

  const generate = async (retryCount = 0) => {
    try {
      const response = await hf.textToImage({
        model: "stabilityai/stable-diffusion-xl-base-1.0",
        inputs: prompts,
        provider: "fal-ai",
        parameters: {
          negative_prompt: 'low quality, distorted, blurred, foggy, unfocused',
          guidance_scale: 7.5,
        }
      });

      const arraybuf = await response.arrayBuffer();
      const buffer = Buffer.from(arraybuf, 'binary')
      cache.set(prompts, buffer);

      const fileName = `_ai_${Date.now()}.png`;
      const filepath = path.join(uploadDir, fileName)
      fs.writeFileSync(filepath, buffer);
      const imageUrl = `${process.env.BACKEND_URL}/images/${fileName}`;
      res.status(200).json({ url: imageUrl })

    } catch (err) {
      if (res.headersSent) return; // Prevent double response sending

      if (err.response) {
        if (err.response.status === 429) {
          return res.status(429).json({ status: "error", error: "Rate limit exceeded. Please try again later." });
        }

        // HF Model loading exception (usually 503)
        if (err.response.status === 503 && retryCount < 1) {
          let estimatedTime = 5;
          try {
            const errData = JSON.parse(Buffer.from(err.response.data).toString());
            estimatedTime = errData.estimated_time || 5;
          } catch (e) { }

          console.log(`Model loading, retrying in ${estimatedTime} seconds...`);
          setTimeout(() => generate(retryCount + 1), (estimatedTime + 1) * 1000);
          return;
        }

        let errMsg = "Failed to generate image";
        try {
          const errData = JSON.parse(Buffer.from(err.response.data).toString());
          errMsg = errData.error || errMsg;
        } catch (e) { }

        return res.status(err.response.status).json({ status: "error", error: err });
      }
      return res.status(500).json({ status: "error", error: err.message });
    }
  };

  generate();
});

// Pinggy URL image generation endpoint
app.post("/generate-image-pinggy", async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ 
      status: "error", 
      error: "Prompt is required" 
    });
  }

  const pinggyUrl = process.env.PINGGY_URL;
  
  if (!pinggyUrl) {
    return res.status(500).json({ 
      status: "error", 
      error: "PINGGY_URL not configured in environment variables" 
    });
  }

  try {
    console.log(`Calling Pinggy URL: ${pinggyUrl}/generate`);
    console.log(`With prompt: ${prompt}`);

    const response = await axios.post(`${pinggyUrl}/generate`, {
      prompt: prompt
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 120000
    });

    console.log('Pinggy response received, processing image...');
    
    // Pinggy returns a base64 string — decode it back to raw bytes
    const base64Data = response.data.image ?? response.data;
    const buffer = Buffer.from(base64Data, 'base64');

    // Save raw bytes as a .png file
    const fileName = `pinggy_${Date.now()}.png`;
    const filepath = path.join(uploadDir, fileName);
    fs.writeFileSync(filepath, buffer);
    console.log(`Image saved to: ${filepath}`);

    // Construct and return the public URL
    const imageUrl = `${process.env.BACKEND_URL}images/${fileName}`;

    res.status(200).json({
      status: "success",
      url: imageUrl
    });

  } catch (error) {
    console.error('Pinggy API error:', error.message);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return res.status(error.response.status).json({
        status: "error",
        error: error.response.data?.error || error.message,
        details: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(503).json({
        status: "error",
        error: "No response from Pinggy service",
        details: error.message
      });
    } else {
      // Something happened in setting up the request
      return res.status(500).json({
        status: "error",
        error: error.message
      });
    }
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is flying at http://localhost:${PORT}`);
});