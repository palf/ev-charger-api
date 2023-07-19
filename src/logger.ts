import type { Logger } from "pino";

import Pino from "pino";

const logger: Logger = Pino({ level: "debug" });

export type { Logger };
export { logger };
