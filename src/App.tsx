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
import { PortfolioProvider } from "./components/PortfolioContext";

const materialTheme = materialExtendTheme();
// const LOCALES_LIST = [
//   {
//     label: "English",
//     value: "en-US",
//   },
//   {
//     label: "简体中文",
//     value: "zh-CN",
//   },
// ];

// const LOCALE_DATA = {
//   "en-US": enUS,
//   // "zh-CN": zhCN,
// };

// const initializeIntl = () => {
//   let currentLocale = intl.determineLocale({
//     urlLocaleKey: "lang", // Example: https://fe-tool.com/react-intl-universal?lang=en-US
//     cookieLocaleKey: "lang", // Example: "lang=en-US" in cookie
//   });

//   const locales = LOCALES_LIST.filter(
//     (item) => item.value.toLowerCase() === currentLocale.toLowerCase()
//   );

//   if (locales.length === 0) {
//     currentLocale = "en-US";
//   }

//   return currentLocale;
// };

export const App: FC = () => {
  // const [currentLocale, setCurrentLocale] = useState(initializeIntl());

  // useEffect(() => {
  //   intl.init({
  //     currentLocale,
  //     locales: LOCALE_DATA,
  //   });
  //   // setInitDone(true)
  //   document.cookie = `lang=${currentLocale}`;
  //   document.title = intl.get("PORTFOLIO_ZHIYUAN_WANG");
  // }, [currentLocale]);

  // const onLocaleChange = (locale: string) => {
  //   // set document cookie
  //   // setInitDone(false)
  //   setCurrentLocale(locale);
  // };

  const THEME = extendTheme({
    components: {
      JoyButton: {
        styleOverrides: {
          root: () => ({
            fontFamily: "Lucia Console, Cursive, monospace",
          }),
        },
      },
      JoyTypography: {
        styleOverrides: {
          root: () => ({
            fontFamily: "Lucia Console, monospace",
          }),
        },
      },
    },
  });

  return (
    <MaterialCssVarsProvider
      defaultMode="system"
      theme={{ [MATERIAL_THEME_ID]: materialTheme }}
    >
      <JoyCssVarsProvider defaultMode="system" theme={THEME}>
        <canvas className="canvas"></canvas>
        <CssBaseline />
        <PortfolioProvider>
          {/* <Navigation /> */}
          <Home />
        </PortfolioProvider>
        <Outlet />
        <Footer />
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
};
