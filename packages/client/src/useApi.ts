import { useCallback, useState } from 'react';
import { apiFetch } from './fetcher';
export function useApi<T>(url: string, init?: RequestInit){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | { code: string; message: string; details?: any; traceId?: string }>(null);
  const [data, setData] = useState<T | null>(null);
  const run = useCallback(async () => {
    setLoading(true); setError(null);
    try{ const d = await apiFetch<T>(url, init); setData(d); return d; }
    catch(e: any){ setError({ code: e.code ?? 'SYS.UNKNOWN', message: e.message ?? 'Unknown', details: e.details, traceId: e.traceId }); throw e; }
    finally{ setLoading(false); }
  }, [url, init]);
  return { data, error, loading, run };
}
