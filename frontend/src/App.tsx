import React, { useCallback } from "react";
import Routes from "./routes";
import { useActions } from "./hooks/useActions";

function App() {
  const { authCheckState } = useActions();

  const checkAuth = useCallback(() => {
    authCheckState();
  }, [authCheckState]);

  checkAuth();

  return <Routes />;
}

export default App;
