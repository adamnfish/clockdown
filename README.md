Clockdown
=========

Simple game timer.

## Development

To run the development server:
```bash
npm install
npm run dev
```

To build for production:
```bash
npm run build
```

## Deployment

This project uses GitHub Actions for automatic deployment to GitHub Pages. The workflow builds the site and publishes it whenever changes are pushed to the main branch.

### Setting up GitHub Pages with GitHub Actions

To configure the repository to use GitHub Actions for publishing (instead of the docs folder), follow these steps:

1. Go to your repository settings on GitHub
2. Navigate to **Pages** in the left sidebar
3. Under **Source**, select **"GitHub Actions"** instead of "Deploy from a branch"
4. The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically build and deploy the site

That's it! Your site will now be automatically built and deployed whenever you push to the main branch.

The workflow will:
- Install dependencies with `npm ci`
- Build the site with `npm run build` (outputs to `dist/`)
- Deploy the built files to GitHub Pages

## Build Process

The build process uses Parcel to bundle the Elm application:
- Source files are in `src/`
- Built files are output to `dist/` (excluded from git)
- The main entry point is `src/index.html`
