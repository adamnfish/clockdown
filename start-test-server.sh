#!/bin/bash

# Simple script to start the test server
cd test-app
echo "Starting test server on http://localhost:3000"
echo "Press Ctrl+C to stop"
python3 -m http.server 3000