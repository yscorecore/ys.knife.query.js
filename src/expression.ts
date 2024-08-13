export class Expression {
    constructor(exp: string) {
        this.exp = exp;
    }
    private exp: string;
    public getExp(): string {
        return this.exp;
    }
    toString(): string {
        return this.exp;
    }
}

export function exp(exp: string): Expression {
    return new Expression(exp);
}