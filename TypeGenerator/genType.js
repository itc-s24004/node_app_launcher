class typeGenerator {
    /**@type {Object.<string, {id: string, count: number, depth: number}>} */
    static #template = {}

    /**@type {Object.<string, {} | []>} */
    static #types = {}

    static #typeName = "";

    static genType(json, typeName="typeName", space=4) {
        if (typeof json != "object") throw new Error("jsonはオブジェクトで指定する必要があります");
        if (typeof typeName != "string") typeName = "typeName";
        if (Number.isInteger(space) && space >= 0)
        json = JSON.parse(JSON.stringify(json));
        this.#toType(json, 0, " ".repeat(space));
    }


    static #toType(json, depth=0, space="    ") {
        if (Array.isArray(json)) {
            const arrayText = json.map(e => {
                if (typeof e == "object") {
                    if (e === null) return `${space.repeat(depth+1)}: null`;
                    return this.#toType(json, depth+1, space);
                } else {
                    return `${space.repeat(depth+1)}${typeof e}`;
                }
            }).join(",\n");
            return `${space.repeat(depth)}[\n${arrayText}\n${space.repeat(depth)}];`;

        } else {

        }
    }

    static #toTypeJson
}