import { admin } from './app.js';
import { dataBot, ranges } from './values.js';
import { writeGoogle, readGoogle } from './crud.js';

export const readMessages = () => {
    admin.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const messageText = msg.text;

        if (msg.reply_to_message) {
            const replyMessageId = msg.reply_to_message.message_id;
            const replyMessageText = msg.reply_to_message.text;

            try {
                const messageIdValues = await readGoogle(ranges.messageIdColumn);
                const lotNumber = messageIdValues.findIndex(value => parseInt(value) === replyMessageId);

                if (lotNumber !== -1) {
                    //await writeGoogle(ranges.replyStatusCell(lotNumber + 1), [['TRUE']]);
                    await writeGoogle(ranges.replyAnswerColumn(lotNumber + 1), [[messageText]]);
                } else {
                    console.log(`Message ID ${replyMessageId} not found in the database.`);
                }
            
            } catch (error) {
                console.error("Error occurred while processing the message:", error);
            }
        } 
    });
};