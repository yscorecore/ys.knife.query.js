export type ValueType = string | number | boolean | null | string[] | number[];
export class Constant {
    constructor(con: ValueType) {
        this.con = con;
    }
    private con: ValueType;
    toString(): string {
        return JSON.stringify(this.con);
    }
}

export function con(exp: ValueType): Constant {
    return new Constant(exp);
}