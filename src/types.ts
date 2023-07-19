import type { Brand } from "ts-brand";

type LocationId = Brand<string, "LocationId">;
export type Address = Brand<string, "Address">;

export type Latitude = Brand<number, "Latitude">;
export type Longitude = Brand<number, "Longitude">;

type ChargerId = Brand<string, "ChargerId">;
type ChargerStatus = "AVAILABLE" | "CHARGING" | "REMOVED";

export type ApiCharger = {
  id: ChargerId;
  status: ChargerStatus;
};

export type ApiLocation = {
  location_id: LocationId;
  address: Address;
  restaurant_on_site: boolean;
  coordinates: {
    latitude: Latitude;
    longitude: Longitude;
  };
  chargers: Array<ApiCharger>;
};
