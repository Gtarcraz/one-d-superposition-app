# 1D Wave Superposition Teaching App

A Vite + React classroom demo for teaching **superposition** to secondary school students.

Students can adjust two waves and immediately see:

- Wave 1
- Wave 2
- The total wave: `Wave 1 + Wave 2`
- The frequency spectrum of the total wave

## Live GitHub Pages URL

After deployment, the app should be available at:

```text
https://Gtarcraz.github.io/one-d-superposition-app/
```

If you rename the GitHub repository, update the `base` value in `vite.config.js`.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

## Deploy to GitHub Pages

### 1. Push this project to GitHub

```bash
git init
git add .
git commit -m "Initial commit: 1D wave superposition app"
git branch -M main
git remote add origin git@github.com:Gtarcraz/one-d-superposition-app.git
git push -u origin main
```

If the remote already exists, use:

```bash
git remote set-url origin git@github.com:Gtarcraz/one-d-superposition-app.git
git push -u origin main
```

### 2. Deploy

```bash
npm install
npm run deploy
```

This will build the app and publish the `dist/` folder to the `gh-pages` branch.

### 3. Enable GitHub Pages

In the GitHub repository:

```text
Settings → Pages → Source: Deploy from a branch → Branch: gh-pages → Folder: / root → Save
```

Your app should then be live at:

```text
https://Gtarcraz.github.io/one-d-superposition-app/
```

## Common blank-page fix

If the page is blank after deployment, check `vite.config.js`:

```js
base: "/one-d-superposition-app/",
```

The leading and trailing slashes are important.

Then redeploy:

```bash
npm run deploy
```

## Features

- Two adjustable waves
- Frequency sliders
- Amplitude sliders
- Phase offset sliders
- Individual wave display
- Total superposed wave display
- FFT-style frequency spectrum
- Demo buttons for constructive interference, destructive interference, and beat patterns

## Teaching idea

Start by setting Wave 2 amplitude to zero. Then slowly increase Wave 2 amplitude so students see the second wave joining the first. After that, use the demo buttons to show constructive interference, destructive interference, and beats.


## QR Code for Students

This ZIP includes a QR code image after deployment:

```text
public/qr-code.png
```

It points to:

```text
https://gtarcraz.github.io/one-d-superposition-app/
```

You can place this QR code into your PowerPoint slide so students can open the app on their phones.

After deployment, the QR code should open the live app at:

```text
https://gtarcraz.github.io/one-d-superposition-app/
```

If you change the repository name or GitHub username, regenerate the QR code with the new GitHub Pages URL.
