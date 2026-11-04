import assert from "node:assert/strict";
import test from "node:test";
import { datasets } from "../src/data.js";
import { executeQuery } from "../src/execution.js";
import { Parser } from "../src/parser.js";
import { tokenize } from "../src/tokenizer.js";

function parse(query: string) {
    return new Parser(tokenize(query)).parse();
}

test("filters, sorts, limits, and selects dataset rows", () => {
    const result = executeQuery(
        parse("SELECT name, age FROM users WHERE age >= 25 ORDER BY age DESC LIMIT 2;"),
        datasets.users,
    );

    assert.deepEqual(result, [
        { name: "Charlie", age: 35 },
        { name: "Diana", age: 31 },
    ]);
});

test("supports the <> not-equal operator", () => {
    const result = executeQuery(
        parse("SELECT name FROM users WHERE age <> 28;"),
        datasets.users,
    );

    assert.deepEqual(result, [
        { name: "Bob" },
        { name: "Charlie" },
        { name: "Diana" },
        { name: "Eve" },
    ]);
});

test("reports unknown selected columns", () => {
    assert.throws(
        () => executeQuery(parse("SELECT missing FROM users;"), datasets.users),
        /Unknown column: missing/,
    );
});
