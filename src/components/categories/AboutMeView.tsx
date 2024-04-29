import {
  Card,
  CardContent,
  Typography,
  AspectRatio,
  Chip,
  Stack,
  Divider,
  CardOverflow,
} from "@mui/joy";
import { FC } from "react";

export const AboutMeView: FC = () => {
  return (
    <Card size="lg" variant="soft">
      <CardContent>
        <Card variant="outlined" orientation="horizontal">
          <AspectRatio ratio="1" sx={{ width: 90 }}>
            <img src="./Cornell.jpg" loading="lazy" />
          </AspectRatio>

          <Stack direction="column" spacing={1}>
            <Typography
              level="body-sm"
              aria-describedby="card-description"
              mb={1}
            >
              Bay Area, USA
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
          <Typography level="h3">General information</Typography>

          <Typography level="body-sm">Hello, welcome to my nest</Typography>
          <Typography level="body-sm">
            Feel free to browse around and I will share some learning experience
            and interview experience as a new coder
          </Typography>
          <Typography level="body-sm">
            Personal website:
            <Chip
              variant="outlined"
              color="primary"
              size="sm"
              sx={{ pointerEvents: "none" }}
            >
              https://www.linkedin.com/in/jesse-liu-0613201b4/
            </Chip>
            <Chip
              variant="outlined"
              color="primary"
              size="sm"
              sx={{ pointerEvents: "none" }}
            >
              https://github.com/Jesse1211
            </Chip>
          </Typography>
          <Typography level="body-sm">
            Personal contact:
            <Chip
              variant="outlined"
              color="primary"
              size="sm"
              sx={{ pointerEvents: "none" }}
            >
              zl942@cornell.edu
            </Chip>
            <Chip
              variant="outlined"
              color="primary"
              size="sm"
              sx={{ pointerEvents: "none" }}
            >
              zhenhualiu1211@gmail.com
            </Chip>
          </Typography>
        </Typography>
      </CardContent>
      <CardOverflow >
        <Divider inset="context" />
        <Typography level="body-sm" fontWeight="md" >
          Skill sets:
        </Typography>
        <Chip
          variant="outlined"
          color="primary"
          size="sm"
          sx={{ pointerEvents: "none" }}
        >
          Redis
        </Chip>
        <Chip
          variant="outlined"
          color="primary"
          size="sm"
          sx={{ pointerEvents: "none" }}
        >
          mongoDB
        </Chip>
        <Divider orientation="horizontal" />
      </CardOverflow>
    </Card>
  );
};
