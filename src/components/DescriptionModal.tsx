import { FC, useState } from "react";
import { Modal, ModalClose, ModalDialog } from "@mui/joy";
import { Box, Stack } from "@mui/joy";
import { Chip, GlassPanel } from "./terminal";

export const DescriptionModal: FC<{
  brief: Map<string, string[]>;
  link?: string;
}> = ({ brief, link }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {brief && brief.size > 0 && (
        <Chip onClick={() => setOpen(true)}>$ less brief.md</Chip>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          variant="plain"
          sx={{
            p: 0,
            background: "transparent",
            border: "none",
            boxShadow: "none",
            maxWidth: "min(720px, 92vw)",
            width: "100%",
          }}
        >
          <GlassPanel title="$ less brief.md" glow="active">
            <ModalClose sx={{ color: "inherit" }} />
            <Stack spacing={2}>
              {Array.from(brief).map(([heading, bullets], i) => (
                <Stack key={i} spacing={0.5}>
                  <Box className="term-accent" sx={{ fontWeight: 700 }}>
                    ▸ {heading}
                  </Box>
                  {bullets.map((b, j) => (
                    <Box key={j} sx={{ pl: 2 }}>
                      - {b}
                    </Box>
                  ))}
                </Stack>
              ))}
              {link && (
                <Box sx={{ pt: 1 }}>
                  <Chip onClick={() => window.open(link, "_blank", "noopener,noreferrer")}>
                    $ open {link}
                  </Chip>
                </Box>
              )}
            </Stack>
          </GlassPanel>
        </ModalDialog>
      </Modal>
    </>
  );
};
