import { Request } from 'express';
declare const EthereumStrategy_base: new (...args: any[]) => any;
export declare class EthereumStrategy extends EthereumStrategy_base {
    private store;
    constructor();
    validate(address: string): Promise<any>;
    challenge(req: Request): Promise<unknown>;
}
export {};
