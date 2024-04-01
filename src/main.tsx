import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Home } from "./components/Home.tsx";
import { CategoryDetails } from "./components/CategoryDetails.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="/Educations" element={<CategoryDetails category={"Educations"} />} />
      <Route path="/Experiences" element={<CategoryDetails category={"Experiences"} />} />
      <Route path="/Projects" element={<CategoryDetails category={"Projects"} />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
