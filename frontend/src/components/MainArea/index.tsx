import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as TClass } from "../../resources/images/individual_1.svg";
import { ReactComponent as Combined } from "../../resources/images/workflow_1.svg";
import { ReactComponent as Pipeline } from "../../resources/images/custom_1.svg";
import classes from "./index.module.scss";
type Props = {};

const MainArea: React.FC<Props> = (props: Props) => {
  return (
    <div className={classes.MainArea}>
      <h3>The following types of analysis are provided</h3>
      <span>&nbsp;</span>
      <div className={classes.AnalysisGroup}>
        <div className={classes.AnalysisBox}>
          <div className={classes.AnalysisLeft}>
            <TClass className={classes.SVGIcon} />
          </div>
          <div className={classes.AnalysisRight}>
            <p className={classes.analysis_header}>Execute Individual Tools</p>
            <p className={classes.analysis_content}>
              In this analysis section, you will be able to perform an
              individual pGWAS analysis based on the different post GWAS tools
              we have provided.
            </p>
            <Link className={classes.analysis_link} to={"/tools"}>
              Click to start
            </Link>
          </div>
        </div>
        <div className={classes.AnalysisBox}>
          <div className={classes.AnalysisLeft}>
            <Combined className={classes.SVGIcon} />
          </div>
          <div className={classes.AnalysisRight}>
            <p className={classes.analysis_header}>
              Execute a Workflow Analysis
            </p>
            <p className={classes.analysis_content}>
              In this analysis, you can utilize our synergized workflow that
              targets mainstream pGWAS challenges. You will be able to execute
              pGWAS analysis with combination of various pGWAS analysis in a
              single run.
            </p>
            <Link className={classes.analysis_link} to={"/workflows"}>
              Click to start
            </Link>
          </div>
        </div>
        <div className={classes.AnalysisBox}>
          <div className={classes.AnalysisLeft}>
            <Pipeline className={classes.SVGIcon} />
          </div>
          <div className={classes.AnalysisRight}>
            <p className={classes.analysis_header}>Build Custom Pipeline</p>
            <p className={classes.analysis_content}>
              In this analysis step, you will be able to build your own custom
              workflow using the different combination of tools as different
              steps in the previous analysis into a full pipeline.
            </p>
            <Link className={classes.analysis_link} to={"/"}>
              Coming soon
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainArea;
