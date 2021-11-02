import React from "react";
import classes from "./index.module.scss";
import BoxImage from "../BoxImage";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
type Props = {};

const Hero: React.FC<Props> = (props: Props) => {
  return (
    <div className={classes.Hero}>
      <div className={classes.container}>
        <div className={classes.Col1}>
          <p className={classes.main_header}>SysBiol PostGWAS</p>
          <p className={classes.sub_content}>
            Genome wide association study has been used extensively to uncover
            various polymorphism associated to different phenotypes. PostGWAS
            has come about to provide relevant biological meanings to these
            polymorphisms. This application provides the means to execute
            several types of postGWAS analysis in a simplified form.
          </p>
          <div className={classes.buttons}>
            <Button
              className={classes.tool_button}
              variant="outlined"
              size="medium"
              color="primary"
            >
              <Link className={classes.link} to={"/tools"}>
                Run Tool
              </Link>
            </Button>
            <Button
              className={classes.workflow_button}
              variant="contained"
              size="medium"
              color="secondary"
            >
              <Link className={classes.link} to={"/workflows"}>
                Run Workflow
              </Link>
            </Button>
          </div>
        </div>

        <div className={classes.Col2}>
          <BoxImage />
        </div>
      </div>
    </div>
  );
};

export default Hero;
