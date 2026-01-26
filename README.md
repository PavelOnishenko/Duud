# Duud - Code-Based Image Generator

Generate sprites with code, not pixels!

## What is Duud?

Duud is a TypeScript-based tool that lets you create images by placing shapes on a canvas. Each shape you place generates TypeScript code, and you can export your creation as a PNG file with transparent background.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Start the server:**
   ```bash
   npm run serve
   ``` 

4. **Open your browser:**
   Navigate to `http://localhost:8080`

## How to Use

1. **Select a shape** from the dropdown (Circle, Rectangle, Triangle, Star)
2. **Pick a color** using the color picker
3. **Click on the canvas** to place shapes
4. **Watch the code generate** in real-time on the right panel
5. **Click "Render PNG"** to download your sprite as a PNG file
6. **Click "Clear Canvas"** to start over

## Features

- ✅ Multiple geometric shapes (Circle, Rectangle, Triangle, Star)
- ✅ Color picker for customization
- ✅ Real-time TypeScript code generation
- ✅ PNG export with transparent background
- ✅ Clean, simple interface

## Project Structure

```
Duud/
├── docs/                    # Documentation
├── src/                     # TypeScript source files
│   ├── shapes.ts           # Shape drawing functions
│   ├── canvas.ts           # Canvas management
│   ├── codeGenerator.ts    # Code generation logic
│   └── app.ts              # Main application
├── public/                  # Static files
│   ├── index.html          # Main HTML interface
│   └── dist/               # Compiled JavaScript (generated)
└── package.json
```

## Technology Stack

- TypeScript
- HTML5 Canvas API
- Vanilla JavaScript (no frameworks)

## License

MIT
