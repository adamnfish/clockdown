#!/bin/bash

# E2E Test Runner for Clockdown
# This script handles the test setup and provides fallback options

echo "🎯 Clockdown E2E Test Runner"
echo "=============================="

# Check if test app exists
if [ ! -f "test-app/index.html" ]; then
    echo "❌ Test app not found at test-app/index.html"
    echo "Please ensure the test application is set up correctly."
    exit 1
fi

# Function to check if port is in use
check_port() {
    nc -z localhost $1 2>/dev/null
    return $?
}

# Start test server if not already running
if ! check_port 3000; then
    echo "🚀 Starting test server on port 3000..."
    cd test-app && python3 -m http.server 3000 &
    SERVER_PID=$!
    cd ..
    echo "   Server PID: $SERVER_PID"
    sleep 2
else
    echo "✅ Test server already running on port 3000"
    SERVER_PID=""
fi

# Function to cleanup
cleanup() {
    if [ ! -z "$SERVER_PID" ]; then
        echo "🧹 Stopping test server (PID: $SERVER_PID)..."
        kill $SERVER_PID 2>/dev/null
    fi
}

# Set up cleanup trap
trap cleanup EXIT

# Check if playwright browsers are installed
echo "🔍 Checking Playwright browser installation..."
if npx playwright install --dry-run chromium 2>/dev/null | grep -q "is already installed"; then
    echo "✅ Playwright browsers are available"
    RUN_TESTS=true
else
    echo "⚠️  Playwright browsers not installed"
    echo "📋 Manual test checklist available instead"
    RUN_TESTS=false
fi

if [ "$RUN_TESTS" = true ]; then
    echo "🎭 Running Playwright e2e tests..."
    npx playwright test "$@"
    TEST_EXIT_CODE=$?
    
    if [ $TEST_EXIT_CODE -eq 0 ]; then
        echo "✅ All tests passed!"
    else
        echo "❌ Some tests failed (exit code: $TEST_EXIT_CODE)"
    fi
else
    echo ""
    echo "🔧 Manual Testing Instructions"
    echo "=============================="
    echo "1. Open your browser to: http://localhost:3000"
    echo "2. Test the following scenarios:"
    echo ""
    echo "   📱 App Startup:"
    echo "   - Verify page loads with 'Clockdown' title"
    echo "   - Check 'Start' and '+ player' buttons are visible"
    echo "   - Confirm 2 colored player previews (red, blue)"
    echo ""
    echo "   👥 Player Management:"
    echo "   - Click '+ player' to add up to 7 players total"
    echo "   - Verify colors: red, blue, green, yellow, purple, orange, brown"
    echo "   - Start game and confirm all players show 'start' buttons"
    echo ""
    echo "   ⏱️  Timer Functionality:"
    echo "   - Click a player's 'start' button to begin their timer"
    echo "   - Verify timer counts up in seconds (e.g., '5\"')"
    echo "   - Click active timer to pass to next player"
    echo "   - Test pause/resume functionality"
    echo ""
    echo "   🎨 Layout & Visual:"
    echo "   - Test with different player counts (2, 4, 7)"
    echo "   - Verify active vs thinking player visual differences"
    echo "   - Check paused state shows striped overlay"
    echo ""
    echo "Press Ctrl+C when finished testing."
    
    # Keep server running until user interrupts
    while true; do
        sleep 1
    done
fi