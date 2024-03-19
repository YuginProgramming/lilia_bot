import { getSpreadsheetData } from "./filedata.js";
import { dataBot } from './values.js';

const spreadsheetId = dataBot.googleSheetId;
const sheetName = "lilia";

const getData = async (spreadsheetId, sheetName) => {
    const allData = await getSpreadsheetData(spreadsheetId, sheetName);
    
    if (allData && allData.values && Array.isArray(allData.values)) {
        const result = allData.values
            .filter(row => row.length > 0)
            .map(row => row.filter(value => value !== "") || []);
  
        return result;
    } else {
        return [];
    }
};

export {
  getData,
}