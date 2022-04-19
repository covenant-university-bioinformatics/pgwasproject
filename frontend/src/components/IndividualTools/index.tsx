import React from "react";
import regulationImage from "../../resources/images/regulation.webp";
import imputeImage from "../../resources/images/impute_table.webp";
import deletImage from "../../resources/images/delet.webp";
import classes from "./index.module.scss";
import { ArrowRightAlt } from "@material-ui/icons";
import { Link } from "react-router-dom";

type Props = {};

const IndividualTools: React.FC<Props> = (props: Props) => {
  return (
    <section className={classes.section_individual}>
      <div className={classes.container}>
        <div className={classes.center_text}>
          <h2>Executing Individual Tools</h2>
        </div>
        <div className={classes.tools_box}>
          <div className={classes.side_text}>
            <p>
              PostGWAS tools are sometimes complex to setup and most times
              require big omics data to perform its analysis. This can sometimes
              put great stress on researchers. In this application we have
              provided researchers, scientists, bio-informaticians ability to
              execute to several individual postGWAS tools. The interfaces are
              straight forward and easy to use.
            </p>
            <p>
              In this section, you will be able to perform an individual
              postGWAS analysis based on the different post GWAS tools we have
              provided.
            </p>

            <Link className={classes.analysis_link} to={"/tools"}>
              Click to start <ArrowRightAlt className={classes.icon} />
            </Link>
          </div>
          <div className={classes.side_images}>
            <div className={classes.composition}>
              <img
                src={imputeImage}
                alt="annotation"
                className={[
                  classes.composition__photo,
                  classes.composition__photo__p1,
                ].join(" ")}
              />
              <img
                src={regulationImage}
                alt="imputation"
                className={[
                  classes.composition__photo,
                  classes.composition__photo__p2,
                ].join(" ")}
              />
              <img
                src={deletImage}
                alt="deleteriousness"
                className={[
                  classes.composition__photo,
                  classes.composition__photo__p3,
                ].join(" ")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndividualTools;
