import React from "react";
import classes from "./index.module.scss";
import customImage from "../../resources/images/spgwas_custom_trans.webp";
import { ArrowRightAlt } from "@material-ui/icons";
import { Link } from "react-router-dom";

type Props = {};

const CombinedTools: React.FC<Props> = (props: Props) => {
  return (
    <section className={classes.section_combined}>
      <div className={classes.container}>
        <div className={classes.center_text}>
          <h2>Executing Workflow Analysis</h2>
        </div>
        <div className={classes.section}>
          <div className={classes.side_left}>
            <div className={classes.image_container}>
              <img src={customImage} alt="custom" className={classes.image} />
            </div>
          </div>
          <div className={classes.side_right}>
            <p>
              PostGWAS analysis helps to find the functional consequences of
              GWAS results. However there might be need to combine one ore more
              tools to arrive at acceptable results. This can also be based on
              the fact that GWAS SNPs are known to mostly fall on non-coding
              regions and there might be need to apply several techniques to
              arrive at useful results.
            </p>
            <p>
              In this section we provide access to a novel synergized workflow
              for postGWAS analysis. This workflow integrates several postGWAS
              techniques, tools and data sets to arrive at its results.
            </p>
            <Link className={classes.analysis_link} to={"/workflows"}>
              Click to start <ArrowRightAlt />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CombinedTools;
