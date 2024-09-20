import { logger } from "./app/logger";
import { web } from "./app/web";

web.listen(3000, () => {
    logger.info('Listening on port 3000');
});