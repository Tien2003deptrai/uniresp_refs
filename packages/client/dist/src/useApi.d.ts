export declare function useApi<T>(url: string, init?: RequestInit): {
    data: T | null;
    error: {
        code: string;
        message: string;
        details?: any;
        traceId?: string;
    } | null;
    loading: boolean;
    run: () => Promise<T>;
};
//# sourceMappingURL=useApi.d.ts.map