import React, { PropsWithChildren } from "react";
import {
  BrowserRouter,
  Switch,
  RouteComponentProps,
  Link,
  Route,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import HomeComingSoon from "./components/utility/HomeComingSoon";
import LDStructure from "./components/LDStructure";
import Imputation from "./components/Imputation";
import ToolsHome from "./components/ToolsHome";
import Annotation from "./components/Annotation";
import Deleteriousness from "./components/Deleteriousness";
import Regulation from "./components/Regulation";
import Liftover from "./components/Liftover";
import Footer from "./components/Footer";
import Finemap from "./components/Finemap";
import Susie from "./components/Susie";
import Paintor from "./components/Paintor";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import AuthGuard from "./hoc/AuthGuard";
import Home from "./Pages/Home/Home";
type Props = {};

const Routes: React.FC<Props> = (props) => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route
          path="/tools/imputation"
          exact
          component={AuthGuard(Imputation)}
        />
        <Route path="/tools/annotation" component={AuthGuard(Annotation)} />
        <Route
          path="/tools/bayes_finemap"
          exact
          component={AuthGuard(Finemap)}
        />
        <Route path="/tools/bayes_susie" exact component={AuthGuard(Susie)} />
        <Route
          path="/tools/bayes_paintor"
          exact
          component={AuthGuard(Paintor)}
        />
        <Route
          path="/tools/deleteriousness"
          component={AuthGuard(Deleteriousness)}
        />
        <Route
          path="/tools/Regulation"
          exact
          component={AuthGuard(Regulation)}
        />
        <Route path="/tools/liftover" component={AuthGuard(Liftover)} />
        <Route path="/tools/ld_structure" component={AuthGuard(LDStructure)} />
        <Route path="/tools" exact component={ToolsHome} />
        <Route path="/dashboard" exact component={HomeComingSoon} />
        <Route path="/tutorials" exact component={HomeComingSoon} />
        <Route path="/workflows" exact component={HomeComingSoon} />
        <Route path="/sign_in" exact component={SignIn} />
        <Route path="/sign_up" exact component={SignUp} />
        <Route path="/" exact component={Home} />
        <Route
          render={(
            props:
              | PropsWithChildren<RouteComponentProps<any>>
              | PropsWithChildren<any>
          ) => (
            <h1
              style={{
                padding: "10rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              404 Not Found! &nbsp; <Link to={props.match.url}> Go Home</Link>
            </h1>
          )}
        />
      </Switch>
      <ToastContainer
        position="top-left"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Footer />
    </BrowserRouter>
  );
};

export default Routes;
