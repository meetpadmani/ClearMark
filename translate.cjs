const fs = require('fs');
let content = fs.readFileSync('src/video-app.js', 'utf-8');

const replacements = {
    '无法加载 AI 模型：': 'Failed to load AI model: ',
    '正在启用 WebGPU AI 去水印...': 'Enabling WebGPU AI watermark removal...',
    '正在加载 AI FDnCNN ONNX 模型，首次加载会稍慢...': 'Loading AI FDnCNN ONNX model, first load may take a moment...',
    '读取视频': 'Reading video',
    '抽帧 ': 'Sampling frames ',
    '抽帧': 'Sampling frames',
    '匹配水印': 'Matching watermark',
    '检测完成': 'Detection complete',
    '检测中': 'Detecting',
    '正在抽帧检测水印：': 'Sampling frames for watermark detection: ',
    '正在抽帧检测水印...': 'Sampling frames for watermark detection...',
    '正在匹配水印候选，页面会保持响应...': 'Matching watermark candidates, page will remain responsive...',
    '未知': 'Unknown',
    '播放': 'Play',
    '暂停': 'Pause',
    '浏览器阻止了播放，请再点一次播放按钮。': 'Browser prevented playback, please click play again.',
    'AI 自动处理': 'AI Auto Processing',
    '选择视频后自动检测水印，导出时使用本地 AI 模型清理。': 'Automatically detects watermarks after selecting a video, and uses a local AI model to clean them on export.',
    '等待载入视频': 'Waiting for video',
    '尺寸': 'Size',
    '时长': 'Duration',
    '帧率': 'Frame Rate',
    '视频码率': 'Video Bitrate',
    '水印规格': 'Watermark Spec',
    '1920x1080 已确认': '1920x1080 Confirmed',
    '比例推断，实验性': 'Inferred ratio, Experimental',
    '先检测或直接导出': 'Detect or export to see results',
    '候选': 'Candidate',
    '位置': 'Position',
    '大小': 'Size',
    '均值分数': 'Average Score',
    '投票': 'Votes',
    '状态': 'Status',
    '可导出': 'Ready to export',
    '低置信': 'Low confidence',
    '请选择图片或视频文件。视频会在本页处理，图片会回到单图对比页。': 'Please select an image or video file. Videos are processed here, images go to the single image page.',
    '准备就绪': 'Ready',
    '正在读取视频元数据...': 'Reading video metadata...',
    '视频已载入，点击导出即可使用 AI 去水印。': 'Video loaded, click export to remove watermark with AI.',
    '读取视频失败': 'Failed to read video',
    '正在进入图片调试流程...': 'Entering image processing flow...',
    '无法进入图片调试流程，请打开单图页后重新选择文件。': 'Unable to enter image flow, please open image page and reselect file.',
    '正在抽帧检测右下角水印...': 'Sampling frames to detect bottom-right watermark...',
    '检测完成，导出时会使用 AI 去水印。': 'Detection complete, AI will remove watermark on export.',
    '检测置信度偏低，仍可尝试 AI 导出。': 'Detection confidence low, but AI export can still be attempted.',
    '检测失败': 'Detection failed',
    '开始': 'Start',
    '正在本地逐帧处理，页面保持打开即可。': 'Processing locally frame-by-frame, please keep page open.',
    '正在检测水印候选...': 'Detecting watermark candidates...',
    '处理中': 'Processing',
    ' 帧': ' frames',
    '正在准备导出...': 'Preparing export...',
    '当前浏览器不支持 WebCodecs，请使用新版 Chrome 或 Edge。': 'Browser does not support WebCodecs, please use recent Chrome or Edge.',
    '导出完成！': 'Export complete!',
    '处理中断': 'Processing interrupted',
    '处理失败': 'Processing failed',
    '此测试预设会强制使用一组已知坐标进行画布去噪。': 'This test preset forces a known set of coordinates for canvas denoise.',
    '读取视频暂存失败，请重新选择文件。': 'Failed to read video handoff, please reselect the file.'
};

for (const [ch, en] of Object.entries(replacements)) {
    content = content.split(ch).join(en);
}

const remaining = content.match(/[\u4e00-\u9fa5]+/g);
if (remaining) {
    console.log('Remaining:', [...new Set(remaining)]);
}
fs.writeFileSync('src/video-app.js', content, 'utf-8');
console.log('All replaced successfully.');
