import { config } from 'dotenv';
config();

export const APP_CONFIG = {
    TOKEN: process.env.TELEGRAM_BOT_TOKEN ||'8072037419:AAHsG1MPrdTJazCUaIJjag2DhpWpT7wUVaQ',
    WEBHOOK_URL: process.env.WEBHOOK_URL || 'https://800d-217-138-162-43.ngrok-free.app',
};