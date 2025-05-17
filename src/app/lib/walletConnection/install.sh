#!/bin/bash
# Installation script for Wallet Connection Component

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print banner
echo -e "${GREEN}=================================="
echo -e "Wallet Connection Component Setup"
echo -e "==================================${NC}"

# Check if destination directory exists
if [ ! -d "./src/app/lib" ]; then
  echo -e "${YELLOW}Creating src/app/lib directory...${NC}"
  mkdir -p ./src/app/lib
fi

# Copy component files
echo -e "${YELLOW}Copying wallet connection component files...${NC}"
cp -r "$(dirname "$0")" ./src/app/lib/walletConnection

# Success message
echo -e "${GREEN}Component files copied successfully!${NC}"

# Check if package.json exists
if [ -f "./package.json" ]; then
  echo -e "${YELLOW}Checking dependencies...${NC}"
  
  # Check for required dependencies using jq if available
  if command -v jq &> /dev/null; then
    NEEDS_RAINBOW=$(jq '.dependencies."@rainbow-me/rainbowkit"' package.json)
    NEEDS_WAGMI=$(jq '.dependencies."wagmi"' package.json)
    NEEDS_VIEM=$(jq '.dependencies."viem"' package.json)
    NEEDS_TANSTACK=$(jq '.dependencies."@tanstack/react-query"' package.json)
    NEEDS_WAGMICORE=$(jq '.dependencies."@wagmi/core"' package.json)
    
    MISSING_DEPS=()
    
    if [ "$NEEDS_RAINBOW" == "null" ]; then
      MISSING_DEPS+=("@rainbow-me/rainbowkit@^2.2.4")
    fi
    if [ "$NEEDS_WAGMI" == "null" ]; then
      MISSING_DEPS+=("wagmi@^2.15.3")
    fi
    if [ "$NEEDS_VIEM" == "null" ]; then
      MISSING_DEPS+=("viem@^2.29.2")
    fi
    if [ "$NEEDS_TANSTACK" == "null" ]; then
      MISSING_DEPS+=("@tanstack/react-query@^5.76.1")
    fi
    if [ "$NEEDS_WAGMICORE" == "null" ]; then
      MISSING_DEPS+=("@wagmi/core@^2.17.2")
    fi
    
    if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
      echo -e "${YELLOW}The following dependencies are required:${NC}"
      for dep in "${MISSING_DEPS[@]}"; do
        echo "- $dep"
      done
      
      read -p "Would you like to install them now? (y/n) " -n 1 -r
      echo
      if [[ $REPLY =~ ^[Yy]$ ]]; then
        if command -v npm &> /dev/null; then
          echo -e "${YELLOW}Installing dependencies with npm...${NC}"
          npm install "${MISSING_DEPS[@]}"
        elif command -v yarn &> /dev/null; then
          echo -e "${YELLOW}Installing dependencies with yarn...${NC}"
          yarn add "${MISSING_DEPS[@]}"
        elif command -v pnpm &> /dev/null; then
          echo -e "${YELLOW}Installing dependencies with pnpm...${NC}"
          pnpm add "${MISSING_DEPS[@]}"
        else
          echo -e "${RED}No package manager found. Please install the dependencies manually.${NC}"
        fi
      else
        echo -e "${YELLOW}Remember to install the dependencies manually.${NC}"
      fi
    else
      echo -e "${GREEN}All required dependencies are already installed.${NC}"
    fi
  else
    echo -e "${YELLOW}jq not found. Please make sure you have these dependencies installed:${NC}"
    echo "- @rainbow-me/rainbowkit@^2.2.4"
    echo "- wagmi@^2.15.3"
    echo "- viem@^2.29.2"
    echo "- @tanstack/react-query@^5.76.1"
    echo "- @wagmi/core@^2.17.2"
  fi
else
  echo -e "${RED}No package.json found. Please install the following dependencies manually:${NC}"
  echo "- @rainbow-me/rainbowkit@^2.2.4"
  echo "- wagmi@^2.15.3"
  echo "- viem@^2.29.2"
  echo "- @tanstack/react-query@^5.76.1"
  echo "- @wagmi/core@^2.17.2"
fi

# Copy example env file
echo -e "${YELLOW}Creating example .env.local file...${NC}"
cp ./src/app/lib/walletConnection/.env.example ./.env.local.wallet-example

echo -e "${GREEN}Setup complete!${NC}"
echo -e "${YELLOW}---------------------------${NC}"
echo -e "📋 Next steps:"
echo -e "1. Check the .env.local.wallet-example file and add your environment variables to your .env.local file"
echo -e "2. Import the WalletProvider in your layout.tsx file"
echo -e "3. Import ConnectWalletButton in your page.tsx file"
echo -e "${YELLOW}---------------------------${NC}"
echo -e "${GREEN}Check src/app/lib/walletConnection/README.md for detailed usage instructions.${NC}"
