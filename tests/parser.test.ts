import assert from "node:assert/strict";
import test from "node:test";
import { Parser } from "../src/parser.js";
import { tokenize } from "../src/tokenizer.js";

test("parses SELECT, WHERE, ORDER BY, and LIMIT", () => {
    const query = "SELECT name, age FROM users WHERE age >= 25 ORDER BY age DESC LIMIT 2;";
    const parsed = new Parser(tokenize(query)).parse();

    assert.deepEqual(parsed, {
        columns: ["name", "age"],
        table: "users",
        where: { column: "age", operator: ">=", value: 25 },
        orderBy: { column: "age", direction: "DESC" },
        limit: 2,
    });
});
