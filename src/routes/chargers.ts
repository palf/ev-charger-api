import type { Request, Response } from "express";
import type { ApiCharger } from "../types";
import type { JSONSchemaType } from "ajv";

import addFormats from "ajv-formats";
import Ajv from "ajv";
import { updateCharger } from "../dao/chargers";
import { logger } from "../logger";

const ajv = new Ajv();
addFormats(ajv);

const schema: JSONSchemaType<ApiCharger> = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    status: {
      type: "string",
      enum: ["AVAILABLE", "CHARGING", "REMOVED"],
    },
  },
  required: ["id", "status"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

async function thing(payload: ApiCharger): Promise<void> {
  const results = await updateCharger(payload.id, payload.status);

  logger.info(results);
}

export const updateChargerStatus = (req: Request, res: Response) => {
  const input = {
    id: req.params.id,
    status: req.body.status,
  };

  logger.debug(input, "input");

  const valid = validate(input);
  if (!valid) {
    logger.warn(validate.errors);
    res.status(422).send(validate.errors);
    return;
  }

  const payload: ApiCharger = input;
  thing(payload)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send();
    });
};
