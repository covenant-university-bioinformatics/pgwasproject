import React from "react";
import ComingSoon from "../utility/ComingSoon";
import MainLayout from "../../layouts/MainLayout";

type Props = {};

const Finemap: React.FC<Props> = (props) => {
  return (
    <MainLayout title={"Bayesian Finemapping - FineMap"}>
      <div>
        <ComingSoon />
      </div>
    </MainLayout>
  );
};

export default Finemap;
