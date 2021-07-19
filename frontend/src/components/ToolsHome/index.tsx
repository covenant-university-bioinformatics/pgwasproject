import React from "react";
import MainLayout from "../../layouts/MainLayout";
import { LabelImportant, LabelSharp } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const ToolsHome: React.FC<Props> = (props) => {
  const links = [
    { title: "Liftover", linkTo: "/liftover" },
    {
      title: "LD Structure",
      linkTo: "/ld_structure",
      icon: <LabelSharp />,
    },
    { title: "Imputation", linkTo: "/imputation" },
    {
      title: "SuSie",
      linkTo: "/bayes_finemap/susie",
    },
    {
      title: "FineMap",
      linkTo: "/bayes_finemap/finemap",
    },
    {
      title: "Paintor",
      linkTo: "/bayes_finemap/paintor",
      icon: <LabelImportant />,
    },
    { title: "Annotation", linkTo: "/annotation" },
    {
      title: "Deleteriousness",
      linkTo: "/deleteriousness",
      icon: <LabelSharp />,
    },
    { title: "Regulation", linkTo: "/regulation" },
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
    <MainLayout title={"Welcome"}>
      <div className={classes.main_container}>
        {/*<h1>Home Page for the tools</h1>*/}
        <Grid container spacing={3} className={classes.grid_container}>
          {constructTabs()}
        </Grid>
      </div>
    </MainLayout>
  );
};

export default ToolsHome;
