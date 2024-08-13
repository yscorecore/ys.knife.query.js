import { DeepKeys } from "./type";

export enum AggType {
    Sum = "sum()",
    Min = "min()",
    Max = "max()",
    Avg = "avg()",
    Count = "count()",
    DistinctCount = "distinctcount()"
}
export class AggItem {
    public type: AggType;
    public path: string;
    public name: string | null;
    constructor(path: string, type: AggType, name: string | null) {
        this.path = path;
        this.type = type;
        this.name = name;
    }
    toString() {
        if (this.name) {
            return `${this.path}.${this.type}.as(${this.name})`;
        } else {
            return `${this.path}.${this.type}`;
        }
    }
}

export class AggInfo {
    public items: AggItem[] = [];
    append(path: string, type: AggType = AggType.Sum, name: string | null = null): AggInfo {
        this.items.push(new AggItem(path, type, name));
        return this;
    }
    toString() {
        if (this.items.length === 0) return '';
        return this.items
            .filter(item => item !== null)
            .map(item => item.toString())
            .join(',');
    }
}
export class AggInfoOf<T> extends AggInfo {
    append(path: DeepKeys<T>, type: AggType = AggType.Sum, name: string | null = null): AggInfoOf<T> {
        this.items.push(new AggItem(path, type, name));
        return this;
    }
}
export function agg<T>(path: DeepKeys<T>, type: AggType = AggType.Sum, name: string | null = null): AggInfoOf<T> {
    return new AggInfoOf<T>().append(path, type, name)
}