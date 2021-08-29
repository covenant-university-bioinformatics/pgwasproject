import React from "react";
import ComingSoon from "../utility/ComingSoon";
import MainLayout from "../../layouts/MainLayout";

type Props = {};

const Imputation: React.FC<Props> = (props) => {
  return (
    <MainLayout title={"Imputation from Summary Statistics"}>
      <div>
        <ComingSoon />
      </div>
    </MainLayout>
  );
};

export default Imputation;
