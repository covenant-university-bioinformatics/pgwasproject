import React, { useCallback, useEffect } from "react";
import Routes from "./routes";
import { useActions } from "./hooks/useActions";
import { useTypedSelector } from "./hooks/useTypedSelector";

function App() {
  const { authCheckState } = useActions();

  const test = () => {
    console.log("executing...");
  };

  test();

  const checkAuth = useCallback(() => {
    authCheckState();
  }, [authCheckState]);

  checkAuth();

  return <Routes />;
}

export default App;
