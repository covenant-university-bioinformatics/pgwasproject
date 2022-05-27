import React from "react";
import classes from "./index.module.scss";
type Props = {
  closeDrawer: () => void;
  mobileOpen: boolean;
};

const Backdrop: React.FC<Props> = (props: Props) => {
  const { closeDrawer, mobileOpen } = props;
  const back_classes = [classes.backdrop];
  if (mobileOpen) {
    back_classes.push(classes.backdrop_open);
  }
  return <div className={back_classes.join(" ")} onClick={closeDrawer} />;
};

export default Backdrop;
