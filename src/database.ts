import createConnectionPool, { sql } from "@databases/pg";
import tables from "@databases/pg-typed";
import type DatabaseSchema from "./__generated__";

export { sql };

const db = createConnectionPool({ bigIntMode: "bigint" });
export default db;

const { locations, chargers } = tables<DatabaseSchema>({
  databaseSchema: require("./__generated__/schema.json"),
});

export { locations, chargers };
