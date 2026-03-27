import express from "express";
import axios from "axios";
import cors from "cors";
import fs from "fs";
import path from "path";
const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));
// 1. Make the 'saved_panels' folder accessible to the browser
app.use("/images", express.static("saved_panels"));


app.use(express.json());

const PINGGY_URL ='https://vqfak-34-87-73-244.a.free.pinggy.link' // change here only


app.get("/",async(req,res)=>{
  res.status(200).json({msg:"server is running"})
})
app.post("/generate", async (req, res) => {
  try {
    const response = await axios.post(`${PINGGY_URL}/generate`, req.body);
    const images = response.data.images; 

    // Create folder if missing
    if (!fs.existsSync("saved_panels")) fs.mkdirSync("saved_panels");

    const imageUrls = Object.keys(images).map((key) => {
      const base64Data = images[key].replace(/^data:image\/\w+;base64,/, "");
      const fileName = `${key}-${Date.now()}.png`;
      const filePath = path.join("saved_panels", fileName);

      // Save binary file
      fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

      // 2. Return the link (Change 'localhost:3000' to your domain if deployed)
      return `http://localhost:3000/images/${fileName}`;
    });
console.log(imageUrls)	
    res.status(200).json({ links: imageUrls });

  } catch (err) {
    res.status(500).json({ error: err});
  }
})

app.listen(3000, () => { 
  console.log("Proxy running on http://localhost:3000");
});
