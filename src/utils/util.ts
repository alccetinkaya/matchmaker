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

export function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

export function generateUniqueRandomInt (max: number, generatedNumbers: number[]): number {
    while (generatedNumbers.length < max) {
        let r = getRandomInt(max);
        if (generatedNumbers.indexOf(r) === -1) {
            generatedNumbers.push(r);
            return r;
        }
    }

    return -1;
}

export function findDuplicates (arr: any[]) {
    return arr.filter((value, index) => arr.indexOf(value) !== index);
}