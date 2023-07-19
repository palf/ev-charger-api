import type { Request, Response } from "express";

import { updateChargerStatus } from "./routes/chargers";
import {
  getLocationById,
  updateLocation,
  createLocation,
  listLocationsHandler,
} from "./routes/locations";
import express from "express";
import { logger } from "./logger";
import bodyParser from "body-parser";

const port = 3000;

const app = express();
app.use(bodyParser.json());

app.get("/health", (req: Request, res: Response) => {
  res.send("OK!");
});

app.get("/locations/:id", getLocationById);
app.put("/locations/", createLocation);
app.put("/locations/:id", updateLocation);
app.patch("/chargers/:id", updateChargerStatus);
app.get("/locations", listLocationsHandler);

app.listen(port, () => {
  logger.info({ port }, "server started");
});
