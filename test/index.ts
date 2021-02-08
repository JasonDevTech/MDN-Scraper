import search from "../src/index";

(async () => {
    const objectMembers = [
        "Array.prototype.join()",
        "Array.prototype.join",
        "Array#prototype#join()",
        "Array#prototype#join",
        "Array.join()",
        "Array.join",
        "Array#join()",
        "Array#join",
        "String#replace",
        "String.format",
    ];

    const miscellaneous = [
        "number",
        "template literals",
        "array",
        "string",
        "delete",
        "this",
        "eval()",
        "for...of",
        "for...in",
        "import",
        "class",
        "function",
        "function*",
        "arguments",
        "arrow functions",
        "split",
        "logical or",
        "logical and",
        "nullish",
    ];

    for (const userInput of [...objectMembers, ...miscellaneous]) {
        const cleanedInput = userInput.replace(/prototype|\(|\)/g, "");
        const data = await search(cleanedInput);
        console.log(data);
        console.log("------------------------------------------------------------");
    }
})();
