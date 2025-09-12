import type { ApiResponse } from '@uniresp/core';
export async function apiFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T>{
  const res = await fetch(input, init);
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.ok){ const e = new Error(json.error.message) as any; e.code = json.error.code; e.details = json.error.details; e.traceId = json.error.traceId; throw e; }
  return json.data;
}
