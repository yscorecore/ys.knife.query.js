import { FilterInfo } from "./filter";
import { LimitInfo } from "./limit";
import { OrderByInfo } from "./orderby";

export class SelectInfo {
    public Items: SelectItem[] = [];

    constructor(...selectItems: SelectItem[]) {
        this.Items.push(...(selectItems.filter(item => item !== null)));
    }

    public toString(): string {
        if (this.Items.length === 0) return '';
        return this.Items
            .filter(item => item !== null)
            .map(item => item.toString())
            .join(',');
    }
}
export class SelectItem {
    public Name: string;
    public SubItems: SelectItem[] = [];
    public CollectionFilter?: FilterInfo;
    public CollectionOrderBy?: OrderByInfo;
    public CollectionLimit?: LimitInfo;

    constructor(name: string) {
        this.Name = name;
    }

    public toString(): string {
        const sb: string[] = [this.Name];
        
        // 如果 CollectionFilter, CollectionOrderBy, CollectionLimit 之一不为 null
        if (this.CollectionFilter || this.CollectionOrderBy || this.CollectionLimit) {
            sb.push('{');
            const collectionInfo = [
                this.limitInfoToString(this.CollectionLimit),
                this.orderInfoToString(this.CollectionOrderBy),
                this.filterInfoToString(this.CollectionFilter)
            ].filter(p => p !== null).join(',');
            sb.push(collectionInfo);
            sb.push('}');
        }
        
        // 如果 SubItems 不为空
        if (this.SubItems.length > 0) {
            const subItemsString = this.SubItems
                .filter(p => p !== null)
                .map(p => p.toString())
                .join(',');
            sb.push(`(${subItemsString})`);
        }

        return sb.join('');
    }

    private limitInfoToString(limitInfo?: LimitInfo): string | null {
        return limitInfo ? `limit(${limitInfo})` : null;
    }

    private orderInfoToString(orderInfo?: OrderByInfo): string | null {
        return orderInfo ? `orderby(${orderInfo})` : null;
    }

    private filterInfoToString(filterInfo?: FilterInfo): string | null {
        return filterInfo ? `where(${filterInfo})` : null;
    }
}