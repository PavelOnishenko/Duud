# Duud - Code-Based Image Generator

## Overview
Duud is a TypeScript-based tool that generates images through code rather than traditional drawing. It allows users to create sprites by placing geometric and complex shapes on a canvas using a GUI, which automatically generates the corresponding TypeScript code. The final output is a PNG file with transparent background.

## Core Concept
- **Draw with Code**: Instead of pixel manipulation, shapes are defined programmatically
- **GUI to Code**: Visual placement of shapes generates TypeScript drawing code
- **Code to Image**: The generated code renders to a PNG sprite
- **Transparent Background**: All non-shape areas remain transparent

## Key Features
1. **Shape Library**: Functions for drawing geometric and complex shapes
2. **Interactive Canvas**: Visual workspace for placing and arranging shapes
3. **Code Generation**: Automatic TypeScript code generation as shapes are placed
4. **Live Preview**: Real-time canvas rendering
5. **PNG Export**: Render button to save final sprite as .png file

## Use Cases
- Creating game sprites
- Generating icons and UI elements
- Procedural graphics for web applications
- Educational tool for learning canvas APIs

## Technology Stack
- TypeScript for type-safe code generation
- HTML5 Canvas for rendering
- Vanilla JavaScript (no frameworks for MVP)
- Canvas API for PNG export
