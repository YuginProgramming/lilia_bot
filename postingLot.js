import { readGoogle } from './crud';
import { dataBot, ranges } from './values';

const getLotContentByID = async (lotNumber) => {
    const content = await readGoogle(ranges.postContentLine(lotNumber));
    const message = `\u{1F4CA} ${content[0]} \n ${content[1]} \n ${content[2]} \n ${content[3]} \n \u{1F69C} ${content[4]}`;
    return message;
};

const autoPosting = async () => {
    const statusValues = await readGoogle(ranges.statusColumn);
    const pendingLots = statusValues
      .map((value, index) => value === "FALSE" ? index + 1 : null)
      .filter(value => value !== null);
    //сюди дійшов
    const contentPromises = pendingLots.map(el => getLotContentByID(el));
    const lotsContent = await Promise.all(contentPromises);
    for (let index = 0; index < lotsContent.length; index++) {
      const element = lotsContent[index];
      const lotNumber = pendingLots[index];
      try {
        const postedLot = await bot.sendMessage(dataBot.channelId, element, { reply_markup: keyboards.channelKeyboard });
        await sendLotToRegistredCustomers(element, lotNumber);
        if (postedLot) {
          try {
            const statusChangeResult = await writeGoogle(ranges.statusCell(lotNumber), [['new']]);
            const postingMessageIDResult = await writeGoogle(ranges.message_idCell(lotNumber), [[postedLot.message_id]]);
            if (statusChangeResult && postingMessageIDResult) {
              logger.info(`Lot #${lotNumber} successfully posted`);  
            }
          } catch (error) {
            logger.warn(`Lot #${lotNumber} posted. But issues with updating sheet. !PLEASE CHECK! spreadsheet data. Error ${error}`);
          }
        }
      } catch (error) {
        logger.warn(`Something went wrong on autoposting lot #${lotNumber}. Error ${error}`);
      }
    }
  };