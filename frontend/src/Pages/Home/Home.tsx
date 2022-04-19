import React from "react";
import Hero from "../../components/Hero";
import classes from "./index.module.scss";
// import MainArea from "../../components/MainArea";
import IndividualTools from "../../components/IndividualTools";
import CombinedTools from "../../components/CombinedTools";
type Props = {};

const Home: React.FC<Props> = (props: Props) => {
  return (
    <div className={classes.Home}>
      <Hero />
      {/*<MainArea />*/}
      <IndividualTools />
      <CombinedTools />
    </div>
  );
};

export default Home;
