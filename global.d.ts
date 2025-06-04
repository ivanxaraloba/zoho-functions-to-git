import type { Database as DB } from "./database.types";

declare global {
  type Database = DB;
  type Log = DB["public"]["Tables"]["logs"]["Row"];
  type Tables = DB["public"]["Tables"]
}
