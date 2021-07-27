import React, { useCallback, useEffect } from "react";
import Routes from "./routes";
import { useActions } from "./hooks/useActions";

function App() {
  const { getCurrentUser } = useActions();

  const getUser = useCallback(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return <Routes />;
}

export default App;
