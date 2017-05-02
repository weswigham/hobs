import convert = require("html2markdown");

export function fromHTMLtoMarkdown(input: string): string {
    return convert(input);
}