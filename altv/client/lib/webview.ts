import { WebView, log } from "alt-client";

log("Starting WebView");
export const Browser: WebView = new WebView(
  "http://resource/interface/index.html"
);
Browser.focus();
