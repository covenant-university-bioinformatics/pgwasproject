import React from "react";
import MainLayout from "../../layouts/MainLayout";

type Props = {};

const ToolsHome: React.FC<Props> = (props) => {
  return (
    <MainLayout title={"Welcome"}>
      <div>
        <h1>Home Page for the tools</h1>
      </div>
    </MainLayout>
  );
};

export default ToolsHome;
