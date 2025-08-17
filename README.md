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

Remember to run elm-format when making changes to the source code.

    npm run format

### Dependency updates

Do not edit the elm.json file directly. Use the elm-json tool to manage dependency updates, which can be run using the `deps` script.

    npm run deps -- install <package>

For more information run `npm run deps -- --help` (or use elm-json directly with `npx elm-json`).

## Deployment

This project uses GitHub Actions for automatic deployment to GitHub Pages. The workflow builds the site and publishes it whenever changes are pushed to the main branch.

## Build Process

The build process uses Parcel to bundle the Elm application:
- Source files are in `src/`
- Built files are output to `dist/` (excluded from git)
- The main entry point is `src/index.html`
