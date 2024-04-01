import { Outlet } from "react-router-dom";
import { FC } from "react";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import {
  experimental_extendTheme,
  Experimental_CssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";

const materialTheme = experimental_extendTheme();

export const App: FC = () => {
  return (
    <Experimental_CssVarsProvider
      defaultMode="system"
      theme={{ [MATERIAL_THEME_ID]: materialTheme }}
    >
      <CssVarsProvider defaultMode="system">
        <CssBaseline />
        <Outlet />
      </CssVarsProvider>
    </Experimental_CssVarsProvider>
  );
};
