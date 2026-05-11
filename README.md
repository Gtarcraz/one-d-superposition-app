# 1D Wave Superposition Teaching App

A Vite + React classroom demo for teaching **superposition** to secondary school students.

Students can adjust two waves and immediately see:

- Wave 1
- Wave 2
- The total wave: `Wave 1 + Wave 2`
- The frequency spectrum of the total wave

## Features

- Two adjustable waves
- Frequency sliders
- Amplitude sliders
- Phase offset sliders
- Individual wave display
- Total superposed wave display
- FFT-style frequency spectrum
- Demo buttons for:
  - Constructive interference
  - Destructive interference
  - Beat pattern

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

## Build for upload/deployment

```bash
npm run build
```

The production files will be generated in:

```text
dist/
```

## Upload to GitHub

1. Create a new GitHub repository.
2. Upload all files from this folder.
3. Commit the files.
4. Optionally deploy with GitHub Pages, Netlify, or Vercel.

## Teaching idea

Start by setting Wave 2 amplitude to zero. Then slowly increase Wave 2 amplitude so students see the second wave joining the first. After that, use the demo buttons to show constructive interference, destructive interference, and beats.
