import { html_beautify } from "js-beautify";
import { CompletionMessage } from "./gpt";

export function formatHtml(html: string) {
  return html_beautify(html, {
    indent_size: 2,
  });
}

export function formatHtmls(htmls: string[]) {
  return htmls.map(formatHtml);
}

export function formatSuggestions(suggestions: CompletionMessage[]) {
  return suggestions.map((completion) => ({
    ...completion,
    html: formatHtml(completion.html),
  }));
}
