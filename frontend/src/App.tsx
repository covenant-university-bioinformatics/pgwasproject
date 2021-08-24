import React, { useCallback } from "react";
import Routes from "./routes";
import { useActions } from "./hooks/useActions";

function App() {
  const { authCheckState } = useActions();

  // if (window.location.host.startsWith("www")) {
  //   window.location.href =
  //     window.location.protocol +
  //     "//" +
  //     window.location.host +
  //     window.location.pathname;
  // }

  const checkAuth = useCallback(() => {
    authCheckState();
  }, [authCheckState]);

  checkAuth();

  return <Routes />;
}

export default App;
