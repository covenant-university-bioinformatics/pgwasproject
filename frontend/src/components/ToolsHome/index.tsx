import React from "react";
// import MainLayout from "../../layouts/MainLayout";
import { LabelImportant, LabelSharp } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import classes from "./index.module.scss";
import HomeLayout from "../../layouts/HomeLayout";

type Props = {};

const ToolsHome: React.FC<Props> = (props) => {
  const links = [
    { title: "Liftover", linkTo: "/tools/liftover" },
    {
      title: "LD Structure",
      linkTo: "/tools/ldstructure",
      icon: <LabelSharp />,
    },
    { title: "Imputation", linkTo: "/tools/imputation" },
    {
      title: "SuSie",
      linkTo: "/tools/bayes_susie",
    },
    {
      title: "FineMap",
      linkTo: "/tools/bayes_finemap",
    },
    {
      title: "Paintor",
      linkTo: "/tools/bayes_paintor",
      icon: <LabelImportant />,
    },
    { title: "Annotation", linkTo: "/tools/annotation" },
    {
      title: "Deleteriousness",
      linkTo: "/tools/deleteriousness",
      icon: <LabelSharp />,
    },
    { title: "EQTL", linkTo: "/tools/eqtl" },
    { title: "EQTL Plot", linkTo: "/tools/eqtlplot" },
    { title: "Gene-Based Analysis", linkTo: "/tools/genebased" },
    { title: "Pathway-Based Analysis", linkTo: "/tools/pathwaybased" },
    { title: "Regulation", linkTo: "/tools/regulation" },
  ];

  const constructTabs = () => {
    return links.map((link, i) => {
      return (
        <Grid
          className={classes.grid_element}
          key={`link${i}`}
          item
          xs={12}
          sm={4}
          md={3}
        >
          <Link to={link.linkTo}>
            <div className={classes.paper}>{link.title}</div>
          </Link>
        </Grid>
      );
    });
  };

  return (
    <HomeLayout>
      <div className={classes.home_container}>
        <h1 className={classes.main_header}>
          Available Individual postGWAS tools
        </h1>
        <span className={classes.line_bar}>&nbsp;</span>
        {/*<p>We provide the following individual postGWAS tools for analysis</p>*/}
        <div className={classes.main_container}>
          <Grid container spacing={3} className={classes.grid_container}>
            {constructTabs()}
          </Grid>
        </div>
      </div>
    </HomeLayout>
  );
};

export default ToolsHome;
