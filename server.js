const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Konfigurasi URL Google Apps Script Anda
const GAS_URLS = {
    "8a": "https://script.google.com/macros/s/AKfycbx1ZQdGSMAV3wTtH7yIzyNtKALFiKfAG5NdYNmUSKsEeJVvZcBpdJ2T3nd2ZBG744A7/exec",
    "8b": "https://script.google.com/macros/s/AKfycbwP9QOB-dpyT-196e50Cp5ewl_rIww5phd_6VOGagX-dlm1uztnsicZjAFSOylonIUw/exec"
};

/**
 * Endpoint Utama Absensi
 * Method: POST
 * Body: { "siswa": "...", "guru": "...", "absen": "..." }
 */
app.post("/api/absen/:kelas", async (req, res) => {
    const { kelas } = req.params;
    const { siswa, guru, absen } = req.body;

    const targetUrl = GAS_URLS[kelas.toLowerCase()];

    if (!targetUrl) {
        return res.status(404).json({
            status: "Error",
            message: `Endpoint untuk kelas '${kelas}' tidak ditemukan.`
        });
    }

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
        const response = await fetch(targetUrl, {
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
app.get("/", async (req, res) => {
    try {
        const fetch = (await import("node-fetch")).default;
        const response = await fetch(GAS_URLS["8a"]);
        const data = await response.text();

        // GAS blocks iframes (SAMEORIGIN) and requires its own internal JS ('goog' undefined error).
        // Luckily, the raw HTML is securely embedded as a JSON string inside goog.script.init()
        const match = data.match(/goog\.script\.init\(\s*("(?:[^"\\]|\\.)*")/);
        if (match) {
            const jsStringLiteral = match[1];
            // Safely parse the JavaScript string literal into a standard JS string, then parse the resulting JSON
            const parsedJsonString = new Function(`return ${jsStringLiteral}`)();
            const config = JSON.parse(parsedJsonString);

            if (config.userHtml) {
                return res.send(config.userHtml);
            }
        }

        // Fallback (might trigger goog is not defined, but better than nothing)
        res.send(data);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).send("Gagal mengambil antarmuka dari Google Apps Script");
    }
});

app.listen(port, () => {
    console.log(`\n✅ Server Gateway Berjalan!`);
    console.log(`📍 Endpoint 8A: http://localhost:${port}/api/absen/8a`);
    console.log(`📍 Endpoint 8B: http://localhost:${port}/api/absen/8b`);
    console.log(`🔗 Terhubung ke GAS 8A: ${GAS_URLS["8a"].substring(0, 40)}...`);
    console.log(`🔗 Terhubung ke GAS 8B: ${GAS_URLS["8b"].substring(0, 40)}...\n`);
});