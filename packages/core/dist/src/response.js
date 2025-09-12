export const ok = (data, meta) => ({ ok: true, data, meta });
export const fail = (code, message, details, traceId) => ({ ok: false, error: { code, message, details, traceId } });
