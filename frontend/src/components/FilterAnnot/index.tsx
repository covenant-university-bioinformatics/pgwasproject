import React from "react";
import classes from "./index.module.scss";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import FilterAnnotationHome from "./Home";
import FilterAnnotationForm from "./Form";
import ToolsLayout from "../../layouts/ToolsLayout";
import FilterAnnotationResultList from "./ResultList";
import FilterAnnotationResultView from "./ResultView";

type Props = {};

const FilterAnnotation: React.FC<Props & RouteComponentProps> = (props) => {
  return (
    <ToolsLayout
      title={"Functional Prediction of Variants"}
      path={props.match.url}
    >
      <div className={classes.filterannot}>
        <Switch>
          <Route exact path={props.match.url} component={FilterAnnotationHome} />
          <Route exact path={props.match.url + "/form"} component={FilterAnnotationForm} />
          <Route
            exact
            path={props.match.url + "/all_results"}
            component={FilterAnnotationResultList}
          />
          <Route
            exact
            path={props.match.url + "/result_view/:jobId"}
            component={FilterAnnotationResultView}
          />
        </Switch>
      </div>
    </ToolsLayout>
  );
};

export default FilterAnnotation;
