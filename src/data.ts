export interface User {
    id: string;
    name: string;
    age: number;
    role: string;
    active: boolean;
}
export const datasets: Record<string, Record<string, any>[]> = {
    users: [
        { id: 1, name: 'Alice', age: 28, role: 'admin', active: true },
        { id: 2, name: 'Bob', age: 22, role: 'developer', active: false },
        { id: 3, name: 'Charlie', age: 35, role: 'developer', active: true },
        { id: 4, name: 'Diana', age: 31, role: 'designer', active: true },
        { id: 5, name: 'Eve', age: 19, role: 'intern', active: false }
    ]
};
