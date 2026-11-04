import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline";
import { executeQuery } from "./execution.js";
import { Parser } from "./parser.js";
import { datasets } from "./data.js";
import { tokenize } from "./tokenizer.js";

console.log(`Available datasets: ${Object.keys(datasets).join(", ")}`);

const terminal = createInterface({ input: stdin, output: stdout });
terminal.setPrompt("sql> ");
terminal.prompt();

terminal.on("line", (line) => {
    const query = line.trim();

    if (query.toLowerCase() === "exit" || query.toLowerCase() === "quit") {
        terminal.close();
        return;
    }

    if (query.length > 0) {
        try {
            const parsedQuery = new Parser(tokenize(query)).parse();
            const records = datasets[parsedQuery.table];

            if (!records) {
                throw new Error(`Unknown dataset '${parsedQuery.table}'`);
            }

            const results: Record<string, any>[] = executeQuery(parsedQuery, records);
            console.table(results);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error(`Error: ${message}`);
        }
    }

    terminal.prompt();
});
