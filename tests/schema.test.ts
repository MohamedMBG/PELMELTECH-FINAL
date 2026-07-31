import { test } from "node:test";
import assert from "node:assert/strict";
import { isSchemaComplete, TABLE_NAMES } from "../src/lib/schema";

test("schema is complete only when all five tables are present", () => {
  assert.equal(isSchemaComplete(TABLE_NAMES), true);
});

test("schema is incomplete when any table is missing", () => {
  const missingOne = TABLE_NAMES.slice(1); // drop pelmel_products
  assert.equal(isSchemaComplete(missingOne), false);
});

test("extra unrelated tables do not affect completeness", () => {
  assert.equal(isSchemaComplete([...TABLE_NAMES, "some_other_table"]), true);
});

test("empty schema is incomplete", () => {
  assert.equal(isSchemaComplete([]), false);
});
