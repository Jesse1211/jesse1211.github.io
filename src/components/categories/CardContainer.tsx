import {
  Box,
  Button,
  Card,
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { FC, ReactNode, useState } from "react";
import { TransitEnterexit } from "@mui/icons-material";

export const CardContainer: FC<{
  cardView: ReactNode;
  description?: string[];
  link?: string;
}> = ({ cardView, description, link }) => {
  const [layout, setLayout] = useState<boolean>(false);

  return (
    <>
      <Box
        flex={1}
        sx={{
          minWidth: { xs: 0.7, md: 0.4, lg: 0.3 },
          maxWidth: { xs: 0.7, md: 0.4, lg: 0.3 },
          minHeight: { xs: 0.3, md: 0.45, lg: 0.45 },
          maxHeight: { xs: 0.3, md: 0.45, lg: 0.45 },
        }}
        style={{ filter: "opacity(0.9)" }}
      >
        <Card
          sx={{ height: 1, justifyContent: "space-between" }}
          size="md"
          variant="soft"
        >
          {cardView}
          {description && (
            <Stack
              direction={"row"}
              justifyContent={description && !link ? "center" : "space-between"}
            >
              {link !== undefined && (
                <Button
                  size="sm"
                  component="a"
                  variant="outlined"
                  href={link}
                  target="_blank"
                  color="neutral"
                  endDecorator={<TransitEnterexit />}
                >
                  Visit Site
                </Button>
              )}
              {description && (
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => setLayout(!layout)}
                >
                  View Details
                </Button>
              )}
            </Stack>
          )}
        </Card>
      </Box>
      {layout && description && (
        <Modal open={!!layout} onClose={() => setLayout(false)}>
          <ModalDialog>
            <ModalClose />
            <DialogTitle>Accomplishments</DialogTitle>
            <DialogContent>
              {description.map((accomplishment, index) => (
                <Typography level="body-sm" fontWeight="md" key={index}>
                  🎯 {accomplishment}
                </Typography>
              ))}
            </DialogContent>
          </ModalDialog>
        </Modal>
      )}
    </>
  );
};
