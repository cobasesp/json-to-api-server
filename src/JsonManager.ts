import { readFile, writeFile } from 'fs/promises';

export default class JsonManager {

    apiData: any = [];
    jsonPath: string;

    constructor(jsonPath: string) {
        this.jsonPath = jsonPath;
        (async () => {
            this.apiData = await this.readDbJson();
        })();
    }

    async readDbJson(): Promise<any> {
        const content = await readFile(this.jsonPath, 'utf-8');
        return JSON.parse(content);
    }

    getData() {
        return this.apiData;
    }

    async setData(data) {
        this.apiData = data;
        await writeFile(this.jsonPath, JSON.stringify(this.apiData, null, 2), 'utf-8');
    }
}
