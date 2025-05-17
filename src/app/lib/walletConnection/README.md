# Wallet Connection Component

A portable, reusable wallet connection component for web3 applications. This component provides wallet connection functionality using RainbowKit and Wagmi, with optional built-in user data tracking capabilities.

## Features

- 🔗 Easy wallet connection with RainbowKit's beautiful UI
- 🌐 Multi-chain support (Ethereum, Polygon, Optimism, Arbitrum)
- 📊 User data tracking (completely optional)
- 📱 Device and location information collection
- 📲 Integration with Telegram for notifications
- ⚙️ Fully customizable through environment variables
- 📦 Self-contained and portable - just drop into any Next.js project

## Installation

### Step 1: Copy the Component

Copy the entire `walletConnection` folder to your project's `src/app/lib` directory.

### Step 2: Install Dependencies

Add the required dependencies to your project:

```bash
npm install @rainbow-me/rainbowkit@^2.2.4 wagmi@^2.15.3 viem@^2.29.2 @tanstack/react-query@^5.76.1 @wagmi/core@^2.17.2
```

### Step 3: Environment Variables

Create or update your `.env.local` file with the following variables (all are optional with defaults):

```
# WalletConnect (required for production)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-project-id
NEXT_PUBLIC_APP_NAME=Your App Name

# Telegram integration (optional)
NEXT_PUBLIC_TELEGRAM_WEBHOOK_URL=your-webhook-url
NEXT_PUBLIC_TELEGRAM_API_KEY=your-api-key
NEXT_PUBLIC_TELEGRAM_TIMEOUT_MS=10000
NEXT_PUBLIC_TELEGRAM_ENABLED=true

# User info APIs (optional)
NEXT_PUBLIC_IP_API_URL=https://api.ipify.org?format=json
NEXT_PUBLIC_GEO_API_URL=https://ipapi.co
NEXT_PUBLIC_API_TIMEOUT_MS=5000

# Storage settings
NEXT_PUBLIC_STORAGE_KEY=last_visit
NEXT_PUBLIC_ENCRYPT_STORAGE=false

# Data collection settings
NEXT_PUBLIC_NOTIFICATION_INTERVAL_HOURS=12
NEXT_PUBLIC_COLLECT_DEVICE_INFO=true
NEXT_PUBLIC_COLLECT_LOCATION_INFO=true
NEXT_PUBLIC_DATA_COLLECTION_ENABLED=true
NEXT_PUBLIC_DEBUG_ENABLED=false
```

## Usage

### Step 1: Wrap Your App with WalletProvider

In your layout.tsx or main component file:

```tsx
// In your layout.tsx or main component
import { WalletProvider } from '@/app/lib/walletConnection';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
```

### Step 2: Use the ConnectWalletButton Component

Add the button to any page or component:

```tsx
// In your page or component
import { ConnectWalletButton } from '@/app/lib/walletConnection';

export default function YourComponent() {
  return (
    <div>
      <h2>Connect Your Wallet</h2>
      <ConnectWalletButton />
    </div>
  );
}
```

## Customization Options

### WalletProvider Props

```tsx
<WalletProvider
  projectId="your-project-id" // Override env variable
  appName="Custom App Name" // Override env variable
  useDarkTheme={true} // Use dark theme instead of light
>
  {children}
</WalletProvider>
```

### ConnectWalletButton Props

```tsx
<ConnectWalletButton 
  trackUserData={false} // Disable user tracking
  chainNames={{ 1: "ETH Mainnet", 137: "MATIC" }} // Custom chain names
  onWalletConnected={(walletInfo) => {
    console.log("Wallet connected:", walletInfo);
    // Custom logic when wallet connects
  }}
/>
```

## Configuration API

All configuration is handled through environment variables with sensible defaults:

### Telegram Integration

- `NEXT_PUBLIC_TELEGRAM_WEBHOOK_URL`: Webhook URL for sending data
- `NEXT_PUBLIC_TELEGRAM_API_KEY`: API key for authentication
- `NEXT_PUBLIC_TELEGRAM_TIMEOUT_MS`: Request timeout in milliseconds
- `NEXT_PUBLIC_TELEGRAM_ENABLED`: Toggle Telegram integration on/off

### User Info Collection

- `NEXT_PUBLIC_IP_API_URL`: API endpoint for IP lookup
- `NEXT_PUBLIC_GEO_API_URL`: API endpoint for geolocation lookup
- `NEXT_PUBLIC_API_TIMEOUT_MS`: Request timeout for API calls

### Storage & Data Collection

- `NEXT_PUBLIC_STORAGE_KEY`: LocalStorage key for visit tracking
- `NEXT_PUBLIC_ENCRYPT_STORAGE`: Enable storage encryption
- `NEXT_PUBLIC_NOTIFICATION_INTERVAL_HOURS`: Hours between data collection events
- `NEXT_PUBLIC_COLLECT_DEVICE_INFO`: Whether to collect device info
- `NEXT_PUBLIC_COLLECT_LOCATION_INFO`: Whether to collect location info
- `NEXT_PUBLIC_DATA_COLLECTION_ENABLED`: Master toggle for data collection
- `NEXT_PUBLIC_DEBUG_ENABLED`: Enable debug logging

## Example package.json Configuration

Add these dependencies to your project's package.json:

```json
{
  "dependencies": {
    "@rainbow-me/rainbowkit": "^2.2.4",
    "@tanstack/react-query": "^5.76.1",
    "@wagmi/core": "^2.17.2",
    "viem": "^2.29.2",
    "wagmi": "^2.15.3"
  }
}
```

## Troubleshooting

### Missing Dependencies

If you see errors related to missing dependencies:

```
Error: Cannot find module '@rainbow-me/rainbowkit'
```

Make sure you've installed all required packages:

```bash
npm install @rainbow-me/rainbowkit@^2.2.4 wagmi@^2.15.3 viem@^2.29.2 @tanstack/react-query@^5.76.1 @wagmi/core@^2.17.2
```

### Invalid Hook Call

If you see errors like:

```
Invalid hook call. Hooks can only be called inside of the body of a function component.
```

Ensure you're using the `WalletProvider` in a client component by adding `'use client';` at the top of your layout file.

### RainbowKit Styles Not Loading

If the wallet button appears unstyled, make sure you've imported the RainbowKit styles in your layout:

```tsx
import '@rainbow-me/rainbowkit/styles.css';
```

### Environment Variables Not Working

Make sure your environment variables are properly configured in `.env.local` with the `NEXT_PUBLIC_` prefix for client-side access.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
