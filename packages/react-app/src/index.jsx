import { Mumbai, DAppProvider } from '@usedapp/core'
import React from "react";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
};

const prevTheme = window.localStorage.getItem("theme");

const config = {
  readOnlyChainId: Mumbai.chainId,
  readOnlyUrls: {
    [Mumbai.chainId]: 'https://matic-mumbai.chainstacklabs.com',
  },
}

ReactDOM.render(
    <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme || "light"}>
      <BrowserRouter>
        <DAppProvider config={config}>
          <App/>
        </DAppProvider>
      </BrowserRouter>
    </ThemeSwitcherProvider>,
  document.getElementById("root"),
);
