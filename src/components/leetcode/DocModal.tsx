import { FC, useEffect, useState } from "react";
import { Box } from "@mui/joy";
import { LessModal } from "./LessModal";
import { Markdown } from "./Markdown";

// Generic markdown viewer modal for guides and blog posts.
export const DocModal: FC<{
  open: boolean;
  onClose: () => void;
  title: string; // "$ less guides/BFS.md"
  load: () => Promise<string>;
  loadKey: string; // re-fetch when this changes
}> = ({ open, onClose, title, load, loadKey }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    setSrc(null);
    setErr(null);
    load()
      .then((s) => alive && setSrc(s))
      .catch((e) => alive && setErr(String(e)));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, loadKey]);

  return (
    <LessModal open={open} onClose={onClose} title={title}>
      {err ? (
        <Box sx={{ color: "hsla(0,80%,70%,1)" }}>failed to load: {err}</Box>
      ) : src == null ? (
        <Box className="term-dim">loading…</Box>
      ) : (
        <Markdown source={src} />
      )}
    </LessModal>
  );
};
