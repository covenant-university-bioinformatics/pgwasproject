import React from "react";
import boxImage1 from "../../resources/images/banner_img1.webp";
import boxImage2 from "../../resources/images/metabolism.webp";
import boxImage3 from "../../resources/images/banner_img3.webp";
import classes from "./index.module.scss";
type Props = {};

const BoxImage: React.FC<Props> = (props: Props) => {
  return (
    <div className={classes.BoxImages}>
      <div className={[classes.Image, classes.ImageOne].join(" ")}>
        <img src={boxImage1} alt="" />
      </div>
      <div className={[classes.Image, classes.ImageTwo].join(" ")}>
        <img src={boxImage2} alt="" />
      </div>
      <div className={[classes.Image, classes.ImageThree].join(" ")}>
        <img src={boxImage3} alt="" />
      </div>
    </div>
  );
};

export default BoxImage;
