import { dataBot, ranges } from './values.js';
import { admin } from './app.js';
import { writeGoogle, readGoogle } from './crud.js';

const getLotContentByID = async (lotNumber) => {
    const content = await readGoogle(ranges.postContentLine(lotNumber));
    const message = `\u{1F4CA} ${content[0]} \n ${content[1]} \n ${content[2]} \n ${content[3]} \n \u{1F69C} ${content[4]}`;
    return message;
};
// автоматично через 5с шле повідомлення в групу
export const autoPosting = async () => {
// вичитує статус неопублікованих повідомлень
    const statusValues = await readGoogle(ranges.statusColumn);
    const pendingLots = statusValues
      .map((value, index) => value === "pending" ? index + 1 : null)
      .filter(value => value !== null);
    //сюди дійшов
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
            //console.log('ranges.statusCell(lotNumber):', ranges.statusCell(lotNumber));
            //запис id message у google
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