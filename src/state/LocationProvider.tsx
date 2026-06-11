import { FC, ReactNode, useCallback, useMemo, useState } from "react";
import {
  CategoryRoot,
  LocationContext,
  LocationValue,
} from "./LocationContext";

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
      // Collapse rows whose path no longer sits under the current location.
      setExpanded((prev) => {
        const trimmed = new Set<string>();
        prev.forEach((id) => {
          const stillUnder =
            next !== "~" &&
            (`~/${id}`.startsWith(next + "/") || `~/${id}` === next);
          if (stillUnder) trimmed.add(id);
        });
        return trimmed;
      });
      return next;
    });
  }, []);
  const toggle = useCallback((category: CategoryRoot, slug: string) => {
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
  }, []);
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
