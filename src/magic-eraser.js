document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const editorArea = document.getElementById('editorArea');
    const resetBtn = document.getElementById('resetBtn');
    
    // Canvas & Context
    const canvasWrapper = document.getElementById('canvasWrapper');
    const imageCanvas = document.getElementById('imageCanvas');
    const maskCanvas = document.getElementById('maskCanvas');
    const brushCursor = document.getElementById('brushCursor');
    
    const imgCtx = imageCanvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');

    // Controls
    const brushSizeSlider = document.getElementById('brushSize');
    const brushSizeValue = document.getElementById('brushSizeValue');
    const clearMaskBtn = document.getElementById('clearMaskBtn');
    const eraseBtn = document.getElementById('eraseBtn');

    // Config Modal
    const apiModal = document.getElementById('apiModal');
    const configApiBtn = document.getElementById('configApiBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const saveConfigBtn = document.getElementById('saveConfigBtn');
    const apiProvider = document.getElementById('apiProvider');
    const apiKey = document.getElementById('apiKey');

    let currentImage = null;
    let isDrawing = false;
    let brushSize = parseInt(brushSizeSlider.value);
    
    // Load config from localStorage
    function loadConfig() {
        const savedProvider = localStorage.getItem('cm_eraser_provider');
        const savedKey = localStorage.getItem('cm_eraser_key');
        if (savedProvider) apiProvider.value = savedProvider;
        if (savedKey) apiKey.value = savedKey;
    }
    loadConfig();

    // Modal Events
    configApiBtn.addEventListener('click', () => apiModal.style.display = 'flex');
    closeModalBtn.addEventListener('click', () => apiModal.style.display = 'none');
    saveConfigBtn.addEventListener('click', () => {
        localStorage.setItem('cm_eraser_provider', apiProvider.value);
        localStorage.setItem('cm_eraser_key', apiKey.value);
        apiModal.style.display = 'none';
        alert('API Config Saved');
    });

    // File Handling
    function handleFile(file) {
        if (!file.type.startsWith('image/')) return;
        
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            currentImage = img;
            initCanvas();
            uploadArea.style.display = 'none';
            editorArea.style.display = 'block';
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('border-primary');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('border-primary'));
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-primary');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });

    resetBtn.addEventListener('click', () => {
        currentImage = null;
        editorArea.style.display = 'none';
        uploadArea.style.display = 'block';
        clearMask();
    });

    // Canvas Initialization
    function initCanvas() {
        // Calculate size to fit container while maintaining aspect ratio
        const maxWidth = canvasWrapper.clientWidth;
        const maxHeight = 600;
        
        let width = currentImage.width;
        let height = currentImage.height;
        
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;

        imageCanvas.width = width;
        imageCanvas.height = height;
        maskCanvas.width = width;
        maskCanvas.height = height;

        canvasWrapper.style.width = `${width}px`;
        canvasWrapper.style.height = `${height}px`;

        imgCtx.drawImage(currentImage, 0, 0, width, height);
        
        // Setup Mask Canvas context
        maskCtx.lineCap = 'round';
        maskCtx.lineJoin = 'round';
    }

    // Brush Controls
    brushSizeSlider.addEventListener('input', (e) => {
        brushSize = parseInt(e.target.value);
        brushSizeValue.textContent = `${brushSize}px`;
        updateBrushCursor();
    });

    clearMaskBtn.addEventListener('click', clearMask);
    function clearMask() {
        maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
    }

    // Drawing Logic
    function getCursorPos(e) {
        const rect = maskCanvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function updateBrushCursor(e = null) {
        brushCursor.style.width = `${brushSize}px`;
        brushCursor.style.height = `${brushSize}px`;
        if (e) {
            const pos = getCursorPos(e);
            brushCursor.style.left = `${pos.x}px`;
            brushCursor.style.top = `${pos.y}px`;
        }
    }

    maskCanvas.addEventListener('mouseenter', () => brushCursor.style.display = 'block');
    maskCanvas.addEventListener('mouseleave', () => {
        brushCursor.style.display = 'none';
        isDrawing = false;
    });

    maskCanvas.addEventListener('mousemove', (e) => {
        updateBrushCursor(e);
        if (!isDrawing) return;
        
        const pos = getCursorPos(e);
        maskCtx.lineTo(pos.x, pos.y);
        maskCtx.stroke();
    });

    maskCanvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const pos = getCursorPos(e);
        maskCtx.lineWidth = brushSize;
        maskCtx.strokeStyle = 'rgba(255, 50, 50, 0.5)'; // Visual mask color (semi-transparent red)
        maskCtx.beginPath();
        maskCtx.moveTo(pos.x, pos.y);
    });

    window.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    // Erase Object API Call
    eraseBtn.addEventListener('click', async () => {
        const provider = localStorage.getItem('cm_eraser_provider');
        const key = localStorage.getItem('cm_eraser_key');
        
        if (!key) {
            alert('Please configure your API key first by clicking the ⚙️ icon.');
            apiModal.style.display = 'flex';
            return;
        }

        const originalBtnText = eraseBtn.innerHTML;
        eraseBtn.innerHTML = '<div class="spinner" style="width:16px;height:16px;margin-right:8px;"></div> Processing...';
        eraseBtn.disabled = true;

        try {
            // Get raw image and black/white mask for the API
            const maskBlob = await createBinaryMaskBlob();
            const imageBlob = await getCanvasBlob(imageCanvas);
            
            // Dummy implementation of API call
            alert('API logic would execute here using ' + provider + '.\nSince this requires a paid/configured API backend, this is a placeholder. See magic-eraser.js to implement your chosen API logic.');
            
        } catch (err) {
            alert('Error processing image: ' + err.message);
            console.error(err);
        } finally {
            eraseBtn.innerHTML = originalBtnText;
            eraseBtn.disabled = false;
        }
    });

    // Helpers for API Export
    function getCanvasBlob(canvas, type = 'image/png') {
        return new Promise(resolve => canvas.toBlob(resolve, type));
    }

    // AI APIs usually want a strict black/white mask
    function createBinaryMaskBlob() {
        return new Promise(resolve => {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = maskCanvas.width;
            tempCanvas.height = maskCanvas.height;
            const tCtx = tempCanvas.getContext('2d');
            
            // Fill black
            tCtx.fillStyle = 'black';
            tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            // Draw current mask in white over it
            const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
            const tData = tCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            
            for (let i = 0; i < maskData.data.length; i += 4) {
                // If drawn pixel has alpha > 0, make it white
                if (maskData.data[i+3] > 0) {
                    tData.data[i] = 255;
                    tData.data[i+1] = 255;
                    tData.data[i+2] = 255;
                }
            }
            tCtx.putImageData(tData, 0, 0);
            tempCanvas.toBlob(resolve, 'image/png');
        });
    }

});
