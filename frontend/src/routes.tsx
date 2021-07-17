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

type Props = {};

const Routes: React.FC<Props> = (props) => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/dashboard" exact component={HomeComingSoon} />
        <Route path="/tutorials" exact component={HomeComingSoon} />
        <Route path="/sign_in" exact component={HomeComingSoon} />
        <Route path="/sign_up" exact component={HomeComingSoon} />
        <Route path="/imputation" exact component={Imputation} />
        <Route path="/annotation" exact component={Annotation} />
        <Route path="/deleteriousness" exact component={Deleteriousness} />
        <Route path="/Regulation" exact component={Regulation} />
        <Route path="/liftover" exact component={Liftover} />
        <Route path="/ld_structure" component={LDStructure} />
        <Route path="/" exact component={ToolsHome} />
        <Route
          render={(
            props:
              | PropsWithChildren<RouteComponentProps<any>>
              | PropsWithChildren<any>
          ) => (
            <h1 style={{ padding: "10rem" }}>
              404 Not Found! <Link to={props.match.url}>Go Home </Link>
            </h1>
          )}
        />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
};

export default Routes;
