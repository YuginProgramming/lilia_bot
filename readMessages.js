import { admin } from './app.js';
//import { dataBot } from './values.js';

export const readAndLogMessages = () => {
    admin.on('message', (msg) => {
        const chatId = msg.chat.id;
        const messageText = msg.text;

        if (msg.reply_to_message) {
            const replyMessageId = msg.reply_to_message.message_id;
            const replyMessageText = msg.reply_to_message.text;
            console.log(`Received a reply to message ID ${replyMessageId}: "${replyMessageText}"`);
        } else {
            console.log('Received an independent message');
        }

        console.log(`Received message from channel ${chatId}: ${messageText}`);
        
    });
};