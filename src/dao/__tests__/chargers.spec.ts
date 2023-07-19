import { insertCharger, updateCharger, getCharger } from "../chargers";
import { insertLocation } from "../locations";
import { v4 as uuid } from "uuid";
import type { ApiCharger, ApiLocation, Latitude, Longitude } from "../../types";

describe("getCharger ", () => {
  it("returns null when the location does not exist", async () => {
    const chargerId: ApiCharger["id"] = uuid() as ApiCharger["id"];
    const result: ApiCharger | null = await getCharger(chargerId);
    expect(result).toEqual(null);
  });

  it("returns a matching charger", async () => {
    const locationId: ApiLocation["location_id"] = await insertLocation(
      0 as Latitude,
      0 as Longitude
    );
    const chargerId: ApiCharger["id"] = await insertCharger(locationId);
    const result: ApiCharger | null = await getCharger(chargerId);
    expect(result).toEqual({
      id: chargerId,
      status: "AVAILABLE",
    });
  });
});

describe("updateCharger", () => {
  it("can set a charger to REMOVED", async () => {
    const locationId: ApiLocation["location_id"] = await insertLocation(
      0 as Latitude,
      0 as Longitude
    );
    const chargerId: ApiCharger["id"] = await insertCharger(locationId);

    await updateCharger(chargerId, "REMOVED");

    const updated: ApiCharger | null = await getCharger(chargerId);

    expect(updated?.status).toEqual("REMOVED");
  });

  it("cannot make a REMOVED charger AVAILABLE again", async () => {
    const locationId: ApiLocation["location_id"] = await insertLocation(
      0 as Latitude,
      0 as Longitude
    );
    const chargerId: ApiCharger["id"] = await insertCharger(
      locationId,
      "REMOVED"
    );

    await updateCharger(chargerId, "AVAILABLE");

    const result2 = await getCharger(chargerId);
    expect(result2?.status).toEqual("REMOVED");
  });
});
