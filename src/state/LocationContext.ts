import { createContext, useContext } from "react";

export type CategoryRoot = "education" | "experience" | "about";

// A terminal history entry. The Home view renders these as an append-only
// log; locale-sensitive text is keyed (e.g. INTRO/MOTTO1), not hardcoded,
// so language switches re-render without re-running typewriter animations.
export type LocaleKey = "intro" | "motto1" | "motto2";

// Replayable actions: clicking a cmd with one of these actions truncates
// history to before that cmd and re-runs the action.
export type CmdAction =
  | { kind: "enterCategory"; category: "education" | "experience" }
  | { kind: "enterAbout" }
  | { kind: "enterHome" }
  | { kind: "lsCategories" }
  // leetcode (Journey submodule)
  | { kind: "enterLeetcode" } // ls leetcode/  → topics + guides + journey.log
  | { kind: "enterLeetcodeTopic"; topic: string } // ls leetcode/<topic>/
  | { kind: "enterJourneyLog" } // git log journey
  | { kind: "enterGuides" } // ls leetcode/guides/
  // blog (migrated JesseBlog)
  | { kind: "enterBlog" } // ls blog/  → sections
  | { kind: "enterBlogSection"; section: string }; // ls blog/<section>/

export type HistoryEntry =
  | {
      id: string;
      kind: "cmd";
      text: string;
      animate: boolean;
      atPath: string; // path at the moment the cmd was typed
      action?: CmdAction;
    }
  | { id: string; kind: "answer"; text: string; animate: boolean }
  | { id: string; kind: "answerKey"; key: LocaleKey; animate: boolean }
  | { id: string; kind: "categories" }
  | { id: string; kind: "lsCategory"; category: "education" | "experience" }
  | { id: string; kind: "about" }
  // leetcode views
  | { id: string; kind: "leetcodeRoot" }
  | { id: string; kind: "leetcodeTopic"; topic: string }
  | { id: string; kind: "journeyLog" }
  | { id: string; kind: "guides" }
  // blog views
  | { id: string; kind: "blogRoot" }
  | { id: string; kind: "blogSection"; section: string };

export interface LocationValue {
  path: string; // "~", "~/education", "~/education/01-cornell"
  expanded: Set<string>; // "<entryId>/<category>/<slug>"
  history: HistoryEntry[];

  // navigation that appends to history (chip clicks, breadcrumb ~)
  enterCategory: (category: "education" | "experience") => void;
  enterAbout: () => void;
  enterHome: () => void; // breadcrumb ~ when not already home
  enterLeetcode: () => void;
  enterLeetcodeTopic: (topic: string) => void;
  enterJourneyLog: () => void;
  enterGuides: () => void;
  enterBlog: () => void;
  enterBlogSection: (section: string) => void;

  // detail expansion (does not append)
  toggle: (entryId: string, category: CategoryRoot, slug: string) => void;
  isExpanded: (entryId: string, category: CategoryRoot, slug: string) => boolean;

  // initial bootstrap (called once on Home mount)
  bootstrap: () => void;

  // truncate history to BEFORE entryId, then re-execute that cmd's action
  replayFrom: (entryId: string) => void;

  // truncate history to AFTER entryId (keep entryId itself), then run action.
  // Used by chip clicks: the chips menu entry stays, but everything chosen
  // after it gets replaced.
  chooseFromMenu: (menuEntryId: string, action: CmdAction) => void;
}

export const LocationContext = createContext<LocationValue>({
  path: "~",
  expanded: new Set(),
  history: [],
  enterCategory: () => {},
  enterAbout: () => {},
  enterHome: () => {},
  enterLeetcode: () => {},
  enterLeetcodeTopic: () => {},
  enterJourneyLog: () => {},
  enterGuides: () => {},
  enterBlog: () => {},
  enterBlogSection: () => {},
  toggle: () => {},
  isExpanded: () => false,
  bootstrap: () => {},
  replayFrom: () => {},
  chooseFromMenu: () => {},
});

export const useLocation = (): LocationValue => useContext(LocationContext);
