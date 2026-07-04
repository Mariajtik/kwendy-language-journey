import { defineMcp } from "@lovable.dev/mcp-js";
import searchDictionary from "./tools/search-dictionary";
import listStories from "./tools/list-stories";
import listCuriosities from "./tools/list-curiosities";

export default defineMcp({
  name: "kwendi-mcp",
  title: "Kwendi MCP",
  version: "0.1.0",
  instructions:
    "Tools for Kwendi, an app to learn the Umbundu language and Angolan culture. Use `search_dictionary` for PT ⇄ Umbundu lookups, `list_stories` for Angolan tales, and `list_curiosities` for cultural facts about Angola.",
  tools: [searchDictionary, listStories, listCuriosities],
});