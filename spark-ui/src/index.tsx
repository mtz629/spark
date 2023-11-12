import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { MixpanelEvents } from "./interfaces/Mixpanel";
import { reactRouter } from "./Router";
import { MixpanelService } from "./services/MixpanelService";
import store from "./Store";
import theme from "./theme";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement!);

if (location.protocol == 'https:') {
  var meta = document.createElement('meta');
  meta.httpEquiv = "Content-Security-Policy";
  meta.content = "upgrade-insecure-requests";
  document.getElementsByTagName('head')[0].appendChild(meta);
}

MixpanelService.InitMixpanel();
MixpanelService.Track(MixpanelEvents.AppLoaded);

root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <RouterProvider router={reactRouter} />
    </ThemeProvider>
  </Provider>,
);
