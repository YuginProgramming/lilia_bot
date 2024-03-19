import TelegramBot from 'node-telegram-bot-api';
import { dataBot } from './values.js';
import { sendInfo } from './sendMessage.js';

const admin = new TelegramBot(dataBot.adminBotToken, { polling: true });

export { admin };

// bot.setMyCommands([
//   { command: '/start', description: 'Почати' },
// ]);


sendInfo();
