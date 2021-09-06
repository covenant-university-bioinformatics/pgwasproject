import React from "react";
import ComingSoon from "../utility/ComingSoon";
import MainLayout from "../../layouts/MainLayout";

type Props = {};

const GeneBased: React.FC<Props> = (props) => {
  return (
    <MainLayout title={"Gene set analysis with Pascal"}>
      <div>
        <ComingSoon />
      </div>
    </MainLayout>
  );
};

export default GeneBased;
