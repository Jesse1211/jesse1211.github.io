import { Card, Typography, AspectRatio, Chip, Stack, Divider } from "@mui/joy";
import { FC } from "react";
import SocialMediaButtons from "./SocialMedialButtons";

export const AboutMeView: FC = () => {
  return (
    <Stack width={1} justifyItems={"center"} flex={1} alignItems={"center"}>
      <Stack
        sx={{
          marginBottom: "10%",
          width: { xs: 0.7, md: 0.6, lg: 0.5 },
          maxWidth: { xs: 0.7, md: 0.6, lg: 0.5 },
        }}
      >
        <Card variant="outlined" orientation="horizontal">
          <AspectRatio ratio="1" sx={{ minWidth: 90 }}>
            <img src="./Cornell.jpg" loading="lazy" />
          </AspectRatio>

          <Stack direction="column" spacing={1}>
            <Typography
              level="body-sm"
              aria-describedby="card-description"
              mb={1}
            >
              New York, USA
            </Typography>
            <Chip
              variant="outlined"
              color="primary"
              size="sm"
              sx={{ pointerEvents: "none" }}
            >
              Seeking SWE Positions
            </Chip>
            <Chip
              variant="outlined"
              color="primary"
              size="sm"
              sx={{ pointerEvents: "none" }}
            >
              CS MEng @ Cornell University
            </Chip>
          </Stack>
        </Card>

        <Typography
          startDecorator={<Typography level="body-sm"> H3</Typography>}
          flexDirection={"column"}
          alignItems={"flex-start"}
        >
          <Typography level="h3" textColor="white">
            General information
          </Typography>

          <Typography level="body-sm" textColor="white">
            Hello, welcome to my nest
          </Typography>
          <Typography level="body-sm" textColor="white">
            Feel free to browse around and I will share some learning experience
            and interview experience as a new coder in the future
          </Typography>
        </Typography>

        <Divider inset="context" />
        <SocialMediaButtons />
      </Stack>
    </Stack>
  );
};
