import { Route, Routes, useLocation } from "react-router-dom";
import { CategoryDetails } from "./categories/CategoryDetails";
import { Home } from "./Home";
import { AnimatePresence } from "framer-motion";
import { FC } from "react";

export const AnimatedRoutes: FC  = () => {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
          <Route index element={<Home />} />
          <Route
            path="/Educations"
            element={<CategoryDetails category={"Educations"} />}
          />
          <Route
            path="/Experiences"
            element={<CategoryDetails category={"Experiences"} />}
          />
          <Route
            path="/Projects"
            element={<CategoryDetails category={"Projects"} />}
          />
      </Routes>
    </AnimatePresence>
  );
};
