import { FC } from "react";
import { Box, Stack } from "@mui/joy";
import { Introduction } from "../../../models/Categories";
import { GlassPanel, Prompt } from "../../terminal";
import SocialMediaButtons from "./SocialMedialButtons";

export const AboutMeView: FC<{ introduction: Introduction }> = ({
  introduction,
}) => (
  <GlassPanel glow="hover">
    <Prompt>
      <Box component="span">cat profile.txt</Box>
    </Prompt>
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2.5}
      sx={{ mt: 1.5 }}
      alignItems="flex-start"
    >
      <Box
        component="img"
        src="./Jesse.png"
        alt="Jesse"
        loading="lazy"
        sx={{
          width: 140,
          height: 140,
          borderRadius: "50%",
          objectFit: "cover",
          border: "1px solid hsla(180,100%,70%,0.5)",
          boxShadow: "0 0 14px hsla(180,100%,70%,0.35)",
        }}
      />
      <Stack spacing={0.6} sx={{ flex: 1 }}>
        <Box className="term-accent">{introduction.adderess}</Box>
        <Box>{introduction.line1}</Box>
        <Box sx={{ color: "hsla(180,30%,85%,0.85)" }}>
          {introduction.parapraph}
        </Box>
      </Stack>
    </Stack>
    <Box sx={{ mt: 2.5 }}>
      <Prompt>
        <Box component="span">contact --list</Box>
      </Prompt>
      <Box sx={{ mt: 1 }}>
        <SocialMediaButtons />
      </Box>
    </Box>
  </GlassPanel>
);
