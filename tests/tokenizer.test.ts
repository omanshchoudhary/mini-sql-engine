import assert from "node:assert/strict";
import test from "node:test";
import { tokenize } from "../src/tokenizer.js";

test("tokenizes a basic SELECT query", () => {
    const tokens = tokenize("SELECT name FROM users WHERE age >= 21;");

    assert.deepEqual(
        tokens.map(({ type, value }) => [type, value]),
        [
            ["KEYWORD", "SELECT"],
            ["IDENTIFIER", "name"],
            ["KEYWORD", "FROM"],
            ["IDENTIFIER", "users"],
            ["KEYWORD", "WHERE"],
            ["IDENTIFIER", "age"],
            ["OPERATOR", ">="],
            ["NUMBER", "21"],
            ["SEMICOLON", ";"],
            ["EOF", ""],
        ],
    );
});
