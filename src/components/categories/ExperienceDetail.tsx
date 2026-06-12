import { FC } from "react";
import { Box, Stack } from "@mui/joy";
import { Experience } from "../../models/Categories";
import { Chip } from "../terminal";
import { DescriptionModal } from "../DescriptionModal";

const LABEL_WIDTH = "5.5em";

const Field: FC<{ k: string; v: string }> = ({ k, v }) => (
  <Box sx={{ display: "flex", gap: 1 }}>
    <Box
      className="term-dim"
      sx={{ minWidth: LABEL_WIDTH, flexShrink: 0 }}
    >
      {k}
    </Box>
    <Box sx={{ wordBreak: "break-word" }}>{v}</Box>
  </Box>
);

export const ExperienceDetail: FC<{ data: Experience }> = ({ data }) => (
  <Box
    sx={{
      pl: { xs: 2, md: 4 },
      pt: 0.5,
      pb: 1.5,
      borderLeft: "1px dashed hsla(180,100%,70%,0.25)",
      ml: { xs: 2, md: 3 },
      fontSize: "0.95em",
    }}
  >
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems="flex-start"
    >
      {data.Image && (
        <Box
          component="img"
          src={data.Image}
          alt={data.Company}
          loading="lazy"
          sx={{
            width: 72,
            height: 72,
            objectFit: "contain",
            flexShrink: 0,
            opacity: 0.9,
          }}
        />
      )}
      <Stack spacing={0.4} sx={{ flex: 1, minWidth: 0 }}>
        <Field k="Company:" v={data.Company} />
        <Field k="Title:" v={data.Title} />
        <Field k="Period:" v={`${data.StartDate} - ${data.EndDate}`} />
        <Field k="Location:" v={data.Location} />
      </Stack>
    </Stack>
    {data.Description && (
      <Box sx={{ mt: 1.5, color: "hsla(180,30%,85%,0.85)" }}>
        {data.Description}
      </Box>
    )}
    <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap" }}>
      <DescriptionModal brief={data.Brief} link={data.Link} />
      {data.Link && (
        <Chip
          onClick={() =>
            window.open(data.Link, "_blank", "noopener,noreferrer")
          }
        >
          $ open {data.Link}
        </Chip>
      )}
    </Stack>
  </Box>
);
