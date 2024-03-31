import { BrowserRouter, Route, Routes } from "react-router-dom"
import { FC } from "react"
import { Home } from "./components/Home"

export const App : FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
            </Routes>
        </BrowserRouter>
    )
}
