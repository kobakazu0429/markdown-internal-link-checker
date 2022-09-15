import { parseArgs } from "node:util";
import { marked } from "marked";

const headings = new Set();
const anchors = new Set();

const walkTokens = (token) => {
  if (token.type === "heading") {
    if (!headings.has(token.text)) {
      headings.add(token.text);
    } else {
      console.warn(`${token.text} is duplicated heading.`);
    }
  } else if (token.type === "link") {
    if (token.href.startsWith("#")) {
      // internal link
      // console.log(token);
      anchors.add(token.href.substring(1));
    }
  }
};

marked.use({ walkTokens });

const fetchMarkdown = async (url) => {
  const response = await fetch(url);
  if (response.ok) {
    return response.text();
  }
}

const args = () => {
  const {
    values: { url },
  } = parseArgs({
    allowPositionals: true,
    options: {
      "url": {
        type: "string",
      },
    },
  });

  return { url };
};

const main = async () => {
  const { url } = args();
  const rawMarkdown = await fetchMarkdown(url);
  // console.log(rawMarkdown);
  marked.parse(rawMarkdown);

  console.log("Dead links");
  for (const anchor of anchors.values()) {
    if (!headings.has(anchor)) {
      console.log(`+ ${anchor}`);
    }
  }
}

main();
