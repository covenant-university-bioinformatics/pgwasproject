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
import MainLayout from "./layouts/MainLayout";
// import Workflows from "./Pages/Workflows";

//Lazy imports
const Annotation = React.lazy(() => import("./components/Annotation"));
const Imputation = React.lazy(() => import("./components/Imputation"));
// const Finemap = React.lazy(() => import("./components/Finemap"));
const LDStructure = React.lazy(() => import("./components/LDStructure"));
const Deleteriousness = React.lazy(
  () => import("./components/Deleteriousness")
);
const RegHaploR = React.lazy(() => import("./components/Regulation"));
const Liftover = React.lazy(() => import("./components/Liftover"));
const Focus = React.lazy(() => import("./components/Focus"));
const Divan = React.lazy(() => import("./components/Divan"));
const Coloc = React.lazy(() => import("./components/EQTLColoc"));
const ZScore = React.lazy(() => import("./components/ZScore"));
const EQTL = React.lazy(() => import("./components/EQTL"));
const EQTLPlot = React.lazy(() => import("./components/EQTLPlot"));
const PathwayBased = React.lazy(() => import("./components/PathwayBased"));
const GeneBased = React.lazy(() => import("./components/GeneBased"));
const Tutorials = React.lazy(() => import("./components/Tutorials"));
const CombinedTutorials = React.lazy(
  () => import("./components/CombinedTutorials")
);
const Workflows = React.lazy(() => import("./Pages/Workflows"));

type Props = {};

const Routes: React.FC<Props> = (props) => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
          <Route
              path="/tools/imputation"
              render={(props) => (
                  <Suspense
                      fallback={
                          <MainLayout title={"Imputation from Summary Statistics"}>
                              <div className={"suspense_center"}>Loading...</div>
                          </MainLayout>
                      }
                  >
                      <AuthenticatedRoute Component={Imputation} {...props} />
                  </Suspense>
              )}
              // component={AuthGuard(Imputation)}
          />
        <Route
          path="/tools/divan"
          render={(props) => (
            <Suspense
              fallback={
                <MainLayout title={"DIVAN (Disease-specific Variant ANnotation)"}>
                  <div className={"suspense_center"}>Loading...</div>
                </MainLayout>
              }
            >
              <AuthenticatedRoute Component={Divan} {...props} />
            </Suspense>
          )}
          // component={AuthGuard(Imputation)}
        />
        <Route
          path="/tools/annotation"
          render={(props) => (
            <Suspense
              fallback={
                <MainLayout title={"Annotation"}>
                  <div className={"suspense_center"}>Loading...</div>
                </MainLayout>
              }
            >
              {/*{AuthGuard(Annotation)}*/}
              <AuthenticatedRoute Component={Annotation} {...props} />
            </Suspense>
          )}
          // component={AuthGuard(Annotation)}
        />
        <Route
          path="/tools/focus_fmap"
          render={(props) => (
            <Suspense
              fallback={
                <MainLayout title={"Probabilistic FineMapping (FOCUS)"}>
                  <div className={"suspense_center"}>Loading...</div>
                </MainLayout>
              }
            >
              <AuthenticatedRoute Component={Focus} {...props} />
            </Suspense>
          )}
          // component={AuthGuard(Finemap)}
        />
        <Route
          path="/tools/zscore"
          render={(props) => (
            <Suspense
              fallback={
                <MainLayout title={"ZScore Analysis"}>
                  <div className={"suspense_center"}>Loading...</div>
                </MainLayout>
              }
            >
              <AuthenticatedRoute Component={ZScore} {...props} />
            </Suspense>
          )}
        />
        <Route
          path="/tools/eqtlcoloc"
          render={(props) => (
            <Suspense
              fallback={
                <MainLayout title={"EQTL - Colocalization"}>
                  <div className={"suspense_center"}>Loading...</div>
                </MainLayout>
              }
            >
              <AuthenticatedRoute Component={Coloc} {...props} />
            </Suspense>
          )}
        />
        <Route
          path="/tools/deleteriousness"
          render={(props) => (
            <Suspense
              fallback={
                <MainLayout title={"Deleteriousness"}>
                  <div className={"suspense_center"}>Loading...</div>
                </MainLayout>
              }
            >
              <AuthenticatedRoute Component={Deleteriousness} {...props} />
            </Suspense>
          )}
          // component={AuthGuard(Deleteriousness)}
        />
        <Route
          path="/tools/regulationhaplor"
          render={(props) => (
            <Suspense
              fallback={
                <MainLayout title={"Regulation (HaploR)"}>
                  <div className={"suspense_center"}>Loading...</div>
                </MainLayout>
              }
            >
              <AuthenticatedRoute Component={RegHaploR} {...props} />
            </Suspense>
          )}
          // component={AuthGuard(Regulation)}
        />
        <Route
          path="/tools/liftover"
          // component={AuthGuard(Liftover)}
          render={(props) => (
            <Suspense
              fallback={
                <MainLayout title={"Liftover"}>
                  <div className={"suspense_center"}>Loading...</div>
                </MainLayout>
              }
            >
              <AuthenticatedRoute Component={Liftover} {...props} />
            </Suspense>
          )}
        />
        <Route
          path="/tools/ldstructure"
          // component={AuthGuard(LDStructure)}
          render={(props) => (
            <Suspense
              fallback={
                <MainLayout title={"LD Structure"}>
                  <div className={"suspense_center"}>Loading...</div>
                </MainLayout>
              }
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
              fallback={
                <MainLayout title={"EQTL - SMR/HEIDI"}>
                  <div className={"suspense_center"}>Loading...</div>
                </MainLayout>
              }
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
              fallback={
                <MainLayout title={"EQTL SMR/Heidi Plots"}>
                  <div className={"suspense_center"}>Loading...</div>
                </MainLayout>
              }
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
              fallback={
                <MainLayout title={"Gene Based Analysis"}>
                  <div className={"suspense_center"}>Loading...</div>
                </MainLayout>
              }
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
              fallback={
                <MainLayout title={"Pathway Based Analysis"}>
                  <div className={"suspense_center"}>Loading...</div>
                </MainLayout>
              }
            >
              <AuthenticatedRoute Component={PathwayBased} {...props} />
            </Suspense>
          )}
        />
        <Route path="/tools" exact component={ToolsHome} />

        <Route path="/dashboard" exact component={HomeComingSoon} />
        <Route
          path="/individual-based-tutorials"
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
        <Route
          path="/combined-based-tutorials"
          exact
          // component={Tutorials}
          render={(props) => (
            <Suspense
              fallback={<div className={"suspense_center"}>Loading...</div>}
            >
              <CombinedTutorials />
            </Suspense>
          )}
        />
        <Route path="/documentation" exact component={HomeComingSoon} />
        <Route
          path="/workflows"
          // component={AuthGuard(PathwayBased)}
          render={(props) => (
            <Suspense
              fallback={<div className={"suspense_center"}>Loading...</div>}
            >
              <AuthenticatedRoute Component={Workflows} {...props} />
            </Suspense>
          )}
        />
        {/*<Route path="/workflows" component={Workflows} />*/}
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
                color: "#fff",
                fontSize: "2.5rem",
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
