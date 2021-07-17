import React from "react";
import ComingSoon from "../utility/ComingSoon";
import MainLayout from "../../layouts/MainLayout";

type Props = {};

const Index: React.FC<Props> = (props) => {
  return (
    <MainLayout title={"Liftover"}>
      <div>
        <ComingSoon />
      </div>
    </MainLayout>
  );
};

export default Index;
