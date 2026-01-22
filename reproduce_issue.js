import edjsHTML from 'editorjs-html';

const data = {
    blocks: [
        {id: "EsY_o3wssz", type: "paragraph", data: {text: "kenan"}},
        {id: "37Zh3UF0ii", type: "paragraph", data: {text: "Halo Indonesiaaa"}},
        {id: "tymTG2runw", type: "header", data: {text: "awdawdwadawdawd", level: 2}},
        {id: "gtNdk51d-J", type: "list", data: {style: "unordered", items: ["item 1", "item 2"]}}
    ]
};

try {
    const parser = edjsHTML();
    console.log("Parser initialized");
    
    console.log("Parsing data:", JSON.stringify(data, null, 2));
    const htmlBlocks = parser.parse(data);
    
    console.log("Parsed blocks:", htmlBlocks);
    console.log("Joined HTML:", htmlBlocks.join(''));
} catch (error) {
    console.error("Error parsing:", error);
}
