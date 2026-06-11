import { FC, useContext, useEffect, useState } from "react";
import { Box, Stack } from "@mui/joy";
import { StarAndPlanet } from "./canvas/StarAndPlanet";
import { GlassPanel, Prompt, TypeLine, Chip, Breadcrumb } from "./terminal";
import { useLocation } from "../state/LocationContext";
import { HomeNavigation } from "./HomeNavigation";
import { PortfolioContext } from "./PortfolioContext";

type Stage = 0 | 1 | 2 | 3 | 4;

export const Home: FC = () => {
  useEffect(() => {
    StarAndPlanet();
  }, []);

  const { path, goto } = useLocation();
  const { $locale } = useContext(PortfolioContext);
  const [stage, setStage] = useState<Stage>(0);

  // Reset the landing sequence whenever we come back home or switch locale.
  useEffect(() => {
    if (path === "~") setStage(0);
  }, [path, $locale]);

  const cn = $locale === "zh-CN";
  const intro = cn
    ? "Jesse Liu — 全栈开发, 康奈尔大学计算机硕士"
    : "Jesse Liu — full-stack developer, CS MEng @ Cornell";
  const motto1 = cn
    ? "永远不要让自己止步."
    : "Never hold yourself back.";
  const motto2 = cn
    ? "走自己的路, 享受这段旅程."
    : "Follow the path, enjoy the journey.";
  const categories: { key: string; label: string; target: string; external?: string }[] = [
    { key: "education", label: "education/", target: "~/education" },
    { key: "experience", label: "experience/", target: "~/experience" },
    { key: "blog", label: "blog/", target: "", external: "https://blog.jesseliu.me" },
    { key: "about", label: "about/", target: "~/about" },
  ];

  return (
    <Stack
      spacing={3}
      sx={{
        width: { xs: "92%", md: "80%", lg: "70%" },
        my: { xs: 4, md: 6 },
        position: "relative",
        zIndex: 1,
      }}
    >
      <GlassPanel title={`~/jesse — zsh`} glow="active">
        <Stack spacing={1.5}>
          <Breadcrumb />

          {path === "~" ? (
            <Stack spacing={1.2} sx={{ mt: 1 }}>
              {/* Stage 0: whoami */}
              <Prompt>
                <TypeLine
                  text="whoami"
                  onDone={() => setStage((s) => (s < 1 ? 1 : s))}
                />
              </Prompt>
              {stage >= 1 && (
                <Prompt symbol=">">
                  <TypeLine text={intro} onDone={() => setStage((s) => (s < 2 ? 2 : s))} />
                </Prompt>
              )}

              {stage >= 2 && (
                <Prompt>
                  <TypeLine
                    text="cat motto.txt"
                    onDone={() => setStage((s) => (s < 3 ? 3 : s))}
                  />
                </Prompt>
              )}
              {stage >= 3 && (
                <>
                  <Prompt symbol=">"><Box sx={{ color: "aqua" }}>{motto1}</Box></Prompt>
                  <Prompt symbol=">">
                    <Box>{motto2}</Box>
                  </Prompt>
                  <Prompt>
                    <TypeLine
                      text="ls categories/"
                      onDone={() => setStage((s) => (s < 4 ? 4 : s))}
                    />
                  </Prompt>
                </>
              )}
              {stage >= 4 && (
                <Stack direction="row" spacing={1.2} flexWrap="wrap" sx={{ pt: 0.5 }}>
                  {categories.map((c) => (
                    <Chip
                      key={c.key}
                      onClick={() =>
                        c.external
                          ? window.open(c.external, "_blank", "noopener,noreferrer")
                          : goto(c.target)
                      }
                    >
                      [{c.label}]
                    </Chip>
                  ))}
                </Stack>
              )}
              <Prompt showCursor />
            </Stack>
          ) : (
            <Box sx={{ mt: 1 }}>
              <HomeNavigation />
            </Box>
          )}
        </Stack>
      </GlassPanel>
    </Stack>
  );
};
