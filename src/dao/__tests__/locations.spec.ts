import { insertLocation, getLocation } from "../locations";
import { insertCharger } from "../chargers";
import type { ApiCharger, ApiLocation, Latitude, Longitude } from "../../types";
import { v4 as uuid } from "uuid";

describe("getLocation ", () => {
  it("returns null when the location does not exist", async () => {
    const locationId: ApiLocation["location_id"] =
      uuid() as ApiLocation["location_id"];
    const result: ApiLocation | null = await getLocation(locationId);
    expect(result).toEqual(null);
  });

  it("returns a matching location", async () => {
    const locationId: ApiLocation["location_id"] = await insertLocation(
      10 as Latitude,
      20 as Longitude
    );
    const result: ApiLocation | null = await getLocation(locationId);
    expect(result).toEqual({
      location_id: locationId,
      address: null,
      coordinates: { longitude: 20, latitude: 10 },
      restaurant_on_site: false,
      chargers: [],
    });
  });

  it("returns associated chargers", async () => {
    const locationId: ApiLocation["location_id"] = await insertLocation(
      10 as Latitude,
      20 as Longitude
    );
    const chargerId: ApiCharger["id"] = await insertCharger(locationId);

    const result: ApiLocation | null = await getLocation(locationId);
    expect(result?.chargers).toEqual([{ id: chargerId, status: "AVAILABLE" }]);
  });

  it("does not return disassociated chargers", async () => {
    const locationId01: ApiLocation["location_id"] = await insertLocation(
      10 as Latitude,
      20 as Longitude
    );
    const locationId02: ApiLocation["location_id"] = await insertLocation(
      20 as Latitude,
      30 as Longitude
    );
    const chargerId01: ApiCharger["id"] = await insertCharger(locationId01);
    const chargerId02: ApiCharger["id"] = await insertCharger(locationId01);
    await insertCharger(locationId02);

    const result: ApiLocation | null = await getLocation(locationId01);
    expect(result?.chargers).toEqual([
      { id: chargerId01, status: "AVAILABLE" },
      { id: chargerId02, status: "AVAILABLE" },
    ]);
  });

  it("sets the has-restaurant flag", async () => {
    const locationId: ApiLocation["location_id"] = await insertLocation(
      10 as Latitude,
      20 as Longitude,
      true
    );
    const result: ApiLocation | null = await getLocation(locationId);
    expect(result?.restaurant_on_site).toEqual(true);
  });
});
