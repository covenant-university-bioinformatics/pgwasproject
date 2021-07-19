import React from "react";
import classes from "../LDStructure/index.module.scss";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import ToolsLayout from "../../layouts/ToolsLayout";
import AnnotationHome from "./Home";
import AnnotationForm from "./Form";

type Props = {};

const Annotation: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout title={"Annotation"} path={props.match.url}>
      <div className={classes.annotation}>
        <Switch>
          <Route exact path={props.match.url} component={AnnotationHome} />
          <Route path={props.match.url + "/form"} component={AnnotationForm} />
          <Route exact path={props.match.url + "/all_results"} />
          <Route exact path={props.match.url + "/result_view"} />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default Annotation;
