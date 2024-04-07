import {
  Card,
  CardContent,
  Typography,
  CardCover,
  Stack,
  Alert,
  CircularProgress,
  AspectRatio,
  Box,
  CardOverflow,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import { FC, useState } from "react";
import { Experience } from "../../models/Categories";

export const ExperienceView: FC<{
  responseExperience?: Experience[];
  error?: Error;
  busy?: boolean;
}> = ({responseExperience, error, busy}) => {
  const [layout, setLayout] = useState<boolean>(false);
  if (error) {
    return <Alert color="danger">{error.message}</Alert>;
  }

  if (busy) {
    return <CircularProgress />;
  }

  if (!responseExperience) {
    return <Alert color="danger">Loading Experiences</Alert>;
  }
  return (
    <Stack
      height={1}
      direction={"row"}
      overflow="auto"
      sx={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
      gap={4}
    >
      {responseExperience.map((experience, index) => (
        <>
          <Box
            sx={{ minWidth: { xs: 1, md: 0.47, lg: 0.32 } }}
            minHeight={1}
            key={index}
            onClick={() => setLayout(true)}
            style={{ filter: "opacity(0.9)" }}
          >
            <Card key={index} sx={{ height: 1 }} size="lg" variant="soft">
              <AspectRatio ratio="2">
                <CardOverflow>
                  <CardCover>
                    <img src="./Cornell.jpg" loading="lazy" />
                  </CardCover>
                  <CardContent>
                    <Typography level="body-md" fontWeight="lg">
                      {experience.Company}
                    </Typography>
                    <Typography level="body-sm" fontWeight="lg">
                      {experience.Title}
                    </Typography>
                  </CardContent>
                </CardOverflow>
              </AspectRatio>

              <CardContent>
                {experience.Accomplishments.length > 0 && (
                  <>
                    <Typography level="body-sm" fontWeight="lg">
                      Accomplishments:
                    </Typography>
                    {experience.Accomplishments.map((accomplishment, index) => (
                      <Typography level="body-sm" fontWeight="md" key={index}>
                        {accomplishment}
                      </Typography>
                    ))}
                  </>
                )}
              </CardContent>

              <CardOverflow>
                <Divider inset="context" />
                <Typography level="body-sm" fontWeight="md">
                  Skills: {experience.Expertises.join(", ")}
                </Typography>
                <Divider orientation="vertical" />

                <Typography level="body-sm" fontWeight="lg">
                  {experience.StartDate} - {experience.EndDate}
                </Typography>
              </CardOverflow>
            </Card>
          </Box>
          <Modal open={!!layout} onClose={() => setLayout(false)}>
            <ModalDialog>
              <ModalClose />
              <DialogTitle>Description</DialogTitle>
              <DialogContent>
                <Typography level="body-md" fontWeight="lg">
                  {experience.Description}
                </Typography>
              </DialogContent>
            </ModalDialog>
          </Modal>
        </>
      ))}
    </Stack>
  );
};
