(function (global) {
  'use strict';

  function DrawingApp(config) {
    const { canvasId } = config;

    // Add Font Awesome dynamically
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesome);

    // Add CSS styles dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      .drawing-app-container {
        text-align: center;
        display: flex;
        min-height: 100vh;
        color: #333;
      }

      .drawing-app-container .toolbar {
        background-color: #ffffff;
        padding: 20px 15px;
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 25px;
        height: 100vh;
        width: 120px;
        position: fixed;
        left: 0;
        top: 0;
      }

      .drawing-app-container .tool-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 15px 0;
        border-bottom: 2px solid #f0f0f0;
      }

      .drawing-app-container .tool-group:last-child {
        border-bottom: none;
      }

      .drawing-app-container .tool-btn {
        width: 90px;
        height: 45px;
        border: none;
        background-color: #fff;
        border-radius: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        font-size: 24px;
      }

      .drawing-app-container .tool-btn:hover {
        background-color: #f8f8f8;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .drawing-app-container .tool-btn.active {
        background-color: #4a90e2;
        color: white;
      }

      .drawing-app-container .tool-btn.active i {
        color: white;
      }

      .drawing-app-container .tool-btn i {
        font-size: 1.2rem;
        color: #555;
      }

      .drawing-app-container #colorPicker {
        width: 90px;
        height: 45px;
        padding: 5px;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        background-color: transparent;
      }

      .drawing-app-container #colorPicker::-webkit-color-swatch-wrapper {
        padding: 0;
      }

      .drawing-app-container #colorPicker::-webkit-color-swatch {
        border: none;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }

      .drawing-app-container #brushSize {
        width: 90px;
        height: 45px;
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 12px;
        text-align: center;
        font-size: 16px;
        background-color: white;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .drawing-app-container #brushSize:focus {
        outline: none;
        border-color: #4a90e2;
        box-shadow: 0 0 5px rgba(74, 144, 226, 0.3);
      }

      .drawing-app-container #brushSize::-webkit-inner-spin-button,
      .drawing-app-container #brushSize::-webkit-outer-spin-button {
        opacity: 1;
        height: 30px;
      }

      .drawing-app-container canvas {
        margin-left: 160px;
        margin-top: 20px;
        margin-right: 20px;
        margin-bottom: 20px;
        border-radius: 15px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        background-color: white;
        flex-grow: 1;
      }

      .drawing-app-container [title] {
        position: relative;
      }

      .drawing-app-container [title]:hover::after {
        content: attr(title);
        position: absolute;
        left: 120%;
        top: 50%;
        transform: translateY(-50%);
        background-color: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .drawing-app-container [title]:hover::before {
        content: '';
        position: absolute;
        left: 105%;
        top: 50%;
        transform: translateY(-50%);
        border: 6px solid transparent;
        border-right-color: #333;
        pointer-events: none;
      }

      @media (max-width: 768px) {
        .drawing-app-container {
          flex-direction: column;
        }

        .drawing-app-container .toolbar {
          position: static;
          width: 100%;
          height: auto;
          flex-direction: row;
          padding: 15px;
          justify-content: center;
        }

        .drawing-app-container .tool-group {
          flex-direction: row;
          padding: 0 15px;
          border-bottom: none;
          border-right: 2px solid #f0f0f0;
        }

        .drawing-app-container .tool-group:last-child {
          border-right: none;
        }

        .drawing-app-container #brushSize {
          transform: none;
          width: 100px;
          margin: 0;
        }

        .drawing-app-container canvas {
          margin: 20px;
        }

        .drawing-app-container [title]:hover::after {
          top: 120%;
          left: 50%;
          transform: translateX(-50%);
        }

        .drawing-app-container [title]:hover::before {
          top: 105%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-bottom-color: #333;
        }
      }

      .drawing-app-container .tool-btn svg {
        width: 24px;
        height: 24px;
        transition: all 0.2s ease;
      }

      .drawing-app-container .tool-btn:hover svg {
        transform: scale(1.1);
      }

      .drawing-app-container .tool-btn.active svg {
        stroke: white;
      }
    `;
    document.head.appendChild(styleSheet);

    // Create container
    const container = document.createElement('div');
    container.classList.add('drawing-app-container');
    document.body.appendChild(container);

    // Create canvas element if not provided
    let canvas = document.getElementById(canvasId);
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = canvasId;
    }
    container.appendChild(canvas);

    // Get canvas context
    const ctx = canvas.getContext('2d');

    // Create toolbar
    const toolbar = document.createElement('div');
    toolbar.classList.add('toolbar');
    container.insertBefore(toolbar, canvas);

    // Create tool groups
    const colorGroup = document.createElement('div');
    colorGroup.classList.add('tool-group');
    toolbar.appendChild(colorGroup);

    const brushGroup = document.createElement('div');
    brushGroup.classList.add('tool-group');
    toolbar.appendChild(brushGroup);

    const toolsGroup = document.createElement('div');
    toolsGroup.classList.add('tool-group');
    toolbar.appendChild(toolsGroup);

    const actionsGroup = document.createElement('div');
    actionsGroup.classList.add('tool-group');
    toolbar.appendChild(actionsGroup);

    // Create color picker
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.id = 'colorPicker';
    colorPicker.value = '#000000';
    colorGroup.appendChild(colorPicker);

    // Create brush size input
    const brushSize = document.createElement('input');
    brushSize.type = 'number';
    brushSize.id = 'brushSize';
    brushSize.min = '1';
    brushSize.max = '50';
    brushSize.value = '5';
    brushGroup.appendChild(brushSize);

    // Create tool buttons
    const tools = [
      { name: 'Brush', icon: '✏️' },
      { name: 'Eraser', icon: '🧹' },
      { name: 'Line', icon: '╱' },
      { name: 'Rectangle', icon: '□' },
      { name: 'Circle', icon: '○' }
    ];
    tools.forEach(tool => {
      const button = document.createElement('button');
      button.textContent = tool.icon;
      button.setAttribute('title', tool.name);
      button.classList.add('tool-btn');
      toolsGroup.appendChild(button);
    });

    // Create action buttons (Undo, Redo, Clear Canvas, Download)
    const actions = [
      { title: 'Undo', icon: '↩', onClick: undo },
      { title: 'Redo', icon: '↪', onClick: redo },
      { title: 'Clear', icon: '🗑', onClick: clearCanvas },
      { title: 'Save', icon: '💾', onClick: downloadCanvas }
    ];
    actions.forEach(action => {
      const button = document.createElement('button');
      button.textContent = action.icon;
      button.setAttribute('title', action.title);
      button.classList.add('tool-btn');
      button.addEventListener('click', action.onClick);
      actionsGroup.appendChild(button);
    });

    // Drawing state
    let isDrawing = false;
    let currentTool = 'Brush Tool';
    let undoStack = [];
    let redoStack = [];
    let startX, startY; // Starting position for shapes
    let lastDrawing = null; // Store the last canvas state

    // Modify resizeCanvas function
    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Initial setup
    resizeCanvas();

    // Save initial canvas state
    saveState();

    // Tool selection
    const toolButtons = document.querySelectorAll('.tool-btn');
    toolButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        toolButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        // Set current tool based on title attribute
        currentTool = button.getAttribute('title');
      });
    });

    // Drawing event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    function startDrawing(e) {
      isDrawing = true;
      startX = e.offsetX;
      startY = e.offsetY;

      // Save the current canvas state before starting to draw
      lastDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    function draw(e) {
      if (!isDrawing) return;

      const currentX = e.offsetX;
      const currentY = e.offsetY;

      // Restore the last saved state before drawing new preview
      if (['Line', 'Rectangle', 'Circle'].includes(currentTool)) {
        ctx.putImageData(lastDrawing, 0, 0);
      }

      ctx.lineWidth = brushSize.value;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = colorPicker.value;
      
      switch(currentTool) {
        case 'Brush':
          ctx.lineTo(currentX, currentY);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(currentX, currentY);
          break;

        case 'Eraser':
          // Save current context state
          ctx.save();
          
          // Create clipping path for eraser
          ctx.beginPath();
          ctx.arc(currentX, currentY, brushSize.value/2, 0, Math.PI * 2);
          ctx.clip();
          
          // Clear the clipped area
          ctx.clearRect(currentX - brushSize.value/2, currentY - brushSize.value/2, 
                       brushSize.value, brushSize.value);
          
          // Fill with white background
          ctx.fillStyle = 'white';
          ctx.fillRect(currentX - brushSize.value/2, currentY - brushSize.value/2, 
                      brushSize.value, brushSize.value);
          
          // Restore context state
          ctx.restore();
          break;

        case 'Line':
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();
          break;

        case 'Rectangle':
          ctx.beginPath();
          ctx.rect(
            startX, 
            startY, 
            currentX - startX, 
            currentY - startY
          );
          ctx.stroke();
          break;

        case 'Circle':
          ctx.beginPath();
          const radius = Math.sqrt(
            Math.pow(currentX - startX, 2) + 
            Math.pow(currentY - startY, 2)
          );
          ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
          ctx.stroke();
          break;
      }
    }

    function stopDrawing() {
      if (!isDrawing) return;
      
      isDrawing = false;
      ctx.beginPath();
      saveState();
    }

    // Save canvas state for undo/redo
    function saveState() {
      undoStack.push(canvas.toDataURL());
      // Clear redo stack when new action is performed
      redoStack = [];
    }

    // Undo function
    function undo() {
      if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        loadState(undoStack[undoStack.length - 1]);
      }
    }

    // Redo function
    function redo() {
      if (redoStack.length > 0) {
        undoStack.push(redoStack[redoStack.length - 1]);
        loadState(redoStack.pop());
      }
    }

    // Load canvas state
    function loadState(state) {
      const img = new Image();
      img.src = state;
      img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    }

    // Modify clearCanvas function
    function clearCanvas() {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveState();
    }

    // Download canvas function
    function downloadCanvas() {
      const link = document.createElement('a');
      link.download = 'my-drawing.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  }

  global.DrawingApp = DrawingApp;
})(window);
