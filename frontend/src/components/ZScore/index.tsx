import React from "react";
import ComingSoon from "../utility/ComingSoon";
import MainLayout from "../../layouts/MainLayout";

type Props = {};

const ZScore: React.FC<Props> = (props) => {
  return (
    <MainLayout title={"ZScore"}>
      <div>
        <ComingSoon />
      </div>
    </MainLayout>
  );
};

export default ZScore;
