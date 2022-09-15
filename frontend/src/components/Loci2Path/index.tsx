import React from "react";
import classes from "./index.module.scss";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import Loci2PathHome from "./Home";
import Loci2PathForm from "./Form";
import ToolsLayout from "../../layouts/ToolsLayout";
import Loci2PathResultList from "./ResultList";
import Loci2PathResultView from "./ResultView";

type Props = {};

const Loci2Path: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout
      title={"EQTL Loci2Path"}
      path={props.match.url}
    >
      <div className={classes.loci2path}>
        <Switch>
          <Route exact path={props.match.url} component={Loci2PathHome} />
          <Route exact path={props.match.url + "/form"} component={Loci2PathForm} />
          <Route
            exact
            path={props.match.url + "/all_results"}
            component={Loci2PathResultList}
          />
          <Route
            exact
            path={props.match.url + "/result_view/:jobId"}
            component={Loci2PathResultView}
          />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default Loci2Path;
