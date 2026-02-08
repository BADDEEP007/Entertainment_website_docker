import express from 'express' 
const app = express()
app.get("/api/health",(req,res) => res.json({ok:"running"}));
const PORT = process.env.PORT || 5000;
app.listen(PORT , () =>console.log(`server running on ${PORT}`));
