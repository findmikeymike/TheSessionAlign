import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./components/theme-provider";
import "./index.css";

// Initialize Tempo Devtools
import { TempoDevtools } from "tempo-devtools";
if (import.meta.env.VITE_TEMPO === "true") {
  TempoDevtools.init();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="app-theme">
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
