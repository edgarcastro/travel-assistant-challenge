import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import { HeroUIProvider } from "@heroui/react";
import "@aws-amplify/ui-react/styles.css";
import "./index.css";
import App from "./App";

if (import.meta.env.VITE_DEV_AUTH !== "true") {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
        loginWith: {
          email: true,
        },
      },
    },
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  </StrictMode>
);
