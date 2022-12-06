import React from "react";
// import MainLayout from "../../layouts/MainLayout";
import { LabelSharp } from "@material-ui/icons";
import { Link } from "react-router-dom";
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
    { title: "ZScore", linkTo: "/tools/zscore" },
    {
      title: "Probabilistic FineMapping",
      linkTo: "/tools/focus_fmap",
    },
    {
      title: "DIVAN",
      linkTo: "/tools/divan",
    },
    {
      title: "TSEA DB",
      linkTo: "/tools/tseadb",
    },
    {
      title: "Annotation(CADD)",
      linkTo: "/tools/ensemblvep",
    },
    {
      title: "Functional Prediction (GWAVA)",
      linkTo: "/tools/filterannot",
    },
    {
      title: "EQTL(Loci2Path)",
      linkTo: "/tools/loci2path",
    },
    { title: "Annotation (ANNOVAR)", linkTo: "/tools/annotation" },
    {
      title: "Deleteriousness",
      linkTo: "/tools/deleteriousness",
      icon: <LabelSharp />,
    },
    { title: "EQTL-SMR/HEIDI", linkTo: "/tools/eqtl" },
    { title: "EQTL Plot-SMR/HEIDI", linkTo: "/tools/eqtlplot" },
    { title: "EQTL-Colocalization", linkTo: "/tools/eqtlcoloc" },
    { title: "Gene-Based Analysis", linkTo: "/tools/genebased" },
    { title: "Pathway-Based Analysis", linkTo: "/tools/pathwaybased" },
    { title: "Regulation", linkTo: "/tools/regulationhaplor" },
  ];

  const constructTabs = () => {
    return links.map((link, i) => {
      return (
        // <div className={classes.tab}>
        <Link key={i} className={classes.tab} to={link.linkTo}>
          {link.title}
          {/*<div className={classes.paper}></div>*/}
        </Link>
        // </div>
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
          <div className={classes.grid_container}>{constructTabs()}</div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default ToolsHome;
