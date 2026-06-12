import { FC } from "react";
import { Box, Stack } from "@mui/joy";
import { Education } from "../../models/Categories";

const LABEL_WIDTH = "5.5em";

const Field: FC<{ k: string; v: string; italic?: boolean }> = ({
  k,
  v,
  italic,
}) => (
  <Box sx={{ display: "flex", gap: 1 }}>
    <Box
      className="term-dim"
      sx={{ minWidth: LABEL_WIDTH, flexShrink: 0 }}
    >
      {k}
    </Box>
    <Box
      sx={{
        fontStyle: italic ? "italic" : "normal",
        wordBreak: "break-word",
      }}
    >
      {v}
    </Box>
  </Box>
);

export const EducationDetail: FC<{ data: Education }> = ({ data }) => (
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
          alt={data.School}
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
        <Field k="School:" v={data.School} />
        <Field k="Major:" v={data.Major} />
        <Field k="GPA:" v={data.Grade} />
        <Field k="Period:" v={`${data.StartDate} - ${data.EndDate}`} />
        <Field k="Location:" v={data.Location} />
        <Field k="Moto:" v={`"${data.Moto}"`} italic />
      </Stack>
    </Stack>
    <Box
      sx={{
        mt: 1.5,
        color: "hsla(180,30%,85%,0.85)",
        fontStyle: "italic",
      }}
    >
      {data.Description}
    </Box>
  </Box>
);
