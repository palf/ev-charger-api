import type {
  Latitude,
  Longitude,
  Address,
  ApiCharger,
  ApiLocation,
} from "../types";
import type {
  Chargers as ChargerRecord,
  Locations as LocationRecord,
} from "../__generated__/index";
import db, { sql, chargers, locations } from "../database";
import { logger } from "../logger";

export async function insertLocation(
  latitude: Latitude,
  longitude: Longitude,
  hasRestaurant: boolean = false
): Promise<ApiLocation["location_id"]> {
  logger.debug("inserting location");
  const results: Array<LocationRecord> = await locations(db).insert({
    latitude,
    longitude,
    restaurant_on_site: hasRestaurant,
  });
  return results[0].location_id as ApiLocation["location_id"];
}

function asApiCharger(x: ChargerRecord): ApiCharger {
  return {
    id: x.charger_id as ApiCharger["id"],
    status: x.status,
  };
}

export async function getLocation(
  id: ApiLocation["location_id"]
): Promise<ApiLocation | null> {
  const loc: LocationRecord | null = await locations(db).findOne({
    location_id: id,
  });

  const cha: Array<ChargerRecord> = await chargers(db)
    .find({ location_id: id })
    .all();

  if (loc === null) {
    return null;
  }

  return {
    location_id: loc.location_id as ApiLocation["location_id"],
    address: loc.address as Address,
    restaurant_on_site: loc.restaurant_on_site,
    coordinates: {
      latitude: loc.latitude as Latitude,
      longitude: loc.longitude as Longitude,
    },
    chargers: cha.map(asApiCharger),
  };
}

export async function upsertLocation(
  id: ApiLocation["location_id"],
  hasRestaurant: boolean = false
): Promise<void> {
  logger.debug("inserting location");
  await locations(db).update(
    { location_id: id },
    { restaurant_on_site: hasRestaurant }
  );
}

type ListLocationsFields = {
  limit?: number;
  offset?: number;
  chargerStatus?: ApiCharger["status"];
};

export async function listLocations({
  limit,
  offset,
  chargerStatus,
}: ListLocationsFields): Promise<Array<unknown>> {
  type Row = {
    location_id: ApiLocation["location_id"];
    charger_id: ApiCharger["id"];
    status: ApiCharger["status"];
  };

  const allowedStatus = chargerStatus
    ? `${chargerStatus}`
    : "'AVAILABLE', 'REMOVED', 'CHARGING'";

  const query = sql`
    SELECT l.location_id, c.charger_id, c.status FROM locations l
    LEFT JOIN chargers c ON l.location_id = c.location_id
    WHERE c.status IN ( ${allowedStatus} )
    LIMIT ${limit || 10}
    OFFSET ${offset || 0}
    `;

  return await locations(db).untypedQuery(query);
}
