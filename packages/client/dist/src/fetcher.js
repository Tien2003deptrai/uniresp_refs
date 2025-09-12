export async function apiFetch(input, init) {
    const res = await fetch(input, init);
    const json = (await res.json());
    if (!json.ok) {
        const e = new Error(json.error.message);
        e.code = json.error.code;
        e.details = json.error.details;
        e.traceId = json.error.traceId;
        throw e;
    }
    return json.data;
}
