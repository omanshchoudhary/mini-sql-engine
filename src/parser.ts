import type { ParsedQuery, Token, TokenType, WhereCondition } from "./types.js";

export class Parser {
    private tokens: Token[];
    private current = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    private peek(): Token {
        const token = this.tokens[this.current];
        if (!token) throw new Error("Unexpected end of token stream");
        return token;
    }

    private isAtEnd(): boolean {
        return this.peek().type === "EOF";
    }

    private advance(): Token {
        const token = this.peek();
        if (token.type !== "EOF") this.current++;
        return token;
    }

    private expect(type: TokenType, value?: string): Token {
        const token = this.peek();

        if (token.type !== type || (value !== undefined && token.value !== value)) {
            const expected = value === undefined ? type : `${type} '${value}'`;
            const actual = token.type === "EOF" ? "EOF" : `${token.type} '${token.value}'`;
            throw new Error(`Expected ${expected}, but found ${actual}`);
        }

        return this.advance();
    }

    public parse(): ParsedQuery {
        this.expect('KEYWORD', 'SELECT');
        const columns = this.parseColumns();

        this.expect('KEYWORD', 'FROM');
        const table = this.expect('IDENTIFIER').value;

        let where: WhereCondition | undefined;
        if (this.peek().type === 'KEYWORD' && this.peek().value === 'WHERE') {
            this.advance();
            where = this.parseWhere();
        }

        let orderBy: ParsedQuery['orderBy'];
        if (this.peek().type === 'KEYWORD' && this.peek().value === 'ORDER') {
            this.advance(); // consume ORDER
            this.expect('KEYWORD', 'BY');
            orderBy = this.parseOrderBy();
        }

        let limit: number | undefined;
        if (this.peek().type === 'KEYWORD' && this.peek().value === 'LIMIT') {
            this.advance(); // consume ORDER
            limit = parseInt(this.expect('NUMBER').value, 10)
        }

        return {
            columns,
            table,
            ...(where !== undefined ? { where } : {}),
            ...(orderBy !== undefined ? { orderBy } : {}),
            ...(limit !== undefined ? { limit } : {}),
        };
    }
    private parseColumns(): string[] {
        if (this.peek().type === 'STAR') {
            this.advance();
            return ["*"];
        }

        const column: string[] = [];
        column.push(this.expect('IDENTIFIER').value);

        while (this.peek().type === 'COMMA') {
            this.advance();
            column.push(this.expect('IDENTIFIER').value);
        }
        return column;
    }

    private parseWhere(): WhereCondition {
        const column = this.expect('IDENTIFIER').value;
        const operator = this.expect('OPERATOR').value as WhereCondition['operator'];
        const valueToken = this.peek();

        if (valueToken.type !== 'STRING' && valueToken.type !== 'NUMBER') {
            throw new Error(`Expected STRING or NUMBER, but found ${valueToken.type}`);
        }

        this.advance();
        const value = valueToken.type === 'NUMBER' ? Number(valueToken.value) : valueToken.value;

        return { column, operator, value };
    }

    private parseOrderBy(): NonNullable<ParsedQuery['orderBy']> {
        const column = this.expect('IDENTIFIER').value;
        let direction: 'ASC' | 'DESC' = 'ASC';
        const directionToken = this.peek();

        if (directionToken.type === 'KEYWORD' && directionToken.value === 'ASC') {
            this.advance();
        } else if (directionToken.type === 'KEYWORD' && directionToken.value === 'DESC') {
            this.advance();
            direction = 'DESC';
        }

        return { column, direction };
    }
}
