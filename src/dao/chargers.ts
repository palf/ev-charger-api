import type { ApiCharger, ApiLocation } from "../types";
import type { Chargers } from "../__generated__/index";
import db, { sql, chargers } from "../database";

export async function insertCharger(
  locationId: ApiLocation["location_id"],
  status: ApiCharger["status"] = "AVAILABLE"
): Promise<ApiCharger["id"]> {
  const results: Array<Chargers> = await chargers(db).insert({
    status,
    location_id: locationId,
  });
  return results[0].charger_id as ApiCharger["id"];
}

export async function updateCharger(
  id: ApiCharger["id"],
  status: ApiCharger["status"]
): Promise<void> {
  await chargers(db).untypedQuery(
    sql`UPDATE chargers
    SET status = ${status}
    WHERE status <> 'REMOVED'
    `
  );
}

export async function getCharger(
  id: ApiCharger["id"]
): Promise<ApiCharger | null> {
  const results = await chargers(db).findOne({ charger_id: id });

  if (results === null) {
    return null;
  }

  return {
    id: results.charger_id as ApiCharger["id"],
    status: results.status,
  };
}
