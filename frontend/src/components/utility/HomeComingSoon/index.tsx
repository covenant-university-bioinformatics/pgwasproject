import React from "react";
import HomeLayout from "../../../layouts/HomeLayout";
import ComingSoon from "../ComingSoon";

type Props = {};

const HomeComingSoon: React.FC<Props> = (props) => {
  return (
    <HomeLayout>
      <ComingSoon />
    </HomeLayout>
  );
};

export default HomeComingSoon;
