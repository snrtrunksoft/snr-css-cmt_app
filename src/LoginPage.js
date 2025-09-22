// LoginPage.js
import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  return (
    <Authenticator>
      {({ user }) => {
        // once logged in, navigate to "/"
        return <Navigate to="/" replace />;
      }}
    </Authenticator>
  );
}