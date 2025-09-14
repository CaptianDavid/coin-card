import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "styled-components";
import ThemeStyles from "./assets/styles/ThemeStyles.jsx";
import GlobalStyles from "./assets/styles/GlobalStyles.jsx";
import Web3ModalProvider from "./context/Web3ModalProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Web3ModalProvider>
      <ThemeProvider theme={ThemeStyles}>
        <GlobalStyles />
        <App />
      </ThemeProvider>
    </Web3ModalProvider>
  </StrictMode>
);
