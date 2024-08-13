
export class SelectItem {
    private exclude: boolean;
    private name: string;

    constructor(name: string, exclude: boolean = false) {
        this.name = name;
        this.exclude = exclude;
    }

    public toString(): string {
        return this.exclude ? `-${this.name}` : this.name;
    }

}
export class SelectInfo {
    protected items: SelectItem[] = [];

    constructor(...selectItems: SelectItem[]) {
        this.items.push(...(selectItems.filter(item => item !== null)));
    }

    toString(): string {
        if (this.items.length === 0) return '';
        return this.items
            .filter(item => item !== null)
            .map(item => item.toString())
            .join(',');
    }
    public appendItems(...names: SelectItem[]): SelectInfo {
        if (this.items) {
            this.items = this.items.concat(names);
        } else {
            this.items = names;
        }
        return this
    }
}

export class SelectInfoOf<T> extends SelectInfo {
    public include(...names: FieldKeys<T>[]): SelectInfoOf<T> {
        this.appendItems(...names.map(t => new SelectItem(t.toString())));
        return this
    }
    public exclude(...names: FieldKeys<T>[]): SelectInfoOf<T> {
        this.appendItems(...names.map(t => new SelectItem(t.toString(), true)));
        return this;
    }
}
export type FieldKeys<T> = "[default]" | "[complex]" | "[all]" | keyof T;

export function select<T>(...names: FieldKeys<T>[]): SelectInfoOf<T> {
    return new SelectInfoOf<T>().include(...names);
}
