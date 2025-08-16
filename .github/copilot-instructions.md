# Clockdown - Game Timer Application

Clockdown is an Elm web application that provides a multi-player game timer interface. Players can start, pause, and track their individual game time using colored timer sections.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Prerequisites and Installation
Due to native dependency compilation issues, the standard npm workflow does not work. Use these alternative approaches:

- Install global tools to avoid local dependency conflicts:
  - `npm install -g elm@0.19.1-5` -- installs in ~11 seconds
  - `npm install -g parcel@2.3.2` -- installs in ~58 seconds  
  - `npm install -g @parcel/transformer-elm@2.3.2` -- installs in ~24 seconds
  - `npm install -g elm-test` -- installs in ~8 seconds (note: version compatibility issues exist)

### DO NOT attempt npm install 
- `npm install` -- **FAILS** due to lmdb native compilation errors with current Node.js version
- `npm install --force` -- **FAILS** after ~5 seconds with make compilation errors
- The local package.json dependencies cannot be installed due to native binding incompatibilities

### Running the Application
The application can be run using the pre-built version in the `docs/` directory:

- **Recommended approach**: `cd docs && python3 -m http.server 8000` -- starts immediately
- Access at `http://localhost:8000`
- The built version is fully functional and ready for testing

### Build Process
Building from source has network and dependency limitations:

- `elm make src/Main.elm --output=test.js` -- **FAILS** due to package.elm-lang.org network timeouts
- `parcel build src/index.html --dist-dir test-build` -- **FAILS** without local transformer installation (~1 second)
- `parcel src/index.html --port 3000` -- **FAILS** due to missing local dependencies

### Testing
- `elm-test` -- **FAILS** due to version incompatibility (elm-explorations/test 1.0.0 vs required 2.x)
- No unit test infrastructure is currently functional
- Manual testing is the primary validation method

## Validation

### ALWAYS test these user scenarios after making changes:
1. **Application Start**: Serve docs/ directory and verify application loads with "Start" and "+ player" buttons
2. **Timer Functionality**: Click "Start" to begin game, verify colored player sections appear with "start" buttons
3. **Player Timer Control**: Click on a player's "start" button to activate their individual timer
4. **Timer Display**: Verify time displays in seconds format ("11\"") - timer counts up from 0
5. **Pause/Resume**: Click "Pause" button and verify timer stops, button changes to "Resume"
6. **Resume Functionality**: Click "Resume" button and verify timer continues from where it stopped
7. **Multiple Players**: Test adding additional players and switching between active timers
8. **Visual States**: Verify paused timers show striped pattern overlay

### Manual Validation Process
- ALWAYS serve the docs/ directory after any changes to verify functionality
- Take screenshots to document UI changes
- Test complete timer workflows: start → player selection → timing → pause → resume
- Verify time display formatting works correctly (starts at 0, counts up in seconds)
- Verify pause state shows "Resume" button and striped background pattern
- Application loads in under 1 second when served via HTTP server

## Repository Structure

### Key Files and Directories
```
.
├── README.md                    # Basic project description
├── package.json                 # Contains build scripts (npm run dev, npm run build, npm test)
├── elm.json                     # Elm project configuration and dependencies
├── .gitignore                   # Excludes .parcel-cache/, elm-stuff/, node_modules/
├── docs/                        # Pre-built application (works via HTTP server)
│   ├── index.html              # Built HTML entry point
│   ├── index.4579fe2e.js       # Compiled JavaScript bundle
│   └── stripes.547a5ce6.svg    # Compiled SVG asset
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
2. **Cannot build locally** due to dependency issues
3. Must test changes by updating the docs/ build or using alternative build methods
4. Always validate changes using the HTTP server method

### Serving for Development
```bash
cd /home/runner/work/clockdown/clockdown/docs
python3 -m http.server 8000
# Access at http://localhost:8000
```

### Package.json Scripts (Non-functional)
- `npm run test` -- **FAILS** (elm-test version incompatibility)
- `npm run dev` -- **FAILS** (missing local dependencies) 
- `npm run build` -- **FAILS** (missing local dependencies)

### File Operations Timing
- `elm --version` -- responds in ~0.019 seconds
- `ls` operations -- immediate response
- Global package installations -- see prerequisites section for timing

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

- **Build System**: Cannot install local npm dependencies due to native compilation issues
- **Elm Compilation**: Network restrictions prevent package downloads
- **Testing**: No functional automated test infrastructure
- **Development Workflow**: Must rely on pre-built version for testing changes

## CRITICAL Reminders

- **NEVER** attempt `npm install` - it will fail after several minutes of compilation attempts
- **ALWAYS** use the docs/ directory HTTP server method for testing
- **ALWAYS** test complete user scenarios, not just application startup
- **NO BUILD TIMEOUTS** needed since local building is not functional
- Elm language server and development tools are not available due to package installation issues