CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE locations (
  location_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  address VARCHAR(255),
  restaurant_on_site BOOLEAN NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);

CREATE TYPE status_enum AS ENUM ('AVAILABLE', 'CHARGING', 'REMOVED');

CREATE TABLE chargers (
  charger_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  location_id UUID REFERENCES locations(location_id) NOT NULL,
  status status_enum NOT NULL
);

