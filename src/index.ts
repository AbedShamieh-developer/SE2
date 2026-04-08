import { CSVCakeMapper } from "./mappers/Cake.mapper";
import { CSVOrderMapper } from "./mappers/Order.mapper";
import logger from "./util/logger";
import { CSVParser } from "./util/parser";

async function main() {
    const data = await CSVParser.parseRows("src/data/cake orders.csv", { skipHeader: true })
    const mapper = new CSVCakeMapper()
    const orderMapper = new CSVOrderMapper(mapper) 
    const orders = data.map(row=> orderMapper.map(row))
    const ordersParsed = CSVParser.toPrettyJSON(orders)
    logger.info(ordersParsed)
}
main().catch((error) => logger.error(error))
