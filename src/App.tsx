import { BrowserRouter } from "react-router-dom";
import { FC } from "react";
import { AnimatedRoutes } from "./components/AnimatedRoutes";
import { Navigation } from "./components/Navigation";

export const App: FC = () => {
  return (
    <BrowserRouter>
        <Navigation/>
        <AnimatedRoutes/>
    </BrowserRouter>
  );
};
