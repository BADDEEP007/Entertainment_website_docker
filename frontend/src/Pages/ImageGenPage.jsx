import React, { useState } from 'react';

export const ImageGenPage = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setImageUrl("");

    try {
      const response = await fetch("http://localhost:3000/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      if (data.status === "success" && data.image) {
        setImageUrl(`data:image/jpeg;base64,${data.image}`);
      } else {
        throw new Error("Invalid response format.");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', minHeight: '100vh', backgroundColor: '#0a0a15', color: 'white', fontFamily: 'Orbitron, sans-serif' }}>
      <button 
        onClick={() => window.history.back()} 
        style={{ alignSelf: 'flex-start', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>
        ← Back
      </button>

      <h1>AI Image Generator</h1>
      <p style={{ fontFamily: 'Rajdhani, sans-serif' }}>Powered by Stable Diffusion XL on Hugging Face</p>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px', width: '100%', maxWidth: '600px' }}>
        <input 
          type="text" 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)} 
          placeholder="Enter your prompt here..." 
          style={{ flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'white', outline: 'none' }}
          disabled={loading}
        />
        <button 
          onClick={generateImage} 
          disabled={loading || !prompt.trim()}
          style={{ 
            padding: '15px 30px', 
            borderRadius: '8px', 
            border: 'none', 
            backgroundColor: loading || !prompt.trim() ? '#444' : '#654FF0', 
            color: 'white', 
            cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s'
          }}
        >
          {loading ? "Generating..." : "Generate Image"}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: '20px', color: '#ff4444', backgroundColor: 'rgba(255,68,68,0.1)', padding: '15px', borderRadius: '8px', width: '100%', maxWidth: '600px', textAlign: 'center', border: '1px solid rgba(255,68,68,0.3)' }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '60px', height: '60px', border: '4px solid rgba(101, 79, 240, 0.2)', borderTopColor: '#654FF0', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ marginTop: '15px', color: '#aaa', fontFamily: 'Rajdhani, sans-serif' }}>Generating image... this might take 5-10 seconds if the model is loading.</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {imageUrl && !loading && (
        <div style={{ marginTop: '40px', padding: '15px', borderRadius: '15px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
          <img src={imageUrl} alt={prompt} style={{ maxWidth: '100%', maxHeight: '600px', borderRadius: '10px', display: 'block' }} />
        </div>
      )}
    </div>
  );
};
