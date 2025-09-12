import type { Request, Response, NextFunction } from 'express';
type Options = {
    onLog?: (err: any, req: Request) => void;
    traceId?: (req: Request) => string | undefined;
};
export declare function errorHandler(opts?: Options): (err: any, req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>>;
export declare const asyncRoute: (fn: any) => (req: any, res: any, next: any) => Promise<any>;
export {};
//# sourceMappingURL=express.d.ts.map