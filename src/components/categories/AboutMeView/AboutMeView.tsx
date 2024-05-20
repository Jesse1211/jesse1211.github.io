import { Card, Typography, AspectRatio, Stack, Divider } from "@mui/joy";
import { FC } from "react";
import SocialMediaButtons from "./SocialMedialButtons";
import { Introduction } from "../../../models/Categories";

export const AboutMeView: FC<{ introduction: Introduction }> = ({
  introduction,
}) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Card
        sx={{
          justifyItems: "center",
          alignItems: "center",
          width: { xs: 0.9, md: 0.7, lg: 0.6 },
          backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent background color
          // marginBottom: "10%",
          // height: "auto",
        }}
      >
        <Stack
          sx={{
            width: { xs: 0.7, md: 0.6, lg: 0.5 },
            maxWidth: { xs: 0.7, md: 0.6, lg: 0.5 },
          }}
        >
          <Card variant="outlined" orientation="horizontal">
            <AspectRatio ratio="1" sx={{ minWidth: 90 }}>
              <img src="./jacquelyn.jpg" loading="lazy" />
            </AspectRatio>

            <Stack direction="column" spacing={1}>
              <Typography
                level="body-sm"
                aria-describedby="card-description"
                mb={1}
              >
                {introduction.adderess}
              </Typography>
              {/* 
            {introduction.chips.map((chip, index) => (
              <Chip
                key={index}
                variant="outlined"
                color="primary"
                size="sm"
                sx={{ pointerEvents: "none" }}
              >
                {chip}
              </Chip>
            ))} */}
            </Stack>
          </Card>

          <Typography
            startDecorator={<Typography level="body-sm"> H3</Typography>}
            flexDirection={"column"}
            alignItems={"flex-start"}
          >
            <Typography level="h3" textColor="black">
              {introduction.generalInformation}
            </Typography>

            <Typography level="body-sm" textColor="black">
              {introduction.line1}
            </Typography>
            <Typography level="body-sm" textColor="black">
              {introduction.parapraph}
            </Typography>
          </Typography>

          <Divider inset="context" />
          <SocialMediaButtons />
        </Stack>
      </Card>
    </div>
  );
};
