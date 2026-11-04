export type TokenType = 'KEYWORD' | 'IDENTIFIER' | 'STRING' | 'NUMBER' | 'OPERATOR' | 'COMMA' | 'STAR' | 'SEMICOLON' | 'EOF';

export interface Token {
    type: TokenType,
    value: string
}

export type BinaryOperators = '=' | '!=' | '<>' | '<' | '<=' | '>' | '>=';


export interface WhereCondition {
    column: string,
    operator: BinaryOperators,
    value: string | number
}


export interface ParsedQuery {
    columns: string[],
    table: string,
    where?: WhereCondition,
    orderBy?: {
        column: string,
        direction: 'ASC' | 'DESC';
    },
    limit?: number

}
