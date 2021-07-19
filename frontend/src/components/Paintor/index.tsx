import React from "react";
import ComingSoon from "../utility/ComingSoon";
import MainLayout from "../../layouts/MainLayout";

type Props = {};

const Paintor: React.FC<Props> = (props) => {
  return (
    <MainLayout title={"Bayesian Finemapping - Paintor"}>
      <div>
        <ComingSoon />
      </div>
    </MainLayout>
  );
};

export default Paintor;
