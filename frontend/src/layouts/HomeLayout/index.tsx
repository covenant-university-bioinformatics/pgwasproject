import React from "react";
import classes from "./index.module.scss";

type Props = {
  // bgcolor: string;
};

const HomeLayout: React.FC<Props> = (props) => {
  return (
    <div className={classes.Home}>
      <div className={classes.container}>{props.children}</div>
    </div>
  );
};

export default HomeLayout;
