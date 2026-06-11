import { FC, Fragment, ReactNode } from "react";
import { Box, Stack } from "@mui/joy";
import { useLocation } from "../../state/LocationContext";

const ACCENT_BRIGHT = "hsla(180,100%,80%,1)";
const FOCUS_RING = "0 0 0 2px hsla(180,100%,70%,0.6)";

const clickableSx = {
  background: "none",
  border: 0,
  color: "inherit",
  font: "inherit",
  cursor: "pointer",
  p: 0,
  "&:hover": { color: ACCENT_BRIGHT },
  "&:focus-visible": { outline: "none", boxShadow: FOCUS_RING },
} as const;

const ClickableSegment: FC<{ onClick: () => void; children: ReactNode }> = ({
  onClick,
  children,
}) => (
  <Box component="button" type="button" onClick={onClick} sx={clickableSx}>
    {children}
  </Box>
);

const CurrentSegment: FC<{ children: ReactNode }> = ({ children }) => (
  <Box component="span" sx={{ color: ACCENT_BRIGHT }}>
    {children}
  </Box>
);

export const Breadcrumb: FC = () => {
  const { path, goto, goHome, goUp } = useLocation();
  const segments = path === "~" ? [] : path.replace(/^~\//, "").split("/");
  const atHome = path === "~";

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{
        fontFamily: "inherit",
        fontSize: 13,
        color: "hsla(180,30%,85%,0.7)",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Box component="span" className="term-accent">
        jesse@portfolio
      </Box>
      <Box component="span">:</Box>
      <ClickableSegment onClick={goHome}>~</ClickableSegment>
      {segments.map((seg, i) => {
        const target = "~/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        return (
          <Fragment key={target}>
            <Box component="span">/</Box>
            {isLast ? (
              <CurrentSegment>{seg}</CurrentSegment>
            ) : (
              <ClickableSegment onClick={() => goto(target)}>
                {seg}
              </ClickableSegment>
            )}
          </Fragment>
        );
      })}
      <Box component="span" className="term-accent" sx={{ ml: 0.5 }}>
        $
      </Box>
      {!atHome && (
        <Box
          component="button"
          type="button"
          onClick={goUp}
          sx={{
            ...clickableSx,
            ml: 1,
            px: 0.75,
            py: 0.1,
            border: "1px solid hsla(180,100%,70%,0.4)",
            borderRadius: 0.5,
          }}
          aria-label="Go up one level"
          title="cd .."
        >
          ..
        </Box>
      )}
    </Stack>
  );
};
