import { FC } from "react";
import { Box, Stack } from "@mui/joy";
import { Education } from "../../models/Categories";
import { GlassPanel } from "../terminal";
import { KV } from "./KV";

export const EducationDetail: FC<{ data: Education; slug: string }> = ({
  data,
  slug,
}) => (
  <GlassPanel title={`$ cat ${slug}/info.md`} glow="hover">
    <Stack direction={{ xs: "column", md: "row" }} spacing={2.5} alignItems="flex-start">
      {data.Image && (
        <Box
          component="img"
          src={data.Image}
          alt={data.School}
          loading="lazy"
          sx={{
            width: 120,
            height: 120,
            objectFit: "contain",
            border: "1px solid hsla(180,100%,70%,0.4)",
            borderRadius: 1,
            p: 1,
            background: "hsla(180,100%,70%,0.05)",
          }}
        />
      )}
      <Stack spacing={0.6} sx={{ flex: 1 }}>
        <KV k="School:" v={data.School} />
        <KV k="Major:" v={data.Major} />
        <KV k="GPA:" v={data.Grade} />
        <KV k="Period:" v={`${data.StartDate} - ${data.EndDate}`} />
        <KV k="Location:" v={data.Location} />
        <KV k="Moto:" v={`"${data.Moto}"`} />
        <Box sx={{ pt: 1, fontStyle: "italic", color: "hsla(180,30%,85%,0.75)" }}>
          {data.Description}
        </Box>
      </Stack>
    </Stack>
  </GlassPanel>
);
