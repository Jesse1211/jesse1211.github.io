import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import {
  experimental_extendTheme,
  Experimental_CssVarsProvider,
  THEME_ID,
} from "@mui/material/styles";
import { Footer } from "./components/Footer.tsx";
import { Navigation } from "./components/Navigation.tsx";

const materialTheme = experimental_extendTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Experimental_CssVarsProvider
      defaultMode="system"
      theme={{ [THEME_ID]: materialTheme }}
    >
      <CssVarsProvider>
        <CssBaseline disableColorScheme />
        <App/>
        <Footer/>
      </CssVarsProvider>
    </Experimental_CssVarsProvider>
  </React.StrictMode>
);
