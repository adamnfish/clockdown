# Clockdown - Game Timer Application

Clockdown is an Elm web application that provides a multi-player game timer interface. Players can start, pause, and track their individual game time using colored timer sections.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Prerequisites and Installation
The build system has been modernized and now uses standard npm workflows:

**Standard npm workflow:**
- `npm install` -- **WORKS** - installs all dependencies successfully (takes ~45-60 seconds)
- All development tools are included as local dependencies in package.json
- No need for global tool installations

**Development Scripts (use these instead of global tools):**
- `npm run dev` -- starts Parcel development server
- `npm run build` -- builds production version to `dist/` directory  
- `npm run format` -- runs elm-format on source files (**ALWAYS run after making changes**)
- `npm run test` -- runs elm-test (fails due to network restrictions)
- `npm run review` -- runs elm-review (available but don't run yet - see notes)
- `npm run deps` -- runs elm-json for dependency management

### Running the Application
**Development server (recommended):**
- `npm run dev` -- starts Parcel dev server (usually on port 1234)
- Hot reloading and development features included
-- **NOTE:** If the dev server fails due to network timeouts downloading Elm packages on first run, retry the command until it succeeds. Do not give up after the first failure.

**Alternative for testing:**
- `npm run build` to create `dist/` directory (if network allows)
- Serve `dist/` directory: `cd dist && python3 -m http.server 8000`

### Build Process
Building works locally but has network limitations - retry the command if it fails:

- `npm run build` -- **PARTIALLY WORKS** - may initially fail due to package.elm-lang.org network timeouts
- `npm run dev` -- **PARTIALLY WORKS** - may fail on first run due to package downloads
- Local tooling (parcel, elm-format) works fine once packages are available

### Testing and Code Quality
- `npm run test` -- runs the elm tests
- `npm run format` -- always run this after making changes to source code
- `npm run review` -- **AVAILABLE** but don't run yet (future task to configure rules)

## Validation

### ALWAYS test these user scenarios after making changes:
1. **Application Start**: Run `npm run dev` or serve `dist/` directory and verify application loads with "Start" and "+ player" buttons
2. **Timer Functionality**: Click "Start" to begin game, verify colored player sections appear with "start" buttons
3. **Player Timer Control**: Click on a player's "start" button to activate their individual timer
4. **Timer Display**: Verify time displays in seconds format ("11\"") - timer counts up from 0
5. **Pause/Resume**: Click "Pause" button and verify timer stops, button changes to "Resume"
6. **Resume Functionality**: Click "Resume" button and verify timer continues from where it stopped
7. **Multiple Players**: Test adding additional players and switching between active timers
8. **Visual States**: Verify paused timers show striped pattern overlay

### Manual Validation Process
- ALWAYS run `npm run format` after making any code changes
- Use `npm run dev` for development testing (may fail on first run due to network)
- If dev server fails, retry. As a last resort build with `npm run build` and serve the `dist/` directory
- Take screenshots to document UI changes
- Test complete timer workflows: start → player selection → timing → pause → resume
- Verify time display formatting works correctly (starts at 0, counts up in seconds)
- Verify pause state shows "Resume" button and striped background pattern

## Repository Structure

### Key Files and Directories
```
.
├── README.md                    # Project description and development instructions
├── package.json                 # Contains npm scripts: dev, build, test, format, review, deps
├── package-lock.json            # Locked dependency versions
├── elm.json                     # Elm project configuration (DO NOT edit directly - use npm run deps)
├── .gitignore                   # Excludes .parcel-cache/, elm-stuff/, node_modules/, dist/
├── dist/                        # Build output directory (created by npm run build)
├── node_modules/                # npm dependencies (created by npm install)
└── src/                         # Source code
    ├── Main.elm                # Main application logic (Model, View, Update)
    ├── index.html              # HTML entry point template
    ├── index.js                # JavaScript entry point (initializes Elm app)
    └── stripes.svg             # SVG pattern for paused timer display
```

### Important Code Locations
- **Timer Logic**: `src/Main.elm` contains all game timer state management
- **Player Management**: Color definitions and player addition logic in `src/Main.elm`
- **UI Components**: Timer display formatting and player section rendering in `src/Main.elm`
- **Entry Point**: `src/index.js` initializes the Elm application with resource flags
- **Styling**: Inline styles within Elm UI framework (mdgriffith/elm-ui)

## Common Tasks

### Making Code Changes
1. Edit source files in `src/` directory
2. **ALWAYS** run `npm run format` after making changes
3. Test changes using `npm run dev` or build and serve `dist/`
4. Network restrictions may prevent initial builds from working

### Development Workflow
**Using development server:**
```bash
cd /home/runner/work/clockdown/clockdown
npm install  # if not done already
npm run dev  # starts development server
# Access at http://localhost:1234 (or port shown in output)
```

**Using build and serve method:**
```bash
cd /home/runner/work/clockdown/clockdown
npm run build  # builds to dist/ directory
cd dist && python3 -m http.server 8000
# Access at http://localhost:8000
```

### Dependency Management
**CRITICAL:** Do not edit `elm.json` directly. Use the elm-json tool instead:
- `npm run deps -- install <package>` -- add a new Elm package
- `npm run deps -- --help` -- see all available options
- Use `npx elm-json` for direct access to the tool

### Package.json Scripts (Modern workflow)
- `npm run dev` -- **WORKS** (Parcel development server, may fail on network)
- `npm run build` -- **WORKS** (builds to dist/, may fail on network)
- `npm run format` -- **WORKS** (elm-format, always run after changes)
- `npm run test` -- **FAILS** (network restrictions prevent package downloads)
- `npm run review` -- **AVAILABLE** (elm-review, don't run yet - future task)
- `npm run deps` -- **WORKS** (elm-json for dependency management)

### File Operations Timing
- `npm install` -- completes in ~45-60 seconds (fully functional)
- `npm run format` -- completes in ~1-2 seconds
- `npm run dev` -- starts in ~3-5 seconds (may fail on package downloads)
- `npm run build` -- varies depending on network (may fail on package downloads)

## Application Features

### Timer Functionality
- Multi-player game timer with individual player sections
- Default setup: 2 players (red and blue sections)
- Supports adding additional players with different colors
- Time tracking in milliseconds with display formatting

### Player Colors Available
Based on `src/Main.elm` color definitions:
- Red: rgb255 180 100 100
- Blue: rgb255 100 150 180  
- Green: rgb255 100 180 100
- Yellow: rgb255 180 180 100
- Purple: rgb255 150 100 180
- Orange: rgb255 200 120 80
- Brown: rgb255 100 60 10

### Timer States
- **Welcome Screen**: Setup phase with "Start" and "+ player" buttons
- **Active Timer**: Running game with player sections and "Pause" button
- **Paused State**: Timers stopped with striped pattern overlay
- **Individual Player Active**: One player's timer running while others are idle

## Known Limitations

- **Network Restrictions**: Cannot download Elm packages from package.elm-lang.org due to timeouts
- **Elm Package Downloads**: Build and test scripts may fail on first run due to network restrictions  
- **Testing**: No functional automated test infrastructure due to network limitations
- **elm-review**: Available but should not be run yet (future task to configure rules)

## CRITICAL Reminders

- **ALWAYS** run `npm run format` after making any changes to source code
- **NEVER** edit `elm.json` directly - use `npm run deps` instead
- **DO NOT** run `npm run review` yet - this is a future task to configure rules
- Use `npm run dev` for development testing (may fail on first run due to network)
- Use `npm run build` + serve `dist/` as fallback if dev server fails
- Network restrictions may prevent initial builds - this is expected behavior
- `npm install` now works properly with the modernized build system