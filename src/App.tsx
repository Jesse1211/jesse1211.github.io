import { BrowserRouter, Route, Routes } from "react-router-dom"
import { FC } from "react"
import { Home } from "./components/Home"
import Words from "./components/Words"

export const App : FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
                <Route path = "test" element={<Words />} />
            </Routes>
        </BrowserRouter>
    )
}
