
const express = require('express');
const cors = require('cors');
const { analyzeImageAndPlanTrip, fetchFlightPrice } = require('./trip-planner');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }

    console.log("Received analysis request for:", imageUrl);
    const result = await analyzeImageAndPlanTrip(imageUrl);
    res.json(result);

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/flight-price', async (req, res) => {
  try {
    const { destination } = req.body;
    if (!destination) {
        return res.status(400).json({ error: "Destination required" });
    }
    
    const result = await fetchFlightPrice(destination);
    res.json(result);
  } catch (error) {
    console.error("Price API Error:", error);
    // Return fallback price structure
    res.json({ price: "$Estimate" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
