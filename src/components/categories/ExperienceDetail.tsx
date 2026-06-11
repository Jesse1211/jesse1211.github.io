import { FC } from "react";
import { Box, Stack } from "@mui/joy";
import { Experience } from "../../models/Categories";
import { GlassPanel, Chip } from "../terminal";
import { DescriptionModal } from "../DescriptionModal";

const KV: FC<{ k: string; v: string }> = ({ k, v }) => (
  <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 1 }}>
    <Box className="term-accent">{k}</Box>
    <Box>{v}</Box>
  </Box>
);

export const ExperienceDetail: FC<{ data: Experience; slug: string }> = ({
  data,
  slug,
}) => (
  <GlassPanel title={`$ cat ${slug}/info.md`} glow="hover">
    <Stack direction={{ xs: "column", md: "row" }} spacing={2.5} alignItems="flex-start">
      {data.Image && (
        <Box
          component="img"
          src={data.Image}
          alt={data.Company}
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
        <KV k="Company:" v={data.Company} />
        <KV k="Title:" v={data.Title} />
        <KV k="Period:" v={`${data.StartDate} – ${data.EndDate}`} />
        <KV k="Location:" v={data.Location} />
        {data.Description && (
          <Box sx={{ pt: 1 }}>{data.Description}</Box>
        )}
        <Stack direction="row" spacing={1} sx={{ pt: 1, flexWrap: "wrap" }}>
          <DescriptionModal brief={data.Brief} link={data.Link} />
          {data.Link && (
            <Chip onClick={() => window.open(data.Link, "_blank", "noopener,noreferrer")}>
              $ open {data.Link}
            </Chip>
          )}
        </Stack>
      </Stack>
    </Stack>
  </GlassPanel>
);
