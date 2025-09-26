// Ultimate Video Generator - Professional Transcript Videos with Advanced Features

class UltimateVideoGenerator {
    constructor() {
        // ... (previous constructor properties are the same)
        this.currentFile = null; this.textContent = ''; this.allCleanWords = []; this.segments = []; this.videoBlob = null; this.isGenerating = false; this.isPaused = false; this.generationStartTime = null; this.currentStep = 'upload';
        this.qualityPresets = {"hd": {"height": 1080, "bitrate": 8000000, "label": "HD (1080p) - Fast"},"fullhd": {"height": 1440, "bitrate": 12000000, "label": "Full HD+ (1440p) - Recommended"},"ultra4k": {"height": 2160, "bitrate": 20000000, "label": "4K Ultra (2160p) - Maximum"}};
        this.animationStyles = {"simple": {"name": "Simple Highlight", "icon": "✨", "duration": 500},"underline": {"name": "Underline Sweep", "icon": "📏", "duration": 600},"marker": {"name": "Highlighter", "icon": "🖍️", "duration": 700},"pen": {"name": "Pen Writing", "icon": "✒️", "duration": 800},"colormorph": {"name": "Color Morph", "icon": "🌈", "duration": 600},"glow": {"name": "Glow Pulse", "icon": "💫", "duration": 500},"scalepop": {"name": "Scale Pop", "icon": "🔄", "duration": 400},"typewriter": {"name": "Typewriter", "icon": "⌨️", "duration": 900}};
        this.defaultColors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE"];
        
        // NEW: Expanded settings with defaults for new features
        this.settings = {
            quality: 'hd',
            aspectRatio: '1:1', // NEW
            selectedAnimation: 'simple',
            animationMode: 'same',
            antiAliasing: true,
            highDPI: true,
            subpixelRendering: true,
            readingSpeed: 180, // WPM
            textAlign: 'center',
            // NEW Appearance Settings
            backgroundColor: '#000000',
            textColor: '#ffffff',
            baseFontSize: 48,
            fontFamily: 'Inter',
            lineHeightMultiplier: 1.2,
            // NEW Processing Settings
            wordsPerSegment: 50,
            durationPerWord: 150 // ms for animation speed
        };
        
        this.segmentSettings = [];
    }
    
    async init() {
        console.log('🚀 Initializing Ultimate Video Generator...');
        this.initializeDOM();
        this.bindEvents();
        this.showStep('upload');
        console.log('✅ Ultimate Video Generator ready!');
    }
    
    initializeDOM() {
        this.elements = {
            // Existing elements...
            uploadZone: document.getElementById('upload-zone'), fileInput: document.getElementById('file-input'), fileSelectBtn: document.getElementById('file-select-btn'), fileStatus: document.getElementById('file-status'), debugCharacters: document.getElementById('debug-characters'), debugRawWords: document.getElementById('debug-raw-words'), debugCleanWords: document.getElementById('debug-clean-words'), qualityInputs: document.querySelectorAll('input[name="quality"]'), antiAliasing: document.getElementById('anti-aliasing'), highDPI: document.getElementById('high-dpi'), subpixelRendering: document.getElementById('subpixel-rendering'), continueToAnimation: document.getElementById('continue-to-animation'), animationBtns: document.querySelectorAll('.animation-btn'), animationPreviewCanvas: document.getElementById('animation-preview-canvas'), playPreview: document.getElementById('play-preview'), animationModeInputs: document.querySelectorAll('input[name="animation-mode"]'), textAlignInputs: document.querySelectorAll('input[name="text-align-mode"]'), continueToSegments: document.getElementById('continue-to-segments'), totalSegments: document.getElementById('total-segments'), estimatedDuration: document.getElementById('estimated-duration'), segmentList: document.getElementById('segment-list'), generateVideoBtn: document.getElementById('generate-video-btn'), progressTitle: document.getElementById('progress-title'), progressPercentage: document.getElementById('progress-percentage'), progressFill: document.getElementById('progress-fill'), currentSegment: document.getElementById('current-segment'), processingSpeed: document.getElementById('processing-speed'), etaTime: document.getElementById('eta-time'), generationCanvas: document.getElementById('generation-canvas'), pauseGeneration: document.getElementById('pause-generation'), cancelGeneration: document.getElementById('cancel-generation'), finalVideo: document.getElementById('final-video'), finalDuration: document.getElementById('final-duration'), finalQuality: document.getElementById('final-quality'), finalSize: document.getElementById('final-size'), downloadVideo: document.getElementById('download-video'), regenerateVideo: document.getElementById('regenerate-video'), newProject: document.getElementById('new-project'), processingStatus: document.getElementById('processing-status'),

            // NEW: Elements for new settings
            wordsPerSegmentInput: document.getElementById('words-per-segment'),
            aspectRatioInputs: document.querySelectorAll('input[name="aspect-ratio"]'),
            fontFamilySelect: document.getElementById('font-family'),
            fontSizeInput: document.getElementById('font-size'),
            lineHeightInput: document.getElementById('line-height'),
            textColorPicker: document.getElementById('text-color'),
            backgroundColorPicker: document.getElementById('background-color'),
            animationSpeedSlider: document.getElementById('animation-speed'),
        };
        if (this.elements.animationPreviewCanvas) this.previewCtx = this.elements.animationPreviewCanvas.getContext('2d');
        if (this.elements.generationCanvas) this.generationCtx = this.elements.generationCanvas.getContext('2d');
    }
    
    bindEvents() {
        console.log('🔗 Binding events...');
        // --- Existing Event Bindings ---
        if (this.elements.fileInput) this.elements.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        if (this.elements.fileSelectBtn) this.elements.fileSelectBtn.addEventListener('click', (e) => { e.preventDefault(); this.elements.fileInput?.click(); });
        if (this.elements.uploadZone) { this.elements.uploadZone.addEventListener('click', (e) => { if (!e.target.closest('button')) this.elements.fileInput?.click(); }); this.elements.uploadZone.addEventListener('dragover', (e) => this.handleDragOver(e)); this.elements.uploadZone.addEventListener('dragleave', (e) => this.handleDragLeave(e)); this.elements.uploadZone.addEventListener('drop', (e) => this.handleDrop(e)); }
        this.elements.qualityInputs.forEach(input => input.addEventListener('change', () => this.updateQualitySettings()));
        this.elements.animationBtns.forEach(btn => btn.addEventListener('click', () => this.selectAnimation(btn)));
        this.elements.animationModeInputs.forEach(input => input.addEventListener('change', () => this.updateAnimationMode()));
        this.elements.textAlignInputs.forEach(input => input.addEventListener('change', (e) => { this.settings.textAlign = e.target.value; this.updateAnimationPreview(); }));
        this.elements.continueToAnimation?.addEventListener('click', () => this.showStep('animation'));
        this.elements.continueToSegments?.addEventListener('click', () => this.showStep('segments'));
        this.elements.playPreview?.addEventListener('click', () => this.playAnimationPreview());
        this.elements.generateVideoBtn?.addEventListener('click', () => this.startVideoGeneration());
        this.elements.pauseGeneration?.addEventListener('click', () => this.togglePause());
        this.elements.cancelGeneration?.addEventListener('click', () => this.cancelGeneration());
        this.elements.downloadVideo?.addEventListener('click', () => this.downloadVideo());
        this.elements.regenerateVideo?.addEventListener('click', () => this.showStep('animation'));
        this.elements.newProject?.addEventListener('click', () => this.startNewProject());

        // --- NEW: Event Bindings for new settings ---
        this.elements.wordsPerSegmentInput?.addEventListener('change', (e) => this.updateProcessingSettings(e));
        this.elements.aspectRatioInputs.forEach(input => input.addEventListener('change', () => this.updateQualitySettings()));
        
        // Appearance settings with live preview update
        const appearanceControls = [this.elements.fontFamilySelect, this.elements.fontSizeInput, this.elements.lineHeightInput, this.elements.textColorPicker, this.elements.backgroundColorPicker];
        appearanceControls.forEach(el => el?.addEventListener('change', () => { this.updateAppearanceSettings(); this.updateAnimationPreview(); }));

        this.elements.animationSpeedSlider?.addEventListener('input', (e) => this.updateProcessingSettings(e));
        
        console.log('✅ Event binding completed');
    }

    // --- NEW: Methods to update settings from UI ---
    updateProcessingSettings(e) {
        if (e.target.id === 'words-per-segment') {
            this.settings.wordsPerSegment = parseInt(e.target.value, 10) || 50;
            // If a file is already loaded, re-segment it
            if (this.allCleanWords.length > 0) {
                this.createSegments(this.allCleanWords);
                this.updateFileStatus();
            }
        }
        if (e.target.id === 'animation-speed') {
            this.settings.durationPerWord = parseInt(e.target.value, 10) || 150;
        }
        console.log('⚙️ Processing settings updated:', this.settings);
    }

    updateAppearanceSettings() {
        this.settings.fontFamily = this.elements.fontFamilySelect.value;
        this.settings.baseFontSize = parseInt(this.elements.fontSizeInput.value, 10);
        this.settings.lineHeightMultiplier = parseFloat(this.elements.lineHeightInput.value);
        this.settings.textColor = this.elements.textColorPicker.value;
        this.settings.backgroundColor = this.elements.backgroundColorPicker.value;
        console.log('🎨 Appearance settings updated:', this.settings);
    }
    
    // MODIFIED: updateQualitySettings now includes aspect ratio
    updateQualitySettings() {
        const selectedQuality = document.querySelector('input[name="quality"]:checked')?.value || 'hd';
        const selectedAspectRatio = document.querySelector('input[name="aspect-ratio"]:checked')?.value || '1:1';
        this.settings.quality = selectedQuality;
        this.settings.aspectRatio = selectedAspectRatio;
        this.settings.antiAliasing = this.elements.antiAliasing?.checked || true;
        this.settings.highDPI = this.elements.highDPI?.checked || true;
        this.settings.subpixelRendering = this.elements.subpixelRendering?.checked || true;
        console.log('📺 Quality & Format settings updated:', this.settings);
    }

    // --- FILE HANDLING & SEGMENTATION ---
    // (No major changes, but added storing allCleanWords)
    async handleFileSelect(e) { const file = e.target.files[0]; if (file) await this.processFile(file); }
    handleDragOver(e) { e.preventDefault(); this.elements.uploadZone?.classList.add('dragover'); }
    handleDragLeave(e) { e.preventDefault(); this.elements.uploadZone?.classList.remove('dragover'); }
    async handleDrop(e) { e.preventDefault(); this.elements.uploadZone?.classList.remove('dragover'); const files = e.dataTransfer.files; if (files.length > 0) await this.processFile(files[0]); }
    async processFile(file) { if (!file.name.toLowerCase().endsWith('.txt')) { this.showError('कृपया केवल .txt files upload करें'); return; } if (file.size > 10 * 1024 * 1024) { this.showError('File बहुत बड़ी है! Maximum 10MB allowed.'); return; } if (file.size === 0) { this.showError('File empty है! कृपया content वाली file upload करें।'); return; } this.currentFile = file; this.showProcessingStatus('Reading file...'); try { const content = await this.readFileWithEncodingDetection(file); if (content && content.trim()) { this.processTextContent(content); this.updateFileStatus(); setTimeout(() => { this.showStep('quality'); this.showSuccess(`✅ File successfully processed! ${this.segments.length} segments created.`); }, 500); } else { this.showError('File में valid text नहीं मिला या encoding issue है।'); } } catch (error) { console.error('File processing error:', error); this.showError('File read करने में error: ' + error.message); } finally { this.hideProcessingStatus(); } }
    async readFileWithEncodingDetection(file) { try { const content = await this.readFileAsText(file, 'UTF-8'); if (!content.includes('\ufffd') && content.length > 0) return content; } catch (error) {} const encodings = ['ISO-8859-1', 'Windows-1252']; for (const encoding of encodings) { try { const content = await this.readFileAsText(file, encoding); if (content && content.length > 0 && !content.includes('\ufffd')) return content; } catch (error) {} } try { const arrayBuffer = await this.readFileAsArrayBuffer(file); const uint8Array = new Uint8Array(arrayBuffer); let content = ''; for (let i = 0; i < uint8Array.length; i++) { content += String.fromCharCode(uint8Array[i]); } return content; } catch (error) { throw new Error('File को read नहीं कर सके।'); } }
    readFileAsText(file, encoding = 'UTF-8') { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = (e) => resolve(e.target.result); reader.onerror = (e) => reject(new Error('File read error')); reader.readAsText(file, encoding); }); }
    readFileAsArrayBuffer(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = (e) => resolve(e.target.result); reader.onerror = (e) => reject(new Error('File read error')); reader.readAsArrayBuffer(file); }); }
    processTextContent(content) { this.textContent = content.trim(); if (!this.textContent) { this.showError('File is empty after processing'); return; } const totalChars = this.textContent.length; const rawWords = this.textContent.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(word => word.length > 0); this.allCleanWords = rawWords.filter(word => word.length > 1 || /[a-zA-Z0-9\u0900-\u097F\u0980-\u09FF]/.test(word)); this.updateDebugInfo(totalChars, rawWords.length, this.allCleanWords.length); this.createSegments(this.allCleanWords); }
    updateDebugInfo(totalChars, rawWords, cleanWords) { if (this.elements.debugCharacters) this.elements.debugCharacters.textContent = totalChars.toLocaleString(); if (this.elements.debugRawWords) this.elements.debugRawWords.textContent = rawWords.toLocaleString(); if (this.elements.debugCleanWords) this.elements.debugCleanWords.textContent = cleanWords.toLocaleString(); }
    createSegments(words) { this.segments = []; const wordsPerSegment = this.settings.wordsPerSegment; for (let i = 0; i < words.length; i += wordsPerSegment) { const segmentWords = words.slice(i, i + wordsPerSegment); this.segments.push({ index: this.segments.length + 1, words: segmentWords, text: segmentWords.join(' '), wordCount: segmentWords.length, animation: this.settings.selectedAnimation, color: this.defaultColors[this.segments.length % this.defaultColors.length] }); } this.segmentSettings = this.segments.map(segment => ({ animation: segment.animation, color: segment.color })); this.updateSegmentStats(); }
    updateFileStatus() { if (!this.elements.fileStatus || !this.currentFile) return; this.elements.fileStatus.innerHTML = `<div style="display: flex; justify-content: space-between; align-items: center;"><div><strong>📄 ${this.currentFile.name}</strong><br><small>${this.formatFileSize(this.currentFile.size)} • ${this.segments.length} segments • ${this.segments.reduce((sum, seg) => sum + seg.wordCount, 0)} words</small></div><button class="btn btn--outline btn--sm" onclick="app.startNewProject()">Clear</button></div>`; this.elements.fileStatus.style.display = 'block'; }
    selectAnimation(btn) { this.elements.animationBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); this.settings.selectedAnimation = btn.dataset.animation; this.updateAnimationPreview(); }
    updateAnimationMode() { const selectedMode = document.querySelector('input[name="animation-mode"]:checked')?.value || 'same'; this.settings.animationMode = selectedMode; if (selectedMode === 'same') { this.segmentSettings.forEach(s => s.animation = this.settings.selectedAnimation); } else if (selectedMode === 'random') { const animations = Object.keys(this.animationStyles); this.segmentSettings.forEach(s => s.animation = animations[Math.floor(Math.random() * animations.length)]); } }
    
    // --- PREVIEW & SEGMENT CONTROLS ---
    async updateAnimationPreview() { if (!this.previewCtx) return; this.playAnimationPreview(true); }
    async playAnimationPreview(staticFrame = false) { if (!this.previewCtx || (this.segments.length === 0 && !staticFrame)) return; this.elements.playPreview.disabled = true; this.elements.playPreview.textContent = '🔄 Rendering...'; const canvas = this.elements.animationPreviewCanvas; const words = (this.segments[0]?.text.substring(0, 40) || 'Sample text for animation').split(' '); try { if (staticFrame) { await this.animateText(this.previewCtx, canvas, words, this.settings.selectedAnimation, this.settings.highlightColor, 15, 0.5); } else { await this.animateText(this.previewCtx, canvas, words, this.settings.selectedAnimation, this.settings.highlightColor, 15); } } catch (error) { console.error('Preview error:', error); } this.elements.playPreview.disabled = false; this.elements.playPreview.textContent = '▶️ Play Sample'; }
    showSegmentControls() { if (!this.elements.segmentList) return; this.elements.segmentList.innerHTML = ''; const template = document.getElementById('segment-control-template'); if (!template) return; this.segments.forEach((segment, index) => { const el = template.content.cloneNode(true); el.querySelector('.segment-number').textContent = `Segment ${segment.index}`; el.querySelector('.segment-word-count').textContent = `(${segment.wordCount} words)`; el.querySelector('.segment-text-preview').textContent = segment.text.substring(0, 100) + (segment.text.length > 100 ? '...' : ''); const animSelect = el.querySelector('.animation-select'); animSelect.value = this.segmentSettings[index].animation; animSelect.addEventListener('change', (e) => this.segmentSettings[index].animation = e.target.value); const colorPicker = el.querySelector('.color-picker'); const colorPreview = el.querySelector('.color-preview'); const initialColor = this.segmentSettings[index].color || this.defaultColors[index % this.defaultColors.length]; colorPicker.value = initialColor; colorPreview.textContent = initialColor; colorPicker.addEventListener('change', (e) => { this.segmentSettings[index].color = e.target.value; colorPreview.textContent = e.target.value; }); this.elements.segmentList.appendChild(el); }); }
    updateSegmentStats() { if (this.elements.totalSegments) this.elements.totalSegments.textContent = this.segments.length; if (this.elements.estimatedDuration) { const totalWords = this.segments.reduce((sum, seg) => sum + seg.wordCount, 0); const duration = Math.ceil((totalWords / this.settings.readingSpeed) * 60); const minutes = Math.floor(duration / 60); const seconds = duration % 60; this.elements.estimatedDuration.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`; } }
    
    // --- REAL VIDEO GENERATION ---
    async startVideoGeneration() { if (this.segments.length === 0) { this.showError('कोई segments नहीं मिले। कृपया file upload करें।'); return; } this.isGenerating = true; this.generationStartTime = Date.now(); this.showStep('generation'); try { await this.generateRealVideo(); this.showSuccess('🎉 Professional video successfully created!'); } catch (error) { console.error("Video Generation Failed:", error); this.showError(`Video generation failed: ${error.message}`); this.showStep('segments'); } finally { this.isGenerating = false; } }

    // MODIFIED: generateRealVideo now uses dynamic canvas dimensions
    async generateRealVideo() {
        const { width, height } = this.calculateCanvasDimensions();
        const quality = this.qualityPresets[this.settings.quality];
        const canvas = this.elements.generationCanvas;
        const ctx = this.generationCtx;
        canvas.width = width;
        canvas.height = height;

        if (!canvas.captureStream) throw new Error("Browser does not support canvas.captureStream(). Try Chrome or Firefox.");
        
        const fps = 30; // Standard FPS for now
        const stream = canvas.captureStream(fps);
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9', videoBitsPerSecond: quality.bitrate });

        const chunks = [];
        recorder.ondataavailable = e => e.data.size > 0 && chunks.push(e.data);
        const recordingPromise = new Promise(resolve => { recorder.onstop = () => { this.videoBlob = new Blob(chunks, { type: 'video/webm' }); this.showVideoResult(); resolve(); }; });

        recorder.start();

        const totalSegments = this.segments.length;
        for (let i = 0; i < totalSegments; i++) {
            if (!this.isGenerating) break;
            const segment = this.segments[i];
            const settings = this.segmentSettings[i];
            this.updateGenerationProgress(((i + 1) / totalSegments) * 100, i + 1, totalSegments);
            await this.animateText(ctx, canvas, segment.words, settings.animation, settings.color, fps);
        }

        recorder.stop();
        await recordingPromise;
    }

    updateGenerationProgress(percentage, current, total) { if(this.elements.progressFill) this.elements.progressFill.style.width = `${percentage}%`; if(this.elements.progressPercentage) this.elements.progressPercentage.textContent = `${Math.round(percentage)}%`; if(this.elements.progressTitle) this.elements.progressTitle.textContent = `Processing segment ${current} of ${total}`; if(this.elements.currentSegment) this.elements.currentSegment.textContent = `${current}/${total}`; if (this.generationStartTime) { const elapsedTime = (Date.now() - this.generationStartTime) / 1000; const speed = (current / elapsedTime).toFixed(1); const eta = ((total - current) / (current / elapsedTime)).toFixed(1); if (this.elements.processingSpeed) this.elements.processingSpeed.textContent = `${speed} seg/s`; if (this.elements.etaTime) this.elements.etaTime.textContent = `${eta}s`; } }
    
    // MODIFIED: showVideoResult now shows dynamic dimensions
    showVideoResult() { console.log('🎉 Video generation completed!'); const videoURL = URL.createObjectURL(this.videoBlob); this.elements.finalVideo.src = videoURL; this.elements.finalVideo.load(); this.elements.finalVideo.onloadedmetadata = () => { const duration = this.elements.finalVideo.duration; const minutes = Math.floor(duration / 60); const seconds = Math.floor(duration % 60); if (this.elements.finalDuration) { this.elements.finalDuration.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`; } }; if (this.elements.finalSize) this.elements.finalSize.textContent = this.formatFileSize(this.videoBlob.size); if (this.elements.finalQuality) { const { width, height } = this.calculateCanvasDimensions(); this.elements.finalQuality.textContent = `${width}×${height} @ 30fps`; } this.showStep('result'); }


    // --- ADVANCED ANIMATION ENGINE (MODIFIED to use new settings) ---
    async animateText(ctx, canvas, words, animationType, highlightColor, fps = 30, staticProgress = null) {
        return new Promise(async (resolve) => {
            const durationPerWord = this.settings.durationPerWord; // Use setting
            const totalDuration = words.length * durationPerWord;
            const totalFrames = staticProgress !== null ? 1 : Math.ceil(totalDuration / 1000 * fps);
            let frame = 0;
            
            const wordLayout = this.calculateWordLayout(ctx, canvas, words);
            const totalChars = words.join("").length;

            const renderFrame = () => {
                const overallProgress = staticProgress !== null ? staticProgress : this.easeOutCubic(frame / totalFrames);
                
                ctx.fillStyle = this.settings.backgroundColor; // Use setting
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                wordLayout.forEach(word => {
                    ctx.fillStyle = this.settings.textColor; // Use setting
                    ctx.font = word.font;
                    ctx.fillText(word.text, word.x, word.y);
                });

                ctx.save();
                // Animation logic remains the same, but it will look different due to new styles
                 switch(animationType) {
                    case 'marker':
                    case 'underline':
                        const animatedWordsCountU = overallProgress * words.length;
                        wordLayout.forEach((word, index) => {
                            if (index < animatedWordsCountU) {
                                ctx.fillStyle = highlightColor;
                                ctx.font = word.font;
                                ctx.fillText(word.text, word.x, word.y); // word color
                                
                                const wordProgress = Math.min(1, animatedWordsCountU - index);
                                if (animationType === 'underline') {
                                    ctx.fillRect(word.x - word.width/2, word.y + word.height * 0.2, word.width * wordProgress, word.height * 0.1);
                                } else { // marker
                                    ctx.globalAlpha = 0.4;
                                    ctx.fillRect(word.x - word.width/2, word.y - word.height/2, word.width * wordProgress, word.height);
                                    ctx.globalAlpha = 1.0;
                                }
                            }
                        });
                        break;
                    
                    case 'pen':
                    case 'typewriter':
                        const charsToShow = Math.floor(overallProgress * totalChars);
                        let charsCounted = 0;
                        for (const word of wordLayout) {
                            if (charsCounted >= charsToShow) break;
                            const partOfWord = word.text.substring(0, charsToShow - charsCounted);
                            ctx.fillStyle = highlightColor;
                            ctx.font = word.font;
                            ctx.fillText(partOfWord, word.x, word.y);
                            charsCounted += word.text.length;
                        }
                        break;
                    
                    case 'colormorph':
                    case 'glow':
                    case 'scalepop':
                        const activeWordIndex = Math.floor(overallProgress * words.length);
                        wordLayout.forEach((word, index) => {
                           let finalColor = this.settings.textColor;
                           if (index < activeWordIndex) finalColor = highlightColor;
                           else if (index === activeWordIndex) {
                               const wordProgress = (overallProgress * words.length) - activeWordIndex;
                               finalColor = this.lerpColor(this.settings.textColor, highlightColor, wordProgress);

                               if(animationType === 'glow'){
                                   ctx.shadowBlur = 30 * Math.sin(wordProgress * Math.PI);
                                   ctx.shadowColor = highlightColor;
                               }
                               if(animationType === 'scalepop'){
                                   const scale = 1 + (0.2 * Math.sin(wordProgress * Math.PI));
                                   const newFontSize = word.fontSize * scale;
                                   ctx.font = `600 ${newFontSize}px ${this.settings.fontFamily}`;
                               }
                           }
                           ctx.fillStyle = finalColor;
                           ctx.fillText(word.text, word.x, word.y);
                           // Reset styles for next word
                           ctx.shadowBlur = 0;
                           ctx.font = word.font; 
                        });
                        break;
                        
                    case 'simple':
                    default:
                        const wordsToShow = Math.ceil(overallProgress * words.length);
                        wordLayout.slice(0, wordsToShow).forEach(word => {
                            ctx.fillStyle = highlightColor;
                            ctx.font = word.font;
                            ctx.fillText(word.text, word.x, word.y);
                        });
                        break;
                }
                ctx.restore();

                frame++;
                if (frame < totalFrames) {
                    requestAnimationFrame(renderFrame);
                } else {
                    setTimeout(resolve, 500); // Hold last frame
                }
            };
            renderFrame();
        });
    }

    // MODIFIED: Word layout calculation now uses dynamic style settings
    calculateWordLayout(ctx, canvas, words) {
        const layout = [];
        const responsiveFontSize = Math.min(canvas.width / 15, this.settings.baseFontSize); // Use base font size from settings
        const lineHeight = responsiveFontSize * this.settings.lineHeightMultiplier; // Use line height from settings
        const font = `600 ${responsiveFontSize}px ${this.settings.fontFamily}`; // Use font family from settings
        ctx.font = font;

        const maxWidth = canvas.width * 0.9;
        const lines = [];
        let currentLine = [];
        
        words.forEach(word => {
            const currentLineWidth = ctx.measureText(currentLine.join(' ')).width;
            const newLineWidth = ctx.measureText([...currentLine, word].join(' ')).width;
            if (newLineWidth > maxWidth && currentLine.length > 0) {
                lines.push(currentLine.join(' '));
                currentLine = [word];
            } else {
                currentLine.push(word);
            }
        });
        lines.push(currentLine.join(' '));
        
        const totalHeight = lines.length * lineHeight;
        const startY = canvas.height / 2 - totalHeight / 2 + lineHeight / 2;

        lines.forEach((line, lineIndex) => {
            const lineY = startY + (lineIndex * lineHeight);
            const lineWords = line.split(' ');
            const lineWidth = ctx.measureText(line).width;
            
            let startX;
            switch(this.settings.textAlign) {
                case 'left': startX = (canvas.width - maxWidth) / 2; ctx.textAlign = 'left'; break;
                case 'right': startX = (canvas.width + maxWidth) / 2; ctx.textAlign = 'right'; break;
                case 'center': default: startX = canvas.width / 2; ctx.textAlign = 'center'; break;
            }
            
            if (this.settings.textAlign === 'left' || this.settings.textAlign === 'center') {
                let currentX = (this.settings.textAlign === 'center') ? startX - lineWidth / 2 : startX;
                 lineWords.forEach((wordText, i) => {
                    const wordWidth = ctx.measureText(wordText).width;
                    const spaceWidth = (i < lineWords.length-1) ? ctx.measureText(' ').width : 0;
                    
                    layout.push({
                        text: wordText,
                        x: currentX + wordWidth / 2,
                        y: lineY,
                        width: wordWidth,
                        height: responsiveFontSize,
                        font: font,
                        fontSize: responsiveFontSize,
                        line: lineIndex,
                    });
                    currentX += wordWidth + spaceWidth;
                });
            } else { // Simplified right align for now
                 let currentX = startX;
                 lineWords.slice().reverse().forEach((wordText, i) => {
                     const wordWidth = ctx.measureText(wordText).width;
                     const spaceWidth = (i < lineWords.length-1) ? ctx.measureText(' ').width : 0;
                     
                     layout.push({
                         text: wordText,
                         x: currentX - wordWidth / 2,
                         y: lineY,
                         width: wordWidth,
                         height: responsiveFontSize,
                         font: font,
                         fontSize: responsiveFontSize,
                         line: lineIndex,
                     });
                     currentX -= (wordWidth + spaceWidth);
                 });
                 layout.reverse(); // put back in correct order
            }
        });
        
        ctx.textAlign = 'center'; // Reset to default
        return layout;
    }
    
    // --- UTILITY and HELPER functions ---

    // NEW: Helper to calculate canvas dimensions based on quality and aspect ratio
    calculateCanvasDimensions() {
        const quality = this.qualityPresets[this.settings.quality];
        const ratio = this.settings.aspectRatio.split(':').map(Number);
        const ratioValue = ratio[0] / ratio[1];

        let width, height;
        height = quality.height;
        width = Math.round(height * ratioValue);

        // Ensure width is an even number for better video encoding
        if (width % 2 !== 0) {
            width++;
        }
        
        return { width, height };
    }
    
    lerpColor(a, b, amount) { const ah = parseInt(a.replace(/#/g, ''), 16), ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff, bh = parseInt(b.replace(/#/g, ''), 16), br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff, rr = ar + amount * (br - ar), rg = ag + amount * (bg - ag), rb = ab + amount * (bb - ab); return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1); }
    easeOutCubic(t) { return (--t) * t * t + 1; }
    downloadVideo() { if (!this.videoBlob) { this.showError('No video available.'); return; } const url = URL.createObjectURL(this.videoBlob); const a = document.createElement('a'); a.style.display = 'none'; a.href = url; a.download = `ultimate_video_${Date.now()}.webm`; document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url); document.body.removeChild(a); this.showSuccess('⬇️ Download started!'); }
    togglePause() { this.isPaused = !this.isPaused; if (this.elements.pauseGeneration) { this.elements.pauseGeneration.textContent = this.isPaused ? '▶️ Resume' : '⏸️ Pause'; } }
    cancelGeneration() { this.isGenerating = false; this.showStep('segments'); this.showError('Video generation cancelled.'); }
    startNewProject() { this.currentFile = null; this.textContent = ''; this.allCleanWords = []; this.segments = []; this.segmentSettings = []; this.videoBlob = null; if (this.elements.fileInput) this.elements.fileInput.value = ''; if (this.elements.fileStatus) this.elements.fileStatus.style.display = 'none'; this.updateDebugInfo(0, 0, 0); this.showStep('upload'); this.showSuccess('🆕 New project started!'); }
    showStep(stepName) { this.currentStep = stepName; const sections = ['upload', 'quality', 'animation', 'segments', 'generation', 'result']; sections.forEach(section => { const element = document.getElementById(`${section}-section`); if (element) { if (section === stepName) { element.style.display = 'block'; element.classList.add('active'); if (section === 'segments') { this.showSegmentControls(); this.updateSegmentStats(); } if (section === 'animation' && this.elements.animationPreviewCanvas) { setTimeout(() => this.updateAnimationPreview(), 100); } } else { element.style.display = 'none'; element.classList.remove('active'); } } }); }
    showProcessingStatus(message) { if (this.elements.processingStatus) { const statusText = this.elements.processingStatus.querySelector('.status-text'); if (statusText) statusText.textContent = message; this.elements.processingStatus.classList.add('active'); } }
    hideProcessingStatus() { if (this.elements.processingStatus) this.elements.processingStatus.classList.remove('active'); }
    showError(message) { console.error('❌ Error:', message); this.showNotification(message, 'error'); }
    showSuccess(message) { console.log('✅ Success:', message); this.showNotification(message, 'success'); }
    showNotification(message, type) { const notification = document.createElement('div'); notification.className = `status status--${type}`; notification.textContent = message; notification.style.cssText = `position: fixed; top: 20px; right: 20px; z-index: 1000; padding: 12px 16px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-width: 400px; font-weight: 500; animation: slideInUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);`; document.body.appendChild(notification); setTimeout(() => { if (document.body.contains(notification)) { notification.style.animation = 'slideInUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) reverse'; setTimeout(() => { if (document.body.contains(notification)) document.body.removeChild(notification); }, 300); } }, type === 'error' ? 5000 : 3000); }
    formatFileSize(bytes) { if (bytes === 0) return '0 Bytes'; const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]; }
    delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
}

// Initialize the application
let app;
function initializeApp() {
    const startApp = () => { console.log('🎬 DOM ready, initializing...'); app = new UltimateVideoGenerator(); app.init(); window.app = app; };
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', startApp); } else { startApp(); }
}
initializeApp();