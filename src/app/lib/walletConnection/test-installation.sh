#!/bin/bash
# Testing script for Wallet Connection Component

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=================================="
echo -e "Wallet Connection Component Tester"
echo -e "==================================${NC}"

# Check if component files exist
echo -e "${YELLOW}Checking component files...${NC}"
COMPONENT_DIR="./src/app/lib/walletConnection"

if [ ! -d "$COMPONENT_DIR" ]; then
  echo -e "${RED}ERROR: Component directory not found at $COMPONENT_DIR${NC}"
  echo "Make sure you've installed the component correctly."
  exit 1
else
  echo -e "${GREEN}✓ Component directory found${NC}"
fi

# Check for required files
REQUIRED_FILES=(
  "index.ts"
  "config.ts"
  "components/ConnectWalletButton.tsx"
  "providers/WalletProvider.tsx"
)

MISSING_FILES=0
for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$COMPONENT_DIR/$file" ]; then
    echo -e "${RED}✗ Missing file: $file${NC}"
    MISSING_FILES=$((MISSING_FILES+1))
  else
    echo -e "${GREEN}✓ Found file: $file${NC}"
  fi
done

if [ $MISSING_FILES -gt 0 ]; then
  echo -e "${RED}ERROR: $MISSING_FILES required files are missing${NC}"
  exit 1
fi

# Check for dependencies in package.json
echo -e "\n${YELLOW}Checking for required dependencies...${NC}"
if [ ! -f "package.json" ]; then
  echo -e "${RED}ERROR: No package.json found${NC}"
  exit 1
fi

DEPENDENCIES=(
  "@rainbow-me/rainbowkit"
  "@tanstack/react-query"
  "@wagmi/core"
  "viem"
  "wagmi"
)

MISSING_DEPS=0
for dep in "${DEPENDENCIES[@]}"; do
  if ! grep -q "\"$dep\"" package.json; then
    echo -e "${RED}✗ Missing dependency: $dep${NC}"
    MISSING_DEPS=$((MISSING_DEPS+1))
  else
    echo -e "${GREEN}✓ Found dependency: $dep${NC}"
  fi
done

if [ $MISSING_DEPS -gt 0 ]; then
  echo -e "${RED}ERROR: $MISSING_DEPS required dependencies are missing${NC}"
  echo -e "Please install them using:"
  echo -e "npm install @rainbow-me/rainbowkit@^2.2.4 wagmi@^2.15.3 viem@^2.29.2 @tanstack/react-query@^5.76.1 @wagmi/core@^2.17.2${NC}"
else
  echo -e "${GREEN}All required dependencies found!${NC}"
fi

# Check for environment variables
echo -e "\n${YELLOW}Checking for environment variables...${NC}"
if [ ! -f ".env.local" ]; then
  echo -e "${YELLOW}No .env.local file found${NC}"
  echo -e "Creating example .env.local file..."
  cp "$COMPONENT_DIR/.env.example" "./.env.local.wallet-example"
  echo -e "${YELLOW}Created .env.local.wallet-example - please rename it to .env.local and update the values${NC}"
else
  echo -e "${GREEN}✓ .env.local file found${NC}"
  # Check for essential variables
  if ! grep -q "NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID" .env.local; then
    echo -e "${YELLOW}⚠️ No NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID found in .env.local${NC}"
    echo -e "   This is recommended for production use."
  else
    echo -e "${GREEN}✓ Found WALLET_CONNECT_PROJECT_ID in .env.local${NC}"
  fi
fi

echo -e "\n${GREEN}Component test completed!${NC}"
echo -e "${YELLOW}---------------------------${NC}"
echo -e "To test your installation, add the following to a page or component:"
echo -e "
import { ConnectWalletButton } from '@/app/lib/walletConnection';

export default function TestComponent() {
  return (
    <div>
      <h2>Test Wallet Connection</h2>
      <ConnectWalletButton />
    </div>
  );
}
"
echo -e "${YELLOW}---------------------------${NC}"
echo -e "${GREEN}Make sure you've wrapped your app with the WalletProvider in your layout.tsx file.${NC}"
