#!/bin/bash
# Build script for Cloudflare Pages
set -e

echo "=== Setting up Hextra theme ==="
if [ ! -d themes/hextra ] || [ ! -f themes/hextra/theme.toml ]; then
  mkdir -p themes
  echo "Downloading Hextra theme..."
  curl -fsSL "https://github.com/imfing/hextra/archive/e58687ee6c2e7ccd054c7ef31307d2147a7b8bd7.tar.gz" \
    -o /tmp/hextra.tar.gz
  mkdir -p themes/hextra
  tar xzf /tmp/hextra.tar.gz -C themes/hextra --strip-components=1
  rm /tmp/hextra.tar.gz
  echo "Theme ready"
else
  echo "Theme already present"
fi

echo "=== Building site ==="
hugo --minify
