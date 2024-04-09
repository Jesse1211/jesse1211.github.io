import {
  Box,
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
} from "@mui/joy";
import { FC, ReactNode } from "react";

export const CardContainer: FC<{
  cardView: ReactNode;
  description?: string;
  onSetLayout?: (isLayout: boolean) => void;
  isLayout?: boolean;
}> = ({ cardView, description, onSetLayout, isLayout }) => {
  return (
    <>
      <Box
        onClick={() => onSetLayout && onSetLayout(!isLayout)}
        flex={1}
        sx={{
          minWidth: { xs: 1, md: 0.4, lg: 0.3 },
          maxWidth: { xs: 1, md: 0.4, lg: 0.3 },
        }}
        minHeight={1}
        style={{ filter: "opacity(0.9)" }}
      >
        {cardView}
      </Box>
      {onSetLayout && isLayout && description && (
        <Modal open={!!isLayout} onClose={() => onSetLayout(false)}>
          <ModalDialog>
            <ModalClose />
            <DialogTitle>Description</DialogTitle>
            <DialogContent>
              <Typography level="body-md" fontWeight="lg">
                {description}
              </Typography>
            </DialogContent>
          </ModalDialog>
        </Modal>
      )}
    </>
  );
};
