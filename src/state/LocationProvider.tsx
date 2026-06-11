import { FC, ReactNode, useCallback, useMemo, useState } from "react";
import {
  CategoryRoot,
  LocationContext,
  LocationValue,
} from "./LocationContext";

const parentOf = (p: string): string => {
  if (p === "~") return "~";
  const parts = p.split("/");
  parts.pop();
  return parts.join("/") || "~";
};

export const LocationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>("~");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const goto = useCallback((p: string) => setPath(p), []);

  const goHome = useCallback(() => {
    setPath("~");
    setExpanded(new Set());
  }, []);

  // Going up to `~` collapses everything, matching goHome. Otherwise keep
  // only rows still under the new path.
  const goUp = useCallback(() => {
    setPath((current) => {
      const next = parentOf(current);
      setExpanded((prev) => {
        if (next === "~") return new Set();
        const trimmed = new Set<string>();
        prev.forEach((id) => {
          const idPath = `~/${id}`;
          if (idPath === next || idPath.startsWith(next + "/")) {
            trimmed.add(id);
          }
        });
        return trimmed;
      });
      return next;
    });
  }, []);

  // toggle is intentionally asymmetric: opening a row also moves the path
  // there so the breadcrumb shows the most-recently-opened item; collapsing
  // one of several open rows does not move the path.
  const toggle = useCallback((category: CategoryRoot, slug: string) => {
    const id = `${category}/${slug}`;
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        return next;
      }
      next.add(id);
      return next;
    });
    setPath((current) => {
      // Only push the path when we're actually adding (current state didn't
      // already contain the id).
      if (expanded.has(id)) return current;
      return `~/${id}`;
    });
  }, [expanded]);

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
