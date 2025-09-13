// src/authConfig.js
import { Amplify } from "aws-amplify";
let configured = false;
export function configureAuth(config) {
  if (!configured) {
    Amplify.configure(config);
    console.log("Config received:", JSON.stringify(config, null, 2));
    configured = true;
  }
}