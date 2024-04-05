import { CssBaseline, CssVarsProvider as JoyCssVarsProvider } from "@mui/joy";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { Footer } from "./components/Footer";

const materialTheme = materialExtendTheme();

export const App: FC = () => {
  return (
    <MaterialCssVarsProvider
      defaultMode="system"
      theme={{ [MATERIAL_THEME_ID]: materialTheme }}
    >
      <JoyCssVarsProvider defaultMode="system">
        {/* <Navigation /> */}
        <CssBaseline />
        <Outlet />
        <Footer />
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
};
