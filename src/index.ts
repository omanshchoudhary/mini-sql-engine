import { tokenize } from "./tokenizer.js";

const query = "SELECT * FROM users;";
console.log(tokenize(query));
