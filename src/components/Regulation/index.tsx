import React from "react";
import ComingSoon from "../utility/ComingSoon";
import MainLayout from "../../layouts/MainLayout";

type Props = {};

const Regulation: React.FC<Props> = (props) => {
  return (
    <MainLayout title={"Regulation"}>
      <div>
        <ComingSoon />
      </div>
    </MainLayout>
  );
};

export default Regulation;
