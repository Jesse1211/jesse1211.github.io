import {
  Card,
  CardContent,
  Typography,
  CardCover,
  Stack,
} from "@mui/joy";
import { FC } from "react";

export const University: FC = () => {
  return (
    <Card sx={{ minWidth: 0.9, alignSelf: "center"}} >
      <CardCover>
        <img
          src="./Cornell.jpg"
          loading="lazy"
          style={{ filter: "brightness(0.5)" }}
        />
      </CardCover>

      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          <Typography level="body-md" fontWeight="lg" textColor="#fff">
            Cornell University
          </Typography>
          <Typography level="body-md" fontWeight="lg" textColor="#fff">
            StartDate to EndDate
          </Typography>
        </Stack>
        <Typography level="body-sm" fontWeight="lg" textColor="#fff">
          Relevent Courses: CS 5110, CS 5456
        </Typography>
        <Typography level="body-sm" fontWeight="lg" textColor="#fff">
          Grade:
        </Typography>
      </CardContent>
    </Card>
  );
};
