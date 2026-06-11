import { createContext, useContext } from "react";

export type CategoryRoot = "education" | "experience" | "about";

export interface LocationValue {
  path: string; // "~", "~/education", "~/education/01-cornell"
  expanded: Set<string>; // "education/01-cornell"
  goto: (path: string) => void;
  goHome: () => void;
  goUp: () => void;
  toggle: (category: CategoryRoot, slug: string) => void;
  isExpanded: (category: CategoryRoot, slug: string) => boolean;
}

export const LocationContext = createContext<LocationValue>({
  path: "~",
  expanded: new Set(),
  goto: () => {},
  goHome: () => {},
  goUp: () => {},
  toggle: () => {},
  isExpanded: () => false,
});

export const useLocation = (): LocationValue => useContext(LocationContext);
