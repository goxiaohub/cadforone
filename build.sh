#!/bin/bash
# Build script for Cloudflare Pages
# Downloads the Hextra theme and builds the Hugo site

echo "=== Installing Hextra theme ==="
git clone --depth 1 https://github.com/imfing/hextra.git themes/hextra

echo "=== Building Hugo site ==="
hugo
