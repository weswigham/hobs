import convert = require("to-markdown");

export function fromHTMLtoMarkdown(input: string): string {
    return convert(input, {converters: [
        { // EVE uses "font" tags in descriptions to set size/color/whatever - discord doesn't support _any_ of these 
            filter: "font",
            replacement: content => "\n" + `___${content}___`
        },
        {
            filter: "url",
            replacement: (content, elem) => `[${elem.innerText}](${elem.attributes.item(0).value})`
        }
    ]});
}