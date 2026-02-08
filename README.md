# Scene-It

# 🎬 Scene-It
**Don't just dream it. Scene it.**
*Turn movie screenshots and Pinterest moods into bookable travel itineraries instantly.*
 
## 💡 The Inspiration
Gen Z doesn't plan travel by searching "Hotels in Paris." They plan by seeing a photo on TikTok or a scene in *Succession* and saying, **"I want to go THERE."**

We built **Scene-It** to bridge the gap between **Aesthetic Inspiration** and **Booking Reality**. It’s a "Vibe-First" travel agent that reverse-engineers a trip from a single screenshot.

## 🚀 Key Features

### 1. 🕵️‍♀️ Visual Intelligence (The Core)
Drag and drop any image—a blurry anime scene, a movie screenshot, or an influencer's post. We identify the location instantly.

### 2. 📉 Vibe Arbitrage (The "Dupe" Detector)
**"Champagne taste, beer budget?"**
We don't just find the location; we find its **financial twin**.
* *Dream:* Santorini, Greece ($3,500)
* *Reality Check:* We automatically suggest **Sidi Bou Said, Tunisia** ($900), which matches the "White & Blue" visual aesthetic for 70% less.

### 3. ⚠️ Expectation vs. Reality Engine
**"Is this place a catfish?"**
Users can **press and hold** on any result to reveal the "Reality Layer"—user-uploaded photos from Google Maps that show the crowds, weather, and unedited truth. We calculate a **"Catfish Score"** to warn you if a destination is just a photo-op.

## 🛠️ How We Built It (Best Use of SerpApi)

We didn't just use SerpApi as a wrapper; we built a **multi-step intelligence pipeline** that chains 4 different engines together.

### The "Orchestration Layer"
1.  **Visual Recognition:** We pass the user's image to `google_lens` to extract the specific landmark or city.
2.  **Context & Validation:** We verify the location using `google_knowledge_graph` to ensure it's a travel destination (and not just a random building).
3.  **Vibe Matching:** We use `google_images` to find visually similar locations (for the "Dupe" feature) and chain those results into `Google Flights`.
4.  **Real-Time Pricing:** Finally, we query `Google Flights` for both the original destination and the "Dupe" destination simultaneously to calculate the "Vibe Arbitrage" savings.