import React from "react";
import ComingSoon from "../utility/ComingSoon";
import MainLayout from "../../layouts/MainLayout";

type Props = {};

const Annotation: React.FC<Props> = (props) => {
  return (
    <MainLayout title={"Annotation"}>
      <div>
        <ComingSoon />
      </div>
    </MainLayout>
  );
};

export default Annotation;
