# Duud Implementation Plan

## MVP Architecture

### 1. Project Structure
```
Duud/
├── docs/
│   ├── project-description.md
│   └── implementation-plan.md
├── src/
│   ├── shapes.ts          # Shape drawing functions
│   ├── canvas.ts          # Canvas management
│   ├── codeGenerator.ts   # TypeScript code generation
│   └── app.ts             # Main application logic
├── public/
│   └── index.html         # GUI interface
├── package.json
└── tsconfig.json
```

### 2. Core Components

#### Shape Drawing Functions (shapes.ts)
- `drawRectangle(ctx, x, y, width, height, color)`
- `drawCircle(ctx, x, y, radius, color)`
- `drawTriangle(ctx, x1, y1, x2, y2, x3, y3, color)`
- `drawLine(ctx, x1, y1, x2, y2, color, width)`
- Each function draws directly on canvas context

#### Canvas Manager (canvas.ts)
- Initialize canvas with transparent background
- Manage canvas state
- Clear and redraw functions
- Handle shape placement

#### Code Generator (codeGenerator.ts)
- Convert placed shapes to TypeScript code
- Maintain shape list with parameters
- Generate executable code string
- Display generated code in UI

#### Main Application (app.ts)
- GUI event handlers
- Shape selection logic
- Canvas click handling for placement
- Render and export to PNG

### 3. User Interface

#### Layout
```
+----------------------------------+
|  Shape Selector: [Dropdown]      |
|  Color: [Color Picker]           |
|  [Render PNG Button]             |
+----------------------------------+
|                                  |
|        Canvas Area               |
|        (800x600)                 |
|                                  |
+----------------------------------+
|  Generated Code:                 |
|  [Code Display Area]             |
+----------------------------------+
```

#### Shape Placement Flow
1. User selects shape type from dropdown
2. User selects color
3. User clicks on canvas
4. Shape is drawn at click position with default size
5. Code is generated and displayed
6. User can place more shapes
7. Click "Render PNG" to export

### 4. Implementation Steps

1. **Setup** (TypeScript project with basic config)
2. **Shapes Module** (Implement basic shape drawing functions)
3. **Canvas Module** (Canvas initialization and management)
4. **GUI** (HTML interface with controls)
5. **Code Generator** (Shape to code conversion)
6. **Export** (PNG download functionality)
7. **Integration** (Wire all components together)

### 5. MVP Limitations

- Fixed canvas size (800x600)
- No shape editing after placement
- No undo/redo
- Basic shape set only
- No shape parameters UI (uses defaults)
- No save/load project feature

### 6. Future Enhancements (Post-MVP)

- Shape parameter controls (size, rotation, etc.)
- Shape selection and editing
- Undo/redo functionality
- Save/load projects
- More complex shapes
- Layers support
- Code export as .ts file
