import React from "react";
import ComingSoon from "../utility/ComingSoon";
import MainLayout from "../../layouts/MainLayout";

type Props = {};

const Coloc: React.FC<Props> = (props) => {
  return (
    <MainLayout title={"EQTL Colocalization"}>
      <div>
        <ComingSoon />
      </div>
    </MainLayout>
  );
};

export default Coloc;
