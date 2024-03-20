import TelegramBot from 'node-telegram-bot-api';
import { dataBot } from './values.js';
import { sendInfo } from './sendMessage.js';
import { readAndLogMessages } from './readMessages.js';

const admin = new TelegramBot(dataBot.adminBotToken, { polling: true });

export { admin };

sendInfo();
readAndLogMessages();