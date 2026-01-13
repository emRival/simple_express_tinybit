# TinyBit Server

Simple Express server untuk mengirim data ke Google Apps Script.

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

## 📝 API Endpoints

### 1. GET /api/send

Mengirim data menggunakan query parameters.

**Request:**
```
GET http://localhost:3000/api/send?id=halo bang&data=ahh ahh
```

**cURL Example:**
```bash
curl "http://localhost:3000/api/send?id=halo%20bang&data=ahh%20ahh"
```

### 2. POST /api/send

Mengirim data menggunakan request body.

**Request:**
```json
POST http://localhost:3000/api/send
Content-Type: application/json

{
  "id": "halo bang",
  "data": "ahh ahh"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/send \
  -H "Content-Type: application/json" \
  -d '{"id":"halo bang","data":"ahh ahh"}'
```

### 3. GET /

Health check endpoint untuk memastikan server berjalan.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "endpoints": {
    "GET": "/api/send?id=your_id&data=your_data",
    "POST": "/api/send with body { id: 'your_id', data: 'your_data' }"
  }
}
```

## 🧪 Testing

Anda bisa test API menggunakan:

1. **Browser** - Buka: `http://localhost:3000/api/send?id=test&data=hello`
2. **cURL** - Lihat contoh di atas
3. **Postman** - Import endpoint dan test
4. **Thunder Client** (VS Code Extension)

## 📋 Dependencies

- **express** - Web framework
- **cors** - Enable CORS
- **node-fetch** - HTTP client untuk fetch API

## ⚙️ Konfigurasi

Port default adalah `3000`. Untuk mengubahnya, edit variabel `port` di `server.js`:

```javascript
const port = 3000; // Ubah sesuai kebutuhan
```
