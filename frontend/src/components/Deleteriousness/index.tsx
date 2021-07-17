import React from "react";
import ComingSoon from "../utility/ComingSoon";
import MainLayout from "../../layouts/MainLayout";

type Props = {};

const Deleteriousness: React.FC<Props> = (props) => {
  return (
    <MainLayout title={"Gene Deleteriousness"}>
      <div>
        <ComingSoon />
      </div>
    </MainLayout>
  );
};

export default Deleteriousness;
