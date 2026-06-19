import {
  CssBaseline,
  CssVarsProvider as JoyCssVarsProvider,
  extendTheme,
} from "@mui/joy";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { Footer } from "./components/Footer";
import { Home } from "./components/Home";
import { Navigation } from "./components/Navigation";
import { PortfolioProvider } from "./components/PortfolioProvider";
import { LocationProvider } from "./state/LocationProvider";
import { fontStack } from "./theme/terminal";
import TargetCursor from "./components/effects/TargetCursor";
import PrismBackground from "./components/canvas/PrismBackground";

const materialTheme = materialExtendTheme();

export const App: FC = () => {
  const THEME = extendTheme({
    components: {
      JoyButton: {
        styleOverrides: {
          root: () => ({ fontFamily: fontStack }),
        },
      },
      JoyTypography: {
        styleOverrides: {
          root: () => ({ fontFamily: fontStack }),
        },
      },
    },
  });

  return (
    <MaterialCssVarsProvider
      defaultMode="dark"
      theme={{ [MATERIAL_THEME_ID]: materialTheme }}
    >
      <JoyCssVarsProvider defaultMode="dark" theme={THEME}>
        <TargetCursor />
        <PrismBackground />
        <canvas id="zdog-canvas" className="canvas"></canvas>
        <CssBaseline />
        <Outlet />
        <PortfolioProvider>
          <LocationProvider>
            <Navigation />
            <div
              style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Home />
            </div>
            <Footer />
          </LocationProvider>
        </PortfolioProvider>
        <div className="term-scanlines" aria-hidden />
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
};
