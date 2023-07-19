import type { Request, Response } from "express";
import type {
  ApiCharger,
  ApiLocation,
  Address,
  Latitude,
  Longitude,
} from "../types";
import type { JSONSchemaType } from "ajv";

import addFormats from "ajv-formats";
import Ajv from "ajv";
import {
  listLocations,
  getLocation,
  insertLocation,
  upsertLocation,
} from "../dao/locations";
import { logger } from "../logger";

const ajv = new Ajv();
addFormats(ajv);

type GetLocationPayload = {
  id: ApiLocation["location_id"];
};

const getSchema: JSONSchemaType<GetLocationPayload> = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
  },
  required: ["id"],
  additionalProperties: false,
};

export const getLocationById = (req: Request, res: Response): Promise<void> => {
  const input = { id: req.params.id };
  logger.debug({ input }, "input");

  const validate = ajv.compile(getSchema);

  const valid = validate(input);
  if (!valid) {
    logger.warn(validate.errors);
    res.status(422).send(validate.errors);
    return Promise.resolve();
  }

  return getLocation(input.id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send();
    });
};

type CreateLocationPayload = {
  address: Address;
  hasRestaurant: boolean;
  latitude: Latitude;
  longitude: Longitude;
};

const createSchema: JSONSchemaType<CreateLocationPayload> = {
  type: "object",
  properties: {
    address: {
      type: "string",
    },
    hasRestaurant: {
      type: "boolean",
    },
    latitude: { type: "number" },
    longitude: { type: "number" },
  },
  required: ["latitude", "longitude"],
  additionalProperties: false,
};

export const createLocation = (req: Request, res: Response): Promise<void> => {
  logger.debug({ body: req.body }, "body");
  const input = {
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    hasRestaurant: req.body.hasRestaurant || false,
  };

  logger.debug({ input }, "input");

  const validate = ajv.compile(createSchema);

  const valid = validate(input);
  if (!valid) {
    logger.warn(validate.errors);
    res.status(422).send(validate.errors);
    return Promise.resolve();
  }

  return insertLocation(input.latitude, input.longitude, input.hasRestaurant)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send();
    });
};

type UpdateLocationPayload = {
  id: ApiLocation["location_id"];
  hasRestaurant: boolean;
};

const updateSchema: JSONSchemaType<UpdateLocationPayload> = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
    },
    hasRestaurant: {
      type: "boolean",
    },
  },
  required: ["id", "hasRestaurant"],
  additionalProperties: false,
};

export const updateLocation = (req: Request, res: Response): Promise<void> => {
  logger.debug({ body: req.body }, "body");
  const input = {
    id: req.params.id,
    hasRestaurant: req.body.hasRestaurant,
  };

  logger.debug({ input }, "input");

  const validate = ajv.compile(updateSchema);

  const valid = validate(input);
  if (!valid) {
    logger.warn(validate.errors);
    res.status(422).send(validate.errors);
    return Promise.resolve();
  }

  return upsertLocation(input.id, input.hasRestaurant)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send();
    });
};

type ListLocationsPayload = {
  pageSize?: number;
  pageOffset?: number;
  chargerStatus?: ApiCharger["status"];
};

const listSchema: JSONSchemaType<ListLocationsPayload> = {
  type: "object",
  properties: {
    pageSize: {
      type: "number",
      nullable: true,
    },
    pageOffset: {
      type: "number",
      nullable: true,
    },
    chargerStatus: {
      type: "string",
      enum: ["AVAILABLE", "CHARGING", "REMOVED"],
      nullable: true,
    },
  },
  required: [],
  additionalProperties: false,
};

export const listLocationsHandler = (
  req: Request,
  res: Response
): Promise<void> => {
  const input = {
    pageSize: Number(req.query.pageSize) || 10,
    pageOffset: Number(req.query.pageOffset) || 0,
    chargerStatus: req.query.chargerStatus,
  };

  logger.debug({ input }, "input");

  const validate = ajv.compile(listSchema);

  const valid = validate(input);
  if (!valid) {
    logger.warn(validate.errors);
    res.status(422).send(validate.errors);
    return Promise.resolve();
  }

  return listLocations({
    limit: input.pageSize,
    offset: input.pageOffset * input.pageSize,
    chargerStatus: input.chargerStatus,
  })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send();
    });
};
