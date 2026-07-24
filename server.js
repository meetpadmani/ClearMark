import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ytdl from '@distube/ytdl-core';

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

// --- YouTube Downloader APIs ---
app.get('/api/yt/info', async (req, res) => {
  try {
    const url = req.query.url;
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }
    const info = await ytdl.getInfo(url);
    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0]?.url,
      formats: info.formats
    });
  } catch (error) {
    console.error('YT Info Error:', error);
    res.status(500).json({ error: 'Failed to fetch video info.' });
  }
});

app.get('/api/yt/download', (req, res) => {
  try {
    const url = req.query.url;
    const format = req.query.format || 'mp4'; // 'mp4' or 'mp3'
    
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    let filter = format === 'mp3' ? 'audioonly' : 'videoandaudio';
    
    res.header('Content-Disposition', \`attachment; filename="video.\${format}"\`);
    ytdl(url, { filter: filter }).pipe(res);
  } catch (error) {
    console.error('YT Download Error:', error);
    res.status(500).send('Error downloading video');
  }
});
// ------------------------------

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
