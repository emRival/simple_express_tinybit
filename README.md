# TinyBit Server - IDN Boarding School Attendance Gateway

Express server sebagai gateway untuk sistem absensi siswa ke Google Apps Script.

## 📦 Instalasi

```bash
npm install
```

## 🚀 Menjalankan Server

```bash
npm start
```

Atau untuk development dengan auto-reload:

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## ⚙️ Konfigurasi

Sebelum menjalankan, pastikan sudah mengatur URL Google Apps Script di `server.js`:

```javascript
const GAS_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```

Port default adalah `3000`. Untuk mengubahnya, edit variabel `port` di `server.js`.

## 📝 API Endpoints

### POST /api/absen

Endpoint untuk mencatat absensi siswa otomatis.

**Request:**
```json
POST http://localhost:3000/api/absen
Content-Type: application/json

{
  "siswa": "Budi Santoso",
  "guru": "Pak Agus",
  "absen": "HADIR"
}
```

**Parameters:**
- **`siswa`** (required): Nama lengkap siswa
- **`guru`** (required): Nama guru/mapel
- **`absen`** (required): Status absensi
  - `HADIR` - Siswa hadir
  - `SAKIT` - Siswa sakit
  - `IZIN` - Siswa izin
  - `ALFA` - Siswa alpha/tidak hadir

**Success Response (200):**
```json
{
  "status": "Success",
  "message": "Absensi berhasil dicatat",
  "data": {
    "sheet": "W3 JAN",
    "cell": "N13",
    "siswa": "Budi Santoso",
    "guru": "Pak Agus",
    "absen": "HADIR"
  }
}
```

**Error Responses:**

- **400 Bad Request** - Parameter tidak lengkap
```json
{
  "status": "Bad Request",
  "message": "Parameter siswa, guru, dan absen wajib diisi"
}
```

- **404 Not Found** - Data tidak ditemukan di spreadsheet
```json
{
  "status": "Not Found",
  "message": "Tanggal, siswa, atau guru tidak ditemukan"
}
```

- **500 Error** - Server error
```json
{
  "status": "Error",
  "message": "Terjadi kesalahan pada server"
}
```

### GET /

Health check dan dokumentasi endpoint.

**Response:**
```json
{
  "app": "IDN Boarding School Attendance Gateway",
  "version": "1.0.0",
  "endpoint": "POST /api/absen",
  "usage": {
    "payload": {
      "siswa": "Nama Lengkap",
      "guru": "Nama Guru",
      "absen": "HADIR/SAKIT/IZIN/ALFA"
    }
  }
}
```

## 🧪 Testing

### Test dengan cURL:
```bash
curl -X POST http://localhost:3000/api/absen \
  -H "Content-Type: application/json" \
  -d '{
    "siswa": "Budi Santoso",
    "guru": "Pak Agus",
    "absen": "HADIR"
  }'
```

### Test dengan TinyBit:
Kirim data JSON ke endpoint `/api/absen` dengan parameter sesuai format di atas.

### Test di Browser:
Buka `http://localhost:3000/` untuk melihat dokumentasi API.

## 📋 Dependencies

- **express** - Web framework
- **cors** - Enable CORS untuk cross-origin requests
- **node-fetch** - HTTP client untuk komunikasi dengan Google Apps Script

## 🔧 Cara Kerja

```
TinyBit Device → Express Server → Google Apps Script → Google Sheets
                 (Port 3000)       (Cloud)             (Auto Update)
```

1. **TinyBit** kirim data absensi via HTTP POST
2. **Express Server** terima dan validasi data
3. **Forward** ke Google Apps Script
4. **Google Apps Script** proses dan update spreadsheet
5. **Return** response ke TinyBit

## 🎨 Fitur

✅ **Smart HTTP Status Mapping** - Status code sesuai response dari GAS  
✅ **Auto Validation** - Validasi parameter di server Express  
✅ **CORS Enabled** - Support cross-origin requests  
✅ **Error Handling** - Proper error messages dan status codes  
✅ **Gateway Pattern** - Proxy server antara TinyBit dan Google Sheets  

## 📖 Dokumentasi Google Apps Script

Untuk setup Google Apps Script yang sesuai dengan server ini, pastikan GAS Anda:
- Accept POST request dengan body JSON `{siswa, guru, absen}`
- Return response dengan format `{status, message, data}`
- Deployed sebagai Web App dengan "Who has access: Anyone"

## 🔒 Security Notes

- Server ini sebagai proxy/gateway, tidak menyimpan data
- Semua data langsung diteruskan ke Google Apps Script
- CORS enabled untuk allow requests dari berbagai origin
- Validasi parameter dilakukan di Express dan GAS layer
