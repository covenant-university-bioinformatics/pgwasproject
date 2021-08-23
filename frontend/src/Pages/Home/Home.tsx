import React from "react";
import Hero from "../../components/Hero";
import classes from "./index.module.scss";
import MainArea from "../../components/MainArea";

type Props = {};

const Home: React.FC<Props> = (props: Props) => {
  return (
    <div className={classes.Home}>
      <Hero />
      <MainArea />
    </div>
  );
};

export default Home;
