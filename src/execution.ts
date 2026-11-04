import type { ParsedQuery, WhereCondition } from "./types.js";

export function executeQuery(
    ast: ParsedQuery,
    records: Record<string, any>[]
): Record<string, any>[] {

    let result = [...records];

    if (ast.where) {
        assertColumnExists(records, ast.where.column);
        result = result.filter(row => evaluateWhere(row, ast.where!));
    }

    if (ast.orderBy) {
        const { column, direction } = ast.orderBy;
        assertColumnExists(records, column);
        result.sort((a, b) => {
            if (a[column] < b[column]) return direction === 'ASC' ? -1 : 1;
            if (a[column] > b[column]) return direction === 'ASC' ? 1 : -1;
            return 0;
        });
    }

    if (ast.limit !== undefined) {
        result = result.slice(0, ast.limit);
    }

    if (!ast.columns.includes("*")) {
        for (const column of ast.columns) {
            assertColumnExists(records, column);
        }

        result = result.map(row => {
            const projected: Record<string, any> = {};
            for (const column of ast.columns) {
                if (column in row) {
                    projected[column] = row[column];
                }
            }
            return projected;
        });
    }
    return result;
}

function assertColumnExists(records: Record<string, any>[], column: string): void {
    const firstRecord = records[0];
    if (firstRecord && !Object.prototype.hasOwnProperty.call(firstRecord, column)) {
        throw new Error(`Unknown column: ${column}`);
    }
}

function evaluateWhere(row: Record<string, any>, where: WhereCondition): boolean {
    const rowValue = row[where.column];
    const targetValue = where.value;

    switch (where.operator) {
        case '=':
            return rowValue === targetValue;
        case '!=':
        case '<>':
            return rowValue !== targetValue;
        case '>':
            return rowValue > targetValue;
        case '<':
            return rowValue < targetValue;
        case '>=':
            return rowValue >= targetValue;
        case '<=':
            return rowValue <= targetValue;
        default:
            throw new Error(`Unsupported operator: ${where.operator}`);
    }

}
