import React, { FC } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { AnimatePresence } from "framer-motion";
import { createBrowserRouter, createRoutesFromElements, Route, useLocation, Routes, RouterProvider } from "react-router-dom";
import { Home } from "./components/Home.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
    </Route>
  )
);

// Todo: add animation to the routes
export const AnimatedRoutes: FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <RouterProvider router={router} />
      </Routes>
    </AnimatePresence>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
