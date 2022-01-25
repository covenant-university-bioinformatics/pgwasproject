import React, { PropsWithChildren, Suspense } from "react";
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
import ToolsHome from "./components/ToolsHome";
import Footer from "./components/Footer";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import ForgotPassword from "./components/ForgotPassword";
import ChangePassword from "./components/ChangePassword";
import Home from "./Pages/Home/Home";
import AuthenticatedRoute from "./hoc/AuthenticatedRoute";
//Lazy imports
const Annotation = React.lazy(() => import("./components/Annotation"));
const Imputation = React.lazy(() => import("./components/Imputation"));
const Finemap = React.lazy(() => import("./components/Finemap"));
const LDStructure = React.lazy(() => import("./components/LDStructure"));
const Deleteriousness = React.lazy(
  () => import("./components/Deleteriousness")
);
const Regulation = React.lazy(() => import("./components/Regulation"));
const Liftover = React.lazy(() => import("./components/Liftover"));
const Susie = React.lazy(() => import("./components/Susie"));
const Paintor = React.lazy(() => import("./components/Paintor"));
const EQTL = React.lazy(() => import("./components/EQTL"));
const EQTLPlot = React.lazy(() => import("./components/EQTLPlot"));
const PathwayBased = React.lazy(() => import("./components/PathwayBased"));
const GeneBased = React.lazy(() => import("./components/GeneBased"));
const Tutorials = React.lazy(() => import("./components/Tutorials"));

type Props = {};

const Routes: React.FC<Props> = (props) => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route
          path="/tools/imputation"
          exact
          render={(props) => (
            <Suspense
              fallback={<div className={"suspense_center"}>Loading...</div>}
            >
              <AuthenticatedRoute Component={Imputation} {...props} />
            </Suspense>
          )}
          // component={AuthGuard(Imputation)}
        />
        <Route
          path="/tools/annotation"
          render={(props) => (
            <Suspense
              fallback={<div className={"suspense_center"}>Loading...</div>}
            >
              {/*{AuthGuard(Annotation)}*/}
              <AuthenticatedRoute Component={Annotation} {...props} />
            </Suspense>
          )}
          // component={AuthGuard(Annotation)}
        />
        <Route
          path="/tools/bayes_finemap"
          exact
          render={(props) => (
            <Suspense
              fallback={<div className={"suspense_center"}>Loading...</div>}
            >
              <AuthenticatedRoute Component={Finemap} {...props} />
            </Suspense>
          )}
          // component={AuthGuard(Finemap)}
        />
        <Route
          path="/tools/bayes_paintor"
          exact
          render={(props) => (
            <Suspense
              fallback={<div className={"suspense_center"}>Loading...</div>}
            >
              <AuthenticatedRoute Component={Paintor} {...props} />
            </Suspense>
          )}
          // component={AuthGuard(Paintor)}
        />
        <Route
          path="/tools/bayes_susie"
          exact
          render={(props) => (
            <Suspense
              fallback={<div className={"suspense_center"}>Loading...</div>}
            >
              <AuthenticatedRoute Component={Susie} {...props} />
            </Suspense>
          )}
          // component={AuthGuard(Paintor)}
        />
        <Route
          path="/tools/deleteriousness"
          render={(props) => (
            <Suspense
              fallback={<div className={"suspense_center"}>Loading...</div>}
            >
              <AuthenticatedRoute Component={Deleteriousness} {...props} />
            </Suspense>
          )}
          // component={AuthGuard(Deleteriousness)}
        />
        <Route
          path="/tools/Regulation"
          exact
          render={(props) => (
            <Suspense
              fallback={<div className={"suspense_center"}>Loading...</div>}
            >
              <AuthenticatedRoute Component={Regulation} {...props} />
            </Suspense>
          )}
          // component={AuthGuard(Regulation)}
        />
        <Route
          path="/tools/liftover"
          // component={AuthGuard(Liftover)}
          render={(props) => (
            <Suspense
              fallback={<div className={"suspense_center"}>Loading...</div>}
            >
              <AuthenticatedRoute Component={Liftover} {...props} />
            </Suspense>
          )}
        />
        <Route
          path="/tools/ld_structure"
          // component={AuthGuard(LDStructure)}
          render={(props) => (
            <Suspense
              fallback={<div className={"suspense_center"}>Loading...</div>}
            >
              <AuthenticatedRoute Component={LDStructure} {...props} />
            </Suspense>
          )}
        />
        <Route
          path="/tools/eqtl"
          // component={AuthGuard(EQTL)}
          render={(props) => (
            <Suspense
              fallback={<div className={"suspense_center"}>Loading...</div>}
            >
              <AuthenticatedRoute Component={EQTL} {...props} />
            </Suspense>
          )}
        />
        <Route
          path="/tools/eqtlplot"
          // component={AuthGuard(EQTL)}
          render={(props) => (
            <Suspense
              fallback={<div className={"suspense_center"}>Loading...</div>}
            >
              <AuthenticatedRoute Component={EQTLPlot} {...props} />
            </Suspense>
          )}
        />
        <Route
          path="/tools/genebased"
          // component={AuthGuard(GeneBased)}
          render={(props) => (
            <Suspense
              fallback={<div className={"suspense_center"}>Loading...</div>}
            >
              <AuthenticatedRoute Component={GeneBased} {...props} />
            </Suspense>
          )}
        />
        <Route
          path="/tools/pathwaybased"
          // component={AuthGuard(PathwayBased)}
          render={(props) => (
            <Suspense
              fallback={<div className={"suspense_center"}>Loading...</div>}
            >
              <AuthenticatedRoute Component={PathwayBased} {...props} />
            </Suspense>
          )}
        />
        <Route path="/tools" exact component={ToolsHome} />
        <Route path="/dashboard" exact component={HomeComingSoon} />
        <Route
          path="/tutorials"
          exact
          // component={Tutorials}
          render={(props) => (
            <Suspense
              fallback={<div className={"suspense_center"}>Loading...</div>}
            >
              <Tutorials />
            </Suspense>
          )}
        />
        <Route path="/documentation" exact component={HomeComingSoon} />
        <Route path="/workflows" exact component={HomeComingSoon} />
        <Route path="/sign_in" exact component={SignIn} />
        <Route path="/sign_up" exact component={SignUp} />
        <Route path="/forgotpassword" exact component={ForgotPassword} />
        <Route path="/resetpassword/:token" exact component={ChangePassword} />
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
