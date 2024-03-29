import TelegramBot from 'node-telegram-bot-api';
import { dataBot } from './values.js';
import { sendInfo } from './sendMessage.js';
import { readMessages } from './readMessage.js';
import { autoPosting } from './postingLot.js';

const admin = new TelegramBot(dataBot.adminBotToken, { polling: true });

export { admin };


sendInfo();
readMessages();
setInterval(() => {
    autoPosting();
  }, dataBot.autopostingTimer);