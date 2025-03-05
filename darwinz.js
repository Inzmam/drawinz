(function (global) {
  'use strict';

  class DrawingApp {
    constructor(config) {
      this.config = config;
      this.init();
    }

    init() {
      this.injectStyles();
      this.createContainer();
      this.setupCanvas();
      this.setupToolbar();
      this.setupEventListeners();
      this.setupStateManagement();
    }

    injectStyles() {
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        /* Add your CSS styles here */
        .drawing-app-container { text-align: center; display: flex; min-height: 100vh; color: #333; }
        .drawing-app-container .toolbar { background-color: #ffffff; padding: 20px 15px; box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; gap: 15px; height: 100vh; width: 120px; position: fixed; left: 0; top: 0; }
        .drawing-app-container .tool-btn { width: 90px; height: 45px; border: none; background-color: #fff; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; font-size: 24px; }
        .drawing-app-container .tool-btn:hover { background-color: #f8f8f8; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
        .drawing-app-container .tool-btn.active { background-color: #4a90e2; color: white; }
        .drawing-app-container .tool-btn.active i { color: white; }
        .drawing-app-container .tool-btn i { font-size: 1.2rem; color: #555; }
        .drawing-app-container #colorPicker { width: 90px; height: 45px; padding: 5px; border: none; border-radius: 12px; cursor: pointer; background-color: transparent; }
        .drawing-app-container #colorPicker::-webkit-color-swatch-wrapper { padding: 0; }
        .drawing-app-container #colorPicker::-webkit-color-swatch { border: none; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); }
        .drawing-app-container #brushSize { width: 90px; height: 45px; padding: 5px; border: 1px solid #ddd; border-radius: 12px; text-align: center; font-size: 16px; background-color: white; cursor: pointer; transition: all 0.2s ease; }
        .drawing-app-container #brushSize:focus { outline: none; border-color: #4a90e2; box-shadow: 0 0 5px rgba(74, 144, 226, 0.3); }
        .drawing-app-container #brushSize::-webkit-inner-spin-button, .drawing-app-container #brushSize::-webkit-outer-spin-button { opacity: 1; height: 30px; }
        .drawing-app-container canvas { margin-left: 160px; margin-top: 20px; margin-right: 20px; margin-bottom: 20px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); background-color: white; flex-grow: 1; }
        .drawing-app-container [title] { position: relative; }
        .drawing-app-container [title]:hover::after { content: attr(title); position: absolute; left: 120%; top: 50%; transform: translateY(-50%); background-color: #333; color: white; padding: 8px 12px; border-radius: 6px; font-size: 12px; white-space: nowrap; z-index: 1000; pointer-events: none; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
        .drawing-app-container [title]:hover::before { content: ''; position: absolute; left: 105%; top: 50%; transform: translateY(-50%); border: 6px solid transparent; border-right-color: #333; pointer-events: none; }
        @media (max-width: 768px) { .drawing-app-container { flex-direction: column; } .drawing-app-container .toolbar { position: static; width: 100%; height: auto; flex-direction: row; padding: 15px; justify-content: center; flex-wrap: wrap; gap: 10px; } .drawing-app-container canvas { margin: 20px; } .drawing-app-container [title]:hover::after { top: 120%; left: 50%; transform: translateX(-50%); } .drawing-app-container [title]:hover::before { top: 105%; left: 50%; transform: translateX(-50%); border: 6px solid transparent; border-bottom-color: #333; } }
        .drawing-app-container .tool-btn svg { width: 24px; height: 24px; transition: all 0.2s ease; }
        .drawing-app-container .tool-btn:hover svg { transform: scale(1.1); }
        .drawing-app-container .tool-btn.active svg { stroke: white; }
      `;
      document.head.appendChild(styleSheet);
    }

    createContainer() {
      this.container = document.createElement('div');
      this.container.classList.add('drawing-app-container');
      document.body.appendChild(this.container);
    }

    setupCanvas() {
      const { canvasId } = this.config;
      this.canvas = document.getElementById(canvasId) || document.createElement('canvas');
      this.canvas.id = canvasId;
      this.container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.resizeCanvas(true);
    }

    resizeCanvas(initial = false) {
      let imageData = null;
    
      if (!initial) {
        // Save current drawing only when resizing, not during initialization
        imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      }
    
      // Update canvas dimensions to match its container
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
    
      if (!initial && imageData) {
        // Restore previous drawing after resizing
        this.ctx.putImageData(imageData, 0, 0);
      } else {
        // Fill canvas with background color only during initialization
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }    

    setupToolbar() {
      this.toolbar = document.createElement('div');
      this.toolbar.classList.add('toolbar');
      this.container.insertBefore(this.toolbar, this.canvas);

      this.setupColorPicker();
      this.setupBrushSize();
      this.setupTools();
    }

    setupColorPicker() {
      this.colorPicker = document.createElement('input');
      this.colorPicker.type = 'color';
      this.colorPicker.id = 'colorPicker';
      this.colorPicker.value = '#000000';
      this.toolbar.appendChild(this.colorPicker);
    }

    setupBrushSize() {
      this.brushSize = document.createElement('input');
      this.brushSize.type = 'number';
      this.brushSize.id = 'brushSize';
      this.brushSize.min = '1';
      this.brushSize.max = '50';
      this.brushSize.value = '5';
      this.toolbar.appendChild(this.brushSize);
    }

    setupTools() {
      const tools = [
        { name: 'Brush', icon: '✏️', onClick: () => this.setTool('brush'), shortcut: 'b', id: 'brush', title: 'Brush (Ctrl+Shift+B)' },
        { name: 'Eraser', icon: '🧹', onClick: () => this.setTool('eraser'), shortcut: 'e', id: 'eraser', title: 'Eraser (Ctrl+Shift+E)' },
        { name: 'Line', icon: '╱', onClick: () => this.setTool('line'), shortcut: 'l', id: 'line', title: 'Line (Ctrl+Shift+L)' },
        { name: 'Rectangle', icon: '□', onClick: () => this.setTool('rectangle'), shortcut: 'r', id: 'rectangle', title: 'Rectangle (Ctrl+Shift+R)' },
        { name: 'Circle', icon: '○', onClick: () => this.setTool('circle'), shortcut: 'c', id: 'circle', title: 'Circle (Ctrl+Shift+C)' },
        { name: 'Undo', icon: '↩', onClick: () => this.undo(), shortcut: 'z', id: 'undo', title: 'Undo (Ctrl+Shift+Z)' },
        { name: 'Redo', icon: '↪', onClick: () => this.redo(), shortcut: 'y', id: 'redo', title: 'Redo (Ctrl+Shift+Y)' },
        { name: 'Clear', icon: '🗑', onClick: () => this.clearCanvas(), shortcut: 'x', id: 'clear', title: 'Clear (Ctrl+Shift+X)' },
        { name: 'Save', icon: '💾', onClick: () => this.downloadCanvas(), shortcut: 's', id: 'save', title: 'Save (Ctrl+Shift+S)' }
      ];

      tools.forEach(tool => {
        const button = this.createToolButton(tool);
        this.toolbar.appendChild(button);
      });
    }

    setTool(tool) {
      this.currentTool = tool;
      
      // Remove active class from all tool buttons
      const toolButtons = this.toolbar.querySelectorAll('.tool-btn');
      toolButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to selected tool button
      const activeButton = this.toolbar.querySelector(`#${tool}`);
      if (activeButton) {
        activeButton.classList.add('active');
      }
      
      switch (tool) {
        case 'brush':
          this.canvas.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'black\' stroke=\'black\' stroke-width=\'2\'%3E%3Cpath d=\'M2 22s4-2 5-6c.3-1 .8-2.2 2-3L19 3s2-2 3-1-1 3-1 3l-9 9c-.8 1-.9 1.7-1 2-1 4-6 6-6 6z\'/%3E%3C/svg%3E") 0 24, crosshair'
          break;
        case 'eraser':
          this.canvas.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'%23fff\' stroke=\'black\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'8\'/%3E%3C/svg%3E") 12 12, auto';
          break;
        default:
          this.canvas.style.cursor = 'crosshair';
      }
    }

    createToolButton(tool) {
      const button = document.createElement('button');
      button.textContent = tool.icon;
      button.setAttribute('title', tool.title);
      button.classList.add('tool-btn');
      button.id = tool.id;
      button.dataset.shortcut = tool.shortcut;
      if (tool.onClick) button.addEventListener('click', tool.onClick);
      return button;
    }

    setupEventListeners() {
      this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
      this.canvas.addEventListener('mousemove', (e) => this.draw(e));
      this.canvas.addEventListener('mouseup', () => this.stopDrawing());
      this.canvas.addEventListener('mouseout', () => this.stopDrawing());

      document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
      window.addEventListener('resize', () => this.resizeCanvas());
    }

    setupStateManagement() {
      this.undoStack = [];
      this.redoStack = [];
      this.saveState();
    }

    startDrawing(e) {
      this.isDrawing = true;
      this.startX = e.offsetX;
      this.startY = e.offsetY;
      this.lastDrawing = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    draw(e) {
      if (!this.isDrawing) return;

      const currentX = e.offsetX;
      const currentY = e.offsetY;

      if (['line', 'rectangle', 'circle'].includes(this.currentTool)) {
        this.ctx.putImageData(this.lastDrawing, 0, 0);
      }

      this.ctx.lineWidth = this.brushSize.value;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.strokeStyle = this.colorPicker.value;

      switch (this.currentTool) {
        case 'brush':
          this.ctx.lineTo(currentX, currentY);
          this.ctx.stroke();
          this.ctx.beginPath();
          this.ctx.moveTo(currentX, currentY);
          break;

        case 'eraser':
          this.ctx.save();
          this.ctx.beginPath();
          this.ctx.arc(currentX, currentY, this.brushSize.value / 2, 0, Math.PI * 2);
          this.ctx.clip();
          this.ctx.clearRect(currentX - this.brushSize.value / 2, currentY - this.brushSize.value / 2, this.brushSize.value, this.brushSize.value);
          this.ctx.fillStyle = 'white';
          this.ctx.fillRect(currentX - this.brushSize.value / 2, currentY - this.brushSize.value / 2, this.brushSize.value, this.brushSize.value);
          this.ctx.restore();
          break;

        case 'line':
          this.ctx.beginPath();
          this.ctx.moveTo(this.startX, this.startY);
          this.ctx.lineTo(currentX, currentY);
          this.ctx.stroke();
          break;

        case 'rectangle':
          this.ctx.beginPath();
          this.ctx.rect(this.startX, this.startY, currentX - this.startX, currentY - this.startY);
          this.ctx.stroke();
          break;

        case 'circle':
          this.ctx.beginPath();
          const radius = Math.sqrt(Math.pow(currentX - this.startX, 2) + Math.pow(currentY - this.startY, 2));
          this.ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
          this.ctx.stroke();
          break;
      }
    }

    stopDrawing() {
      if (!this.isDrawing) return;
      this.isDrawing = false;
      this.ctx.beginPath();
      this.saveState();
    }

    saveState() {
      this.undoStack.push(this.canvas.toDataURL());
      this.redoStack = [];
    }

    undo() {
      if (this.undoStack.length > 1) {
        this.redoStack.push(this.undoStack.pop());
        this.loadState(this.undoStack[this.undoStack.length - 1]);
      }
    }

    redo() {
      if (this.redoStack.length > 0) {
        this.undoStack.push(this.redoStack[this.redoStack.length - 1]);
        this.loadState(this.redoStack.pop());
      }
    }

    loadState(state) {
      const img = new Image();
      img.src = state;
      img.onload = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(img, 0, 0);
      };
    }

    clearCanvas() {
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.saveState();
    }

    downloadCanvas() {
      const link = document.createElement('a');
      link.download = 'my-drawing.png';
      link.href = this.canvas.toDataURL();
      link.click();
    }

    handleKeyboardShortcuts(e) {
      const isCtrlOrCmdPressed = e.ctrlKey || e.metaKey;
      const isShiftPressed = e.shiftKey;

      if (!isCtrlOrCmdPressed || !isShiftPressed || e.target.tagName === 'INPUT') return;

      const key = e.key.toLowerCase();
      const toolButton = Array.from(document.querySelectorAll('.tool-btn')).find(
        btn => btn.dataset.shortcut === key
      );

      if (toolButton) {
        e.preventDefault();
        toolButton.click();
      }
    }
  }

  global.DrawingApp = DrawingApp;
})(window);
