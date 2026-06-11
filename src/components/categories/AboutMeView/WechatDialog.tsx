import { FC } from "react";
import { Box, Modal, ModalClose, ModalDialog } from "@mui/joy";
import { GlassPanel } from "../../terminal";

interface Props {
  open: boolean;
  onClose: () => void;
}

const WechatDialog: FC<Props> = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <ModalDialog
      variant="plain"
      sx={{
        p: 0,
        background: "transparent",
        border: "none",
        boxShadow: "none",
        maxWidth: "min(360px, 92vw)",
      }}
    >
      <GlassPanel title="$ qrcode wechat.png" glow="active">
        <ModalClose sx={{ color: "inherit" }} />
        <Box sx={{ textAlign: "center", py: 1 }}>
          <Box className="term-accent" sx={{ mb: 1, letterSpacing: "2px" }}>
            SCAN TO ADD ME
          </Box>
          <Box
            component="img"
            src="Wechat.jpg"
            alt="Wechat QR Code"
            sx={{
              width: "100%",
              maxWidth: 240,
              borderRadius: 1,
              border: "1px solid hsla(180,100%,70%,0.4)",
            }}
          />
        </Box>
      </GlassPanel>
    </ModalDialog>
  </Modal>
);

export default WechatDialog;
