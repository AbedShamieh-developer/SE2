import { CakeJsonRow, JsonCakeMapper } from "./mappers/JsonCakeMapper";
import { JsonOrderMapper } from "./mappers/JsonOrderMapper";
import { parseJsonFile } from "./util/jsonparser";
import logger from "./util/logger";

async function main() {
    const data = parseJsonFile<CakeJsonRow>("./src/data/Cakes.json")
    const jCakeMapper = new JsonCakeMapper()
    const orderMapper = new JsonOrderMapper(jCakeMapper)
    const cakes = data.map((row) => orderMapper.map(row))
    logger.info(cakes)
}
main().catch((error) => logger.error(error))
