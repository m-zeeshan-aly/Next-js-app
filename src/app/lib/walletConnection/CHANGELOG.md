# Wallet Connection Module - Changes

## Latest Updates

### Required Configuration for Tracking

- Modified `telegramConfig` to make `WEBHOOK_URL` and `API_KEY` required when `trackUserData` is enabled
- Added clear error messages when required configuration is missing
- Enhanced documentation to explain the required parameters

### ConnectWalletButton Enhancements

- Added `buttonStyle` property for styling the button directly
- Improved validation of required configuration parameters
- Updated the error messages to be more helpful and descriptive
- Added explicit precedence for configuration: prop values > environment variables > defaults

### WalletProvider Integration

- Simplified the `WalletProvider` component for better compatibility
- Exposed `useDarkTheme` option for theming
- Made the component fully reusable across different projects

### Documentation and Examples

- Updated README.md with clear examples and instructions
- Added example-usage.tsx with various configuration examples
- Added advanced usage examples in the documentation

### Configuration Structure

- Improved the configuration system to prioritize direct props over environment variables
- Made required parameters explicit when user tracking is enabled
- Enhanced type definitions for better developer experience

## How to Use

1. Import the components:
   ```tsx
   import { WalletProvider, ConnectWalletButton } from '@/app/lib/walletConnection';
   ```

2. Setup the provider in your layout:
   ```tsx
   <WalletProvider>
     {children}
   </WalletProvider>
   ```

3. Use the button with required configuration:
   ```tsx
   <ConnectWalletButton 
     telegramConfig={{
       WEBHOOK_URL: 'https://your-webhook-url.com/api',
       API_KEY: 'your-api-key'
     }}
     trackUserData={true}
     buttonStyle={{ backgroundColor: '#3b82f6' }}
   />
   ```
