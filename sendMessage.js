import { admin } from './app.js';
import { dataBot } from './values.js';
import { getData } from './filter.js';

export const sendInfo = () => {
    admin.on('message', async (msg) => {
        const chatId = msg.chat.id;
        if (msg.text == 'send') {
            try {
                const info = await getData(dataBot.googleSheetId, 'lilia');
                await admin.sendMessage(dataBot.channelId, info);

            } catch (error) {
                console.error("Error fetching data from Google Sheet:", error);
            }
        }
    });
};

