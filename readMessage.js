import { admin } from './app.js';
import { dataBot, ranges } from './values.js';
import { writeGoogle, readGoogle } from './crud.js';

export const readAndLogMessages = () => {
    admin.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const messageText = msg.text;

        if (msg.reply_to_message) {
            const replyMessageId = msg.reply_to_message.message_id;
            const replyMessageText = msg.reply_to_message.text;
            const messageIdValues = await readGoogle(ranges.messageIdColumn);
            const lotNumber = messageIdValues.findIndex(value => parseInt(value) === replyMessageId);

            console.log(lotNumber);
            await writeGoogle(ranges.replyStatusCell(lotNumber + 1), [['TRUE']]);

            const statusValues = await readGoogle(ranges.contentColumn);
            const pendingLots = statusValues
                .map((value, index) => value === replyMessageText ? index + 1 : null)
                .filter(value => value !== null);

            console.log('pendingLots:', pendingLots);

            console.log(`Received a reply to message ID ${replyMessageId}: "${replyMessageText}"`);
        } else {
            console.log('Received an independent message');
        }

        console.log(`Received message from channel ${chatId}: ${messageText}`);
    });
};
