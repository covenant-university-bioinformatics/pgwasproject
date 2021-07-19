import React from "react";
import ComingSoon from "../utility/ComingSoon";
import MainLayout from "../../layouts/MainLayout";

type Props = {};

const Susie: React.FC<Props> = (props) => {
  return (
    <MainLayout title={"Bayesian Finemapping - SuSie"}>
      <div>
        <ComingSoon />
      </div>
    </MainLayout>
  );
};

export default Susie;
