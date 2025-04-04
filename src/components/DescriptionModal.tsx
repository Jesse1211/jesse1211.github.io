import {
  Button,
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { FC, useState } from "react";
import { TransitEnterexit } from "@mui/icons-material";

export const DescriptionModal: FC<{
  brief: Map<string, string[]>;
  link?: string;
}> = ({ brief: description, link }) => {
  const [modalOpen, setModelOpen] = useState<boolean>(false);

  return (
    <>
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
            onClick={() => setModelOpen(!modalOpen)}
          >
            View Details
          </Button>
        )}
      </Stack>
      {modalOpen && description && (
        <Modal open={!!modalOpen} onClose={() => setModelOpen(false)}>
          <ModalDialog>
            <ModalClose />
            <DialogTitle>Details</DialogTitle>
            <DialogContent>
              {Array.from(description).map(([key, value], index) => (
                <Stack key={index}>
                  <Typography level="body-sm" fontWeight="md">
                    🎯 {key}
                  </Typography>
                  {value.map((accomplishment, index) => (
                    <Typography
                      level="body-sm"
                      fontWeight="md"
                      key={index}
                      pl={2}
                    >
                      • {accomplishment}
                    </Typography>
                  ))}
                </Stack>
              ))}
            </DialogContent>
          </ModalDialog>
        </Modal>
      )}
    </>
  );
};
