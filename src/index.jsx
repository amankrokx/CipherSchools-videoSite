import React, { useEffect } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import "./index.css"
import "material-icons"

const root = createRoot(document.getElementById("root"))
const theme = createTheme({
    palette: {
        primary: {
            main: "#4caf50", // This is an orange looking color
            light: "#80e27e",
            dark: "#087f23",
            contrastText: "#fff",
        },
        secondary: {
            main: "#2979ff", //Another orange-ish color
            light: "#75a7ff",
            dark: "#004ecb",
            contrastText: "#888888"
        },
        neutral: {
            main: "#64748B",
            contrastText: "#fff",
        },
        white: {
            contrastText: "#fff",
            main: "#ffffff",
            dark: "#f5f5f5",
        },
        black: {
            contrastText: "#fff",
            main: "#323232",
        },
        contrastThreshold: 3,
        mode: "dark",
    },
})

window.theme = theme


root.render(
    <ThemeProvider theme={theme}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ThemeProvider>
)