import React from "react";
import classes from "./index.module.scss";

type Props = {};

const HomeLayout: React.FC<Props> = (props) => {
  return <div className={classes.Home}>{props.children}</div>;
};

export default HomeLayout;
