# Drawinz - Simple JavaScript Drawing Tool

![Drawinz Logo](https://cdn.jsdelivr.net/gh/Inzmam/drawinz@v1.0.0/logo.png) *(Optional: Add your project logo here)*

**Drawinz** is a lightweight JavaScript library that allows you to integrate a simple drawing tool into any webpage with ease. It supports basic drawing functionalities like brush, eraser, and line tool.

## 🚀 Features

- 🖌️ **Brush Tool** - Draw freehand on the canvas.
- 🧽 **Eraser Tool** - Erase parts of your drawing.
- 📏 **Line Tool** - Draw straight lines.
- 📦 **Minimal Setup** - Just include the script and initialize the tool.
- 🎨 **Customizable** - Extend and modify easily as needed.

## 📦 Installation

You can use Drawinz via **jsDelivr CDN**:

```html
<script src="https://cdn.jsdelivr.net/gh/Inzmam/drawinz@v1.0.0/darwinz.js"></script>
```

Or download the script and include it locally:

```html
<script src="path/to/drawinz.js"></script>
```

## 🛠️ Usage

Setting up Drawinz is super easy! Just create a `<canvas>` element and initialize the tool with the canvas ID.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Drawing App</title>
  <script src="https://cdn.jsdelivr.net/gh/Inzmam/drawinz@v1.0.0/darwinz.js"></script>
</head>
<body>
  <canvas id="drawingCanvas" style="border: 1px solid #000;"></canvas>

  <script>
    new DrawingApp({
      canvasId: 'drawingCanvas'
    });
  </script>
</body>
</html>
```

## 🔧 Configuration Options

You can pass the following options when initializing `DrawingApp`:

| Option       | Type   | Default  | Description                          |
|-------------|--------|-----------|--------------------------------------|
| `canvasId`  | string | required  | The ID of the `<canvas>` element.   |

## 🖍️ Tools

By default, Drawinz includes the following tools:

- **Brush Tool** (Default) - Allows freehand drawing.
- **Eraser Tool** - Erases parts of the drawing.
- **Line Tool** - Draws straight lines.

## 📜 License

This project is licensed under the **MIT License** - feel free to use and modify it!

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this tool, fork the repo and submit a pull request.

## 🌟 Support

If you like this project, give it a ⭐ on GitHub!

---

🎨 Happy Drawing! 🚀
