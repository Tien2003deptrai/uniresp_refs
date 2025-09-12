import { useCallback, useState } from 'react';
import { apiFetch } from './fetcher';
export function useApi(url, init) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const run = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const d = await apiFetch(url, init);
            setData(d);
            return d;
        }
        catch (e) {
            setError({ code: e.code ?? 'SYS.UNKNOWN', message: e.message ?? 'Unknown', details: e.details, traceId: e.traceId });
            throw e;
        }
        finally {
            setLoading(false);
        }
    }, [url, init]);
    return { data, error, loading, run };
}
