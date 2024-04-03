import { dataBot, ranges } from './values.js';
import { admin } from './app.js';
import { writeGoogle, readGoogle } from './crud.js';

const getLotContentByID = async (lotNumber) => {
    const content = await readGoogle(ranges.postContentLine(lotNumber));
    const message = content[4];
    return message;
};
export const autoPosting = async () => {
    const statusValues = await readGoogle(ranges.statusColumn);
    const pendingLots = statusValues
      .map((value, index) => value === "pending" ? index + 1 : null)
      .filter(value => value !== null);
    const contentPromises = pendingLots.map(el => getLotContentByID(el));
    const lotsContent = await Promise.all(contentPromises);
    for (let index = 0; index < lotsContent.length; index++) {
      const element = lotsContent[index];
      const lotNumber = pendingLots[index];
      try {
        const postedLot = await admin.sendMessage(dataBot.channelId, element);
        if (postedLot) {
          try {
            const statusChangeResult = await writeGoogle(ranges.statusCell(lotNumber), [['posted']]);
            const postingMessageIDResult = await writeGoogle(ranges.message_idCell(lotNumber), [[postedLot.message_id]]);
            if (statusChangeResult && postingMessageIDResult) {
              console.log(`Lot #${lotNumber} successfully posted`);  
            }
          } catch (error) {
            console.log(`Lot #${lotNumber} posted. But issues with updating sheet. !PLEASE CHECK! spreadsheet data. Error ${error}`);
          }
        }
      } catch (error) {
        console.log(`Something went wrong on autoposting lot #${lotNumber}. Error ${error}`);
      }
    }
  };
  