import { FC, Fragment } from "react";
import { Box, Stack } from "@mui/joy";
import { useLocation } from "../../state/LocationContext";

export const Breadcrumb: FC = () => {
  const { path, goto, goHome } = useLocation();
  const segments = path === "~" ? [] : path.replace(/^~\//, "").split("/");

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{
        fontFamily: "inherit",
        fontSize: 13,
        color: "hsla(180,30%,85%,0.7)",
        flexWrap: "wrap",
      }}
    >
      <Box component="span" className="term-accent">
        jesse@portfolio
      </Box>
      <Box component="span">:</Box>
      <Box
        component="button"
        type="button"
        onClick={goHome}
        sx={{
          background: "none",
          border: 0,
          color: "inherit",
          font: "inherit",
          cursor: "pointer",
          p: 0,
          "&:hover": { color: "hsla(180,100%,80%,1)" },
          "&:focus-visible": {
            outline: "none",
            boxShadow: "0 0 0 2px hsla(180,100%,70%,0.6)",
          },
        }}
      >
        ~
      </Box>
      {segments.map((seg, i) => {
        const target = "~/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        return (
          <Fragment key={target}>
            <Box component="span">/</Box>
            <Box
              component={isLast ? "span" : "button"}
              {...(isLast ? {} : { type: "button" as const })}
              onClick={isLast ? undefined : () => goto(target)}
              sx={{
                background: "none",
                border: 0,
                color: isLast ? "hsla(180,100%,80%,1)" : "inherit",
                font: "inherit",
                cursor: isLast ? "default" : "pointer",
                p: 0,
                "&:hover": isLast
                  ? undefined
                  : { color: "hsla(180,100%,80%,1)" },
                "&:focus-visible": isLast
                  ? undefined
                  : {
                      outline: "none",
                      boxShadow: "0 0 0 2px hsla(180,100%,70%,0.6)",
                    },
              }}
            >
              {seg}
            </Box>
          </Fragment>
        );
      })}
      <Box component="span" className="term-accent" sx={{ ml: 0.5 }}>
        $
      </Box>
    </Stack>
  );
};
