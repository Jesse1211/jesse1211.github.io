import { Card, CardContent, Typography, CardCover, Stack } from "@mui/joy";
import { FC } from "react";

export const Experience: FC = () => {
  return (
    <Card sx={{ width: 0.7 }}>
      <CardCover>
        <img
          src="../public/Cornell.jpg"
          loading="lazy"
          style={{ filter: "brightness(0.5)" }}
        />
      </CardCover>

      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Typography level="body-md" fontWeight="lg" textColor="#fff">
            EduRoute Inc.
          </Typography>
          <Typography level="body-md" fontWeight="lg" textColor="#fff">
            StartDate to EndDate
          </Typography>
        </Stack>
        <Typography level="body-sm" fontWeight="lg" textColor="#fff">
          Software Engineer
        </Typography>
        <Typography level="body-sm" fontWeight="lg" textColor="#fff">
          Descripion: Work on various projects.
        </Typography>
      </CardContent>
    </Card>
  );
};
