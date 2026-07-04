import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchDictionary from "./tools/search-dictionary";
import listStories from "./tools/list-stories";
import listCuriosities from "./tools/list-curiosities";
import getMyProgress from "./tools/get-my-progress";

// Direct Supabase host is required for the OAuth issuer (never the .lovable.cloud proxy).
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "kwendi-mcp",
  title: "Kwendi MCP",
  version: "0.1.0",
  instructions:
    "Tools for Kwendi, an app to learn the Umbundu language and Angolan culture. Use `search_dictionary` for PT ⇄ Umbundu lookups, `list_stories` for Angolan tales, `list_curiosities` for cultural facts, and `get_my_progress` to read the signed-in learner's XP, streak and progress.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchDictionary, listStories, listCuriosities, getMyProgress],
});