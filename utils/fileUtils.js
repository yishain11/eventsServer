import { join } from "node:path"
import { readFile, writeFile } from "node:fs/promises"

const dirname = import.meta.dirname

export async function IO(path, data, mode = "read") {
    try {
        if (mode === "read") {
            console.log(`loading data`);
            return JSON.parse(await readFile(join(dirname, path)))
        } else {
            console.log(`writing data`);
            await writeFile(join(dirname, path), JSON.stringify(data))
            return true
        }
    } catch (error) {
        console.log(`error`, error);
        return false
    }
}

export async function searchInData(path, field, keyword) {
    console.log(`searching for data in: ${path}, for field: ${field}, keyword: ${keyword}`);
    const storedData = await IO(path)
    if (storedData.length === 0) {
        return false
    }
    for (const dataObj of storedData) {
        if (dataObj[field].toLowerCase() === keyword.toLowerCase()) {
            console.log(`found value for keyword: ${keyword}`);
            return dataObj
        }
    }
    console.log(`value for keyword ${keyword} not found`);
    return false
}