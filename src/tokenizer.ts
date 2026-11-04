import type { Token } from "./types.js";

const KEYWORDS = new Set([
    "SELECT",
    "FROM",
    "WHERE",
    "ORDER",
    "BY",
    "LIMIT",
    "ASC",
    "DESC",
]);

const TOKEN_PATTERN = /\s+|([a-zA-Z_][a-zA-Z0-9_$]*)|('(?:''|[^'])*')|(-?\d+(?:\.\d+)?)|(!=|<>|<=|>=|[=<>])|(,|\*|;)/y;

export function tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    while (i < input.length) {
        TOKEN_PATTERN.lastIndex = i;
        const match = TOKEN_PATTERN.exec(input);
        if (!match) {
            if (input[i] === "'") throw new Error(`Unterminated string literal at position ${i}`);
            throw new Error(`Unexpected character '${input[i]}' at position ${i}`);
        }

        const [text, word, string, number, operator, punctuation] = match;
        i = TOKEN_PATTERN.lastIndex;

        if (/^\s+$/.test(text)) continue;
        if (word) {
            const keyword = word.toUpperCase();
            const isKeyword = KEYWORDS.has(keyword);
            tokens.push({ type: isKeyword ? "KEYWORD" : "IDENTIFIER", value: isKeyword ? keyword : word });
        } else if (string) {
            tokens.push({ type: "STRING", value: string.slice(1, -1).replace(/''/g, "'") });
        } else if (number) {
            tokens.push({ type: "NUMBER", value: number });
        } else if (operator) {
            tokens.push({ type: "OPERATOR", value: operator });
        } else if (punctuation === ",") {
            tokens.push({ type: "COMMA", value: punctuation });
        } else if (punctuation === "*") {
            tokens.push({ type: "STAR", value: punctuation });
        } else if (punctuation === ";") {
            tokens.push({ type: "SEMICOLON", value: punctuation });
        }
    }

    tokens.push({ type: "EOF", value: "" });
    return tokens;
}
