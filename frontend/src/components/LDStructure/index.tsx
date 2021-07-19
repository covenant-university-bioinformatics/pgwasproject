import React from "react";
import classes from "./index.module.scss";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import LDStructureHome from "./Home";
import LdStructureForm from "./Form";
import ToolsLayout from "../../layouts/ToolsLayout";

type Props = {};

const LDStructure: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout title={"LD Structure"} path={props.match.url}>
      <div className={classes.ldstructure}>
        <Switch>
          <Route exact path={props.match.url} component={LDStructureHome} />
          <Route path={props.match.url + "/form"} component={LdStructureForm} />
          <Route exact path={props.match.url + "/all_results"} />
          <Route exact path={props.match.url + "/result_view"} />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default LDStructure;
