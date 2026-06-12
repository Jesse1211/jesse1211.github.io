import { FC, ReactNode, useCallback, useMemo, useRef, useState } from "react";
import {
  CategoryRoot,
  CmdAction,
  HistoryEntry,
  LocationContext,
  LocationValue,
} from "./LocationContext";

// The prompt always lives at "~"; nothing in the app actually `cd`s into
// a subdirectory. Keeping this as a constant makes the prompt prefix
// consistent across the entire session.
const PROMPT_PATH = "~";

export const LocationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const bootstrappedRef = useRef(false);
  const idRef = useRef(0);

  const nextId = useCallback((kind: string) => {
    idRef.current += 1;
    return `${kind}-${idRef.current}`;
  }, []);

  // ---- builders. Each returns the entries to *append*.
  // `fromPath` is the path at which the user "typed" the command — for
  // `cd X` it's the parent; for the follow-up commands it's the new path.
  const buildCategoriesBlock = useCallback(
    (fromPath: string): HistoryEntry[] => [
      {
        id: nextId("cmd"),
        kind: "cmd",
        text: "ls categories/",
        animate: true,
        atPath: fromPath,
        action: { kind: "lsCategories" },
      },
      { id: nextId("cats"), kind: "categories" },
    ],
    [nextId],
  );

  const buildEnterCategory = useCallback(
    (
      category: "education" | "experience",
      fromPath: string,
    ): HistoryEntry[] => [
      {
        id: nextId("cmd"),
        kind: "cmd",
        text: `ls -la ${category}/`,
        animate: true,
        atPath: fromPath,
        action: { kind: "enterCategory", category },
      },
      { id: nextId("ls"), kind: "lsCategory", category },
    ],
    [nextId],
  );

  const buildEnterAbout = useCallback(
    (fromPath: string): HistoryEntry[] => [
      {
        id: nextId("cmd"),
        kind: "cmd",
        text: "cat about/profile.txt",
        animate: true,
        atPath: fromPath,
        action: { kind: "enterAbout" },
      },
      { id: nextId("about"), kind: "about" },
    ],
    [nextId],
  );

  // "Home" no longer needs a separate `cd ~`; it just emits a fresh ls
  // categories block at ~.
  const buildEnterHome = useCallback(
    (): HistoryEntry[] => buildCategoriesBlock("~"),
    [buildCategoriesBlock],
  );

  // ---- navigation. None of these change path (we're always at ~ now —
  // ls/cat are read-only operations that do not cd).
  const enterCategory = useCallback(
    (category: "education" | "experience") => {
      setExpanded(new Set());
      const block = buildEnterCategory(category, "~");
      setHistory((prev) => [...prev, ...block]);
    },
    [buildEnterCategory],
  );

  const enterAbout = useCallback(() => {
    setExpanded(new Set());
    const block = buildEnterAbout("~");
    setHistory((prev) => [...prev, ...block]);
  }, [buildEnterAbout]);

  const enterHome = useCallback(() => {
    setExpanded(new Set());
    const block = buildEnterHome();
    setHistory((prev) => [...prev, ...block]);
  }, [buildEnterHome]);

  // ---- one-time initial sequence (bootstrap)
  const bootstrap = useCallback(() => {
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;
    const next: HistoryEntry[] = [
      {
        id: nextId("cmd"),
        kind: "cmd",
        text: "whoami",
        animate: true,
        atPath: "~",
      },
      { id: nextId("ans"), kind: "answerKey", key: "intro", animate: true },
      {
        id: nextId("cmd"),
        kind: "cmd",
        text: "cat motto.txt",
        animate: true,
        atPath: "~",
      },
      { id: nextId("ans"), kind: "answerKey", key: "motto1", animate: true },
      { id: nextId("ans"), kind: "answerKey", key: "motto2", animate: true },
      ...buildCategoriesBlock("~"),
    ];
    setHistory(next);
  }, [nextId, buildCategoriesBlock]);

  // ---- replay: regenerate the entries for a given action at the
  // specified prompt path. None of the actions change path anymore.
  const runAction = useCallback(
    (action: CmdAction, fromPath: string): HistoryEntry[] => {
      switch (action.kind) {
        case "enterCategory":
          return buildEnterCategory(action.category, fromPath);
        case "enterAbout":
          return buildEnterAbout(fromPath);
        case "enterHome":
          return buildEnterHome();
        case "lsCategories":
          return buildCategoriesBlock(fromPath);
      }
    },
    [buildEnterCategory, buildEnterAbout, buildEnterHome, buildCategoriesBlock],
  );

  const replayFrom = useCallback(
    (entryId: string) => {
      setExpanded(new Set());
      setHistory((prev) => {
        const idx = prev.findIndex((e) => e.id === entryId);
        if (idx < 0) return prev;
        const entry = prev[idx];
        if (entry.kind !== "cmd" || !entry.action) return prev;
        const entries = runAction(entry.action, entry.atPath);
        return [...prev.slice(0, idx), ...entries];
      });
    },
    [runAction],
  );

  const chooseFromMenu = useCallback(
    (menuEntryId: string, action: CmdAction) => {
      setExpanded(new Set());
      setHistory((prev) => {
        const idx = prev.findIndex((e) => e.id === menuEntryId);
        if (idx < 0) return prev;
        const entries = runAction(action, PROMPT_PATH);
        return [...prev.slice(0, idx + 1), ...entries];
      });
    },
    [runAction],
  );

  // ---- detail expansion (does not append history, does not change path)
  const toggle = useCallback(
    (entryId: string, category: CategoryRoot, slug: string) => {
      const id = `${entryId}/${category}/${slug}`;
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [],
  );

  const isExpanded = useCallback(
    (entryId: string, category: CategoryRoot, slug: string) =>
      expanded.has(`${entryId}/${category}/${slug}`),
    [expanded],
  );

  const value = useMemo<LocationValue>(
    () => ({
      path: PROMPT_PATH,
      expanded,
      history,
      enterCategory,
      enterAbout,
      enterHome,
      toggle,
      isExpanded,
      bootstrap,
      replayFrom,
      chooseFromMenu,
    }),
    [
      expanded,
      history,
      enterCategory,
      enterAbout,
      enterHome,
      toggle,
      isExpanded,
      bootstrap,
      replayFrom,
      chooseFromMenu,
    ],
  );

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  );
};
