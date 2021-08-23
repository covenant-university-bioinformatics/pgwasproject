import React from "react";
import classes from "./index.module.scss";
import BoxImage from "../BoxImage";
import { Button } from "@material-ui/core";
type Props = {};

const Hero: React.FC<Props> = (props: Props) => {
  return (
    <div className={classes.Hero}>
      <div className={classes.Col2}>
        <p className={classes.main_header}>SysBiol PostGWAS</p>
        <p className={classes.sub_content}>
          Genome wide association study has been used extensively to uncover
          various polymorphism associated to different phenotypes. PostGWAS has
          come about to provide relevant biological meanings to these
          polymorphisms. This application provides the means to execute several
          types of postGWAS analysis in a simplified form.
        </p>
        <div className={classes.buttons}>
          <Button
            className={classes.tool_button}
            variant="contained"
            size="large"
            color="primary"
          >
            Run Tool
          </Button>
          <Button
            className={classes.workflow_button}
            variant="contained"
            size="large"
            color="secondary"
          >
            Run Workflow
          </Button>
        </div>
      </div>

      <div className={classes.Col1}>
        <BoxImage />
      </div>
    </div>
  );
};

export default Hero;
