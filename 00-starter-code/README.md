# Pragmatic Drag and Drop Starter Code

This project is based on the tutorial for Pragmatic Drag and Drop from Atlassian Design, which you can find [here](https://atlassian.design/components/pragmatic-drag-and-drop/tutorial).

In this project:

- We have removed dependencies (instead of using emotionm, just use plain css).
- We have structured the project in a way that is easy to understand and extend.
- We have added step by step guides to reproduce the tutorial.

## Getting started

Install dependencies:

```bash
npm install
```

Run the project

```bash
npm run dev
```

Now you can open your browser and go to `http://localhost:5173` to see the project.

And starting building the next step by following the guide located in:

https://github.com/Lemoncode/pragamatic-drag-and-drop-tutorial-typescript/blob/main/01-step-1-pieces-draggable/README.md

Follow the step-by-step guides in the guides directory for each example.

## Project Structure

The project is structured as follows:

```
├── src
│ ├── assets
│ ├── board
│ ├── App.tsx
│ ├── index.css
│ ├── main.tsx
│ └── vite-env.d.ts
├── package.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

Main folders:

- `assets`: Contains the images used in the project.
- `board`: Contains the components for the board (pieces, square, squares, chessboard).
- `App.tsx`: Main component of the project.
- `index.css`: Main css file (contains some generic CSS styling).
- `main.tsx`: Entry point of the project (`ReactDOM.createRoot`).
- `vite-env.d.ts`: Typescript file for Vite.
