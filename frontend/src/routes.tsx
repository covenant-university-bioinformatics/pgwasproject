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
type Props = {};

const Routes: React.FC<Props> = (props) => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/dashboard" exact component={HomeComingSoon} />
        <Route path="/tutorials" exact component={HomeComingSoon} />
        <Route path="/sign_in" exact component={SignIn} />
        <Route path="/sign_up" exact component={SignUp} />
        <Route path="/imputation" exact component={AuthGuard(Imputation)} />
        <Route path="/annotation" component={AuthGuard(Annotation)} />
        <Route path="/bayes_finemap" component={AuthGuard(Finemap)} />
        <Route path="/bayes_susie" component={AuthGuard(Susie)} />
        <Route path="/bayes_paintor" component={AuthGuard(Paintor)} />
        <Route
          path="/deleteriousness"
          exact
          component={AuthGuard(Deleteriousness)}
        />
        <Route path="/Regulation" exact component={AuthGuard(Regulation)} />
        <Route path="/liftover" component={AuthGuard(Liftover)} />
        <Route path="/ld_structure" component={AuthGuard(LDStructure)} />
        <Route path="/" exact component={ToolsHome} />
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
        autoClose={10000}
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
