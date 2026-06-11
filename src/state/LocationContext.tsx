import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

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

const LocationContext = createContext<LocationValue>({
  path: "~",
  expanded: new Set(),
  goto: () => {},
  goHome: () => {},
  goUp: () => {},
  toggle: () => {},
  isExpanded: () => false,
});

export const LocationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>("~");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const goto = useCallback((p: string) => setPath(p), []);
  const goHome = useCallback(() => {
    setPath("~");
    setExpanded(new Set());
  }, []);
  const goUp = useCallback(() => {
    setPath((p) => {
      if (p === "~") return p;
      const parts = p.split("/");
      parts.pop();
      const next = parts.join("/") || "~";
      // Collapse rows that are no longer below the current path.
      setExpanded((prev) => {
        const trimmed = new Set<string>();
        prev.forEach((id) => {
          if (next === "~" || `~/${id}`.startsWith(next + "/") || `~/${id}` === next) {
            // keep nothing above the new path
          } else {
            trimmed.add(id);
          }
        });
        return trimmed;
      });
      return next;
    });
  }, []);
  const toggle = useCallback(
    (category: CategoryRoot, slug: string) => {
      const id = `${category}/${slug}`;
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
          setPath(`~/${id}`);
        }
        return next;
      });
    },
    [],
  );
  const isExpanded = useCallback(
    (category: CategoryRoot, slug: string) =>
      expanded.has(`${category}/${slug}`),
    [expanded],
  );

  const value = useMemo<LocationValue>(
    () => ({ path, expanded, goto, goHome, goUp, toggle, isExpanded }),
    [path, expanded, goto, goHome, goUp, toggle, isExpanded],
  );

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLocation = (): LocationValue => useContext(LocationContext);
