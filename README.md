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

## Testing

### Unit Tests
```bash
npm test
```

### End-to-End Tests
```bash
# Full test runner with automatic server setup
npm run test:e2e:run

# Or run Playwright directly (requires browsers installed)
npm run test:e2e
```

The e2e tests are located in the `e2e/` directory and test the core functionality:
- Application startup and navigation
- Player management (adding players, different counts)
- Timer functionality (start, pause, resume, player switching)
- Layout and visual appearance at various player counts

See `e2e/README.md` for detailed information about the e2e test setup and coverage.

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
