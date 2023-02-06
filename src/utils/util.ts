export async function removeEmptyKeys(obj: object): Promise<object> {
    for (const key in obj) {
        if (obj[key] === null || obj[key] === undefined) {
            delete obj[key];
        }

        if (typeof obj[key] === 'object') {
            await removeEmptyKeys(obj[key]);
            if (Object.keys(obj[key]).length == 0) {
                delete obj[key];
            }
        }
    }
    return obj;
}