import { getClient, getSheetsInstance, auth } from "./google.js"; // Assuming these functions are defined in google.js
import { dataBot } from "./values.js"; // Corrected import path

const writeMessage = async (values) => {
    const { googleSheetName, messageStatusRaw, messageStatusColumn } = dataBot; // Destructuring properties from dataBot

    const authClient = await auth(); // Assuming auth() is defined and returns an authenticated client
    const sheets = getSheetsInstance(authClient); // Assuming getSheetsInstance() is defined and returns a Sheets instance

    const resource = {
        spreadsheetId: dataBot.googleSheetId,
        range: `${googleSheetName}!${messageStatusColumn}`, // Specify the range where you want to write data
        valueInputOption: 'RAW', // 'RAW' or 'USER_ENTERED'
        requestBody: {
            values: [[messageStatusRaw]], // Assuming messageStatusRaw is a single value to be written
        },
    };

    try {
        const response = await sheets.spreadsheets.values.update(resource); // Assuming 'update' is a valid function for updating values
        console.log('Data written successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error writing data:', error);
        throw error;
    }
};

// Example usage (assuming 'values' is defined elsewhere)
const exampleValues = [["Some value"]];
writeMessage(exampleValues); // Call writeMessage with exampleValues
