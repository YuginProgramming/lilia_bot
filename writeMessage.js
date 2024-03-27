import { getClient, getSheetsInstance } from "./google.js";
import { dataBot } from './values.js';

const writeMessage = async (message) => {
    const { googleSheetName, messageStatusColumn } = dataBot;

    try {
        const client = await getClient(); 
        const sheets = getSheetsInstance(client); 

        const range = `${googleSheetName}!${messageStatusColumn}2`; 
        const resource = {
            spreadsheetId: dataBot.googleSheetId,
            range: range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[message]], 
            },
        };

        const response = await sheets.spreadsheets.values.update(resource);
        return response.data;
    } catch (error) {
        console.error('Error writing data:', error);
        throw error;
    }
};

const exampleMessage = "Игорь молодец";
writeMessage(exampleMessage);
