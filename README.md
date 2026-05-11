# 1D Wave Superposition Teaching App

Interactive Vite + React app for teaching secondary school students about 1D wave superposition.

## Features

- Two waves with adjustable frequency
- Adjustable amplitude and phase offset
- Individual wave display
- Total wave display
- FFT-style spectrum showing the frequency ingredients
- Demo presets:
  - Constructive interference
  - Destructive interference
  - Beat pattern
- QR code image for classroom access

## Local Run

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

## GitHub Pages Deployment Using GitHub Actions

This project is ready for GitHub Actions deployment.

### 1. Upload/push this project to your repo

Expected repo:

```text
https://github.com/Gtarcraz/one-d-superposition-app
```

### 2. In GitHub, set Pages source to Actions

Go to:

```text
Settings → Pages
```

Under **Build and deployment**, set:

```text
Source: GitHub Actions
```

### 3. Push to `main`

```bash
git add .
git commit -m "Add 1D superposition app with GitHub Actions deployment"
git push
```

GitHub will automatically run:

```text
Actions → Deploy Vite React App to GitHub Pages
```

### 4. Public URL

After deployment, the app should be available at:

```text
https://gtarcraz.github.io/one-d-superposition-app/
```

## QR Code

The QR code points to:

```text
https://gtarcraz.github.io/one-d-superposition-app/
```

QR image files:

```text
public/qr-code.png
public/qr-code-plain.png
```

Use `public/qr-code.png` in PowerPoint slides.

## Important Vite Setting

`vite.config.js` includes:

```js
base: "/one-d-superposition-app/"
```

Keep this if your GitHub repo name is `one-d-superposition-app`.
