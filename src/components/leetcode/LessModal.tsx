import { FC, ReactNode } from "react";
import { Modal, ModalClose, ModalDialog, Box, Stack } from "@mui/joy";
import { GlassPanel } from "../terminal";

// A reusable `$ less <file>` popup, matching the DescriptionModal pattern:
// transparent ModalDialog wrapping a glowing GlassPanel with a close button.
// The body scrolls inside the overlay so long content never bloats the
// append-only terminal history.
export const LessModal: FC<{
  open: boolean;
  onClose: () => void;
  title: string; // e.g. "$ less BFS/200.java"
  header?: ReactNode; // optional header row(s) above the body
  children: ReactNode;
}> = ({ open, onClose, title, header, children }) => (
  <Modal open={open} onClose={onClose}>
    <ModalDialog
      variant="plain"
      sx={{
        p: 0,
        background: "transparent",
        border: "none",
        boxShadow: "none",
        maxWidth: "min(860px, 94vw)",
        width: "100%",
      }}
    >
      <GlassPanel title={title} glow="active">
        <ModalClose sx={{ color: "inherit" }} />
        <Box
          className="term-mono"
          sx={{
            maxHeight: "min(72vh, 720px)",
            overflowY: "auto",
            pr: 1,
          }}
        >
          <Stack spacing={1.2}>
            {header}
            {children}
          </Stack>
        </Box>
      </GlassPanel>
    </ModalDialog>
  </Modal>
);
