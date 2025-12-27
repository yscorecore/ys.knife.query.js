/**
 * 数据溢出错误，表示查询结果超出了设定的限制
 */
export class DataOverflowError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DataOverflowError";
        
        // 设置原型链，确保instanceof检查正常工作
        Object.setPrototypeOf(this, DataOverflowError.prototype);
    }
}