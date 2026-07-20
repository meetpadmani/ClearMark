import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Enable CORS
app.use(cors());

// Add required security headers for WebCodecs, ONNX, and SharedArrayBuffer
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  next();
});

// Serve static frontend files from the "dist" directory
app.use(express.static(path.join(__dirname, 'dist'), { extensions: ['html'] }));

// Configure Multer for file uploads (saving to "uploads" directory)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Example Backend API Route 1: Status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend API is running!',
    timestamp: new Date().toISOString()
  });
});

// Example Backend API Route 2: File Upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  
  console.log(`[Backend] Received file: ${req.file.filename}`);
  
  res.json({
    status: 'success',
    message: 'File uploaded successfully',
    file: {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: `/uploads/${req.file.filename}`
    }
  });
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// Fallback for single page app routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server (Listening on 0.0.0.0 so it is accessible via IP)
app.listen(port, '0.0.0.0', () => {
  console.log(`\n🚀 Backend Server running at http://0.0.0.0:${port}`);
  console.log(`📁 Serving frontend from ./dist`);
  console.log(`📂 Uploads will be saved to ./uploads\n`);
});
