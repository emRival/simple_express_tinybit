const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Konfigurasi URL Google Apps Script Anda
const GAS_URL = "https://script.google.com/macros/s/AKfycbx1ZQdGSMAV3wTtH7yIzyNtKALFiKfAG5NdYNmUSKsEeJVvZcBpdJ2T3nd2ZBG744A7/exec";

/**
 * Endpoint Utama Absensi
 * Method: POST
 * Body: { "siswa": "...", "guru": "...", "absen": "..." }
 */
app.post("/api/absen", async (req, res) => {
    const { siswa, guru, absen } = req.body;

    // 1. Validasi awal di sisi server Express
    if (!siswa || !guru || !absen) {
        return res.status(400).json({
            status: "Error",
            message: "Missing parameters. Pastikan mengirim siswa, guru, dan absen."
        });
    }

    try {
        const fetch = (await import("node-fetch")).default;

        // 2. Meneruskan data ke Google Apps Script
        const response = await fetch(GAS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ siswa, guru, absen }),
        });

        if (!response.ok) {
            throw new Error(`GAS Server Error: ${response.statusText}`);
        }

        const responseData = await response.json();

        // 3. SMART MAPPING: Mengubah status HTTP sesuai isi JSON dari GAS
        // Jika GAS bilang "Bad Request", Express kirim status 400
        // Jika GAS bilang "Not Found", Express kirim status 404
        let httpStatus = 200;
        if (responseData.status === "Bad Request") httpStatus = 400;
        if (responseData.status === "Not Found") httpStatus = 404;
        if (responseData.status === "Error") httpStatus = 500;

        res.status(httpStatus).json(responseData);

    } catch (error) {
        console.error("Proxy Error:", error);
        res.status(500).json({
            status: "Error",
            message: "Gagal terhubung ke Google Apps Script",
            error: error.message
        });
    }
});

// Health Check & Documentation
app.get("/", (req, res) => {
    res.json({
        app: "IDN Boarding School Attendance Gateway",
        version: "1.0.0",
        endpoint: "POST /api/absen",
        usage: {
            payload: {
                siswa: "Nama Lengkap",
                guru: "Nama Guru",
                absen: "HADIR/SAKIT/IZIN/ALFA"
            }
        }
    });
});

app.listen(port, () => {
    console.log(`\n✅ Server Gateway Berjalan!`);
    console.log(`📍 Endpoint: http://localhost:${port}/api/absen`);
    console.log(`🔗 Terhubung ke GAS: ${GAS_URL.substring(0, 40)}...\n`);
});