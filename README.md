# Duud - Stick Figure Animation Studio

Create stick figure animations with an intuitive pose editor!

## What is Duud?

Duud is a TypeScript-based stick figure animation studio that lets you create animations by posing a pre-defined stick figure. Adjust joint angles, create keyframes, and export your animations as sprite sheets for use in games and other projects.

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

### Playing Pre-made Animations
1. **Select an animation** from the dropdown (Punch, Get Hit, Die)
2. **Click Play** to watch the animation
3. **Adjust the speed** using the speed slider
4. **Click "Render Sprite Sheet"** to export the animation

### Creating Custom Animations
1. **Use the Pose Editor sliders** to pose your stick figure:
   - Head & Torso: Head tilt, torso angle
   - Arms: Left/right shoulder and elbow angles
   - Legs: Left/right hip and knee angles
2. **Set a time** in the keyframe time input (e.g., 0, 0.5, 1.0)
3. **Click "Add Keyframe"** to save the current pose at that time
4. **Repeat** to create more keyframes at different times
5. **Click "Save Animation"** to save your animation
6. **Play and export** your custom animation!

### Exporting Sprite Sheets
1. Select the animation you want to export
2. Click "Render Sprite Sheet"
3. Enter the number of frames (1-100)
4. The sprite sheet will download automatically
5. Frames are arranged in a grid for easy use in game engines

## Features

- ✅ Pre-defined stick figure with realistic joints
- ✅ Interactive pose editor with sliders for all joints
- ✅ Keyframe-based animation system
- ✅ Create and save custom animations
- ✅ Pre-made animations (Punch, Get Hit, Die)
- ✅ Smooth interpolation between keyframes
- ✅ Sprite sheet rendering for game development
- ✅ Adjustable playback speed
- ✅ Clean, intuitive interface

## Project Structure

```
Duud/
├── docs/                    # Documentation
├── src/                     # TypeScript source files
│   ├── stickFigure.ts      # Stick figure rendering
│   ├── animator.ts         # Animation system
│   ├── animations.ts       # Pre-made animations
│   └── app.ts              # Main application
├── public/                  # Static files
│   ├── index.html          # Main HTML interface
│   └── dist/               # Compiled JavaScript (generated)
└── package.json
```

## Animation System

### Keyframes
Each keyframe stores:
- **Time**: When in the animation (in seconds)
- **Joint angles**: All joint rotations at that moment

### Interpolation
The animator smoothly transitions between keyframes using:
- Linear interpolation for smooth movement
- Easing functions for natural motion

### Sprite Sheets
Exported sprite sheets contain:
- Multiple frames arranged in a grid
- Configurable frame count (1-100)
- Optimized dimensions for game engines
- Transparent background

## Technology Stack

- TypeScript
- HTML5 Canvas API
- Vanilla JavaScript (no frameworks)
- Keyframe animation system

## Use Cases

- **Game Development**: Create character animations for 2D games
- **Animation Learning**: Understand keyframe animation principles
- **Rapid Prototyping**: Quickly test animation ideas
- **Sprite Generation**: Export ready-to-use sprite sheets

## License

MIT
