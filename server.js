const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Endpoint untuk mengirim data ke Google Apps Script
app.get("/api/send", async (req, res) => {
  const { id, data } = req.query; // Ambil id dan data dari query parameters

  if (!id || !data) {
    return res.status(400).json({ error: "id and data parameters are required" });
  }

  try {
    const fetch = (await import("node-fetch")).default; // Dynamic Import

    const apiUrl = `https://script.google.com/macros/s/AKfycbxemlqdyzpDU2Z89STAvEnWQlb1ciwTUXeI1vRxJWR3v6rj23ZNhSSP3FIoXqoevguqqg/exec?id=${encodeURIComponent(id)}&data=${encodeURIComponent(data)}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const responseData = await response.json();
    res.json(responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint alternatif dengan POST method
app.post("/api/send", async (req, res) => {
  const { id, data } = req.body; // Ambil id dan data dari body

  if (!id || !data) {
    return res.status(400).json({ error: "id and data are required in request body" });
  }

  try {
    const fetch = (await import("node-fetch")).default; // Dynamic Import

    const apiUrl = `https://script.google.com/macros/s/AKfycbxemlqdyzpDU2Z89STAvEnWQlb1ciwTUXeI1vRxJWR3v6rj23ZNhSSP3FIoXqoevguqqg/exec?id=${encodeURIComponent(id)}&data=${encodeURIComponent(data)}`;

    const response = await fetch(apiUrl, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const responseData = await response.json();
    res.json(responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running",
    endpoints: {
      GET: "/api/send?id=your_id&data=your_data",
      POST: "/api/send with body { id: 'your_id', data: 'your_data' }"
    }
  });
});

app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
  console.log(`📝 Contoh penggunaan:`);
  console.log(`   GET:  http://localhost:${port}/api/send?id=halo bang&data=ahh ahh`);
  console.log(`   POST: http://localhost:${port}/api/send dengan body JSON`);
});
