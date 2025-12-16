#!/bin/bash
# Simple script to start a local server for the LLM Token Visualizer

echo "🚀 Starting LLM Token Visualizer server..."
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "✅ Using Python 3"
    echo "📂 Serving from: $(pwd)"
    echo "🌐 Open in browser: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
# Check if Python is available
elif command -v python &> /dev/null; then
    echo "✅ Using Python"
    echo "📂 Serving from: $(pwd)"
    echo "🌐 Open in browser: http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python -m http.server 8000
else
    echo "❌ Error: Python is not installed"
    echo "Please install Python or use another method to start a local server."
    echo ""
    echo "Alternative: If you have Node.js installed, run:"
    echo "  npx serve"
    exit 1
fi
