// src/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";
import React, { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const session = await fetchAuthSession();
        setIsAuthed(!!session.tokens?.idToken);
      } catch {
        setIsAuthed(false);
      }
      setIsChecking(false);
    };
    check();
  }, []);

  if (isChecking) return <div>Loading...</div>;

  return isAuthed ? children : <Navigate to="/login" replace />;
}