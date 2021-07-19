import React, { PropsWithChildren } from "react";
import {
  BrowserRouter,
  Switch,
  RouteComponentProps,
  Link,
  Route,
} from "react-router-dom";
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
import Test from "./components/Test";
import Finemap from "./components/Finemap";
import Susie from "./components/Susie";
import Paintor from "./components/Paintor";

type Props = {};

const Routes: React.FC<Props> = (props) => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/dashboard" exact component={HomeComingSoon} />
        <Route path="/test" exact component={Test} />
        <Route path="/tutorials" exact component={HomeComingSoon} />
        <Route path="/sign_in" exact component={HomeComingSoon} />
        <Route path="/sign_up" exact component={HomeComingSoon} />
        <Route path="/imputation" exact component={Imputation} />
        <Route path="/annotation" component={Annotation} />
        <Route path="/bayes_finemap" component={Finemap} />
        <Route path="/bayes_susie" component={Susie} />
        <Route path="/bayes_paintor" component={Paintor} />
        <Route path="/deleteriousness" exact component={Deleteriousness} />
        <Route path="/Regulation" exact component={Regulation} />
        <Route path="/liftover" component={Liftover} />
        <Route path="/ld_structure" component={LDStructure} />
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
      <Footer />
    </BrowserRouter>
  );
};

export default Routes;
