export declare const SUCCESS_CODE = 200;
export declare class ResultData {
    constructor(code?: number, msg?: string, data?: any);
    code: number;
    msg?: string;
    data?: any;
    static ok(data?: any, msg?: string): ResultData;
    static fail(code: number, msg?: string, data?: any): ResultData;
}
