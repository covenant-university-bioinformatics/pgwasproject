import React from "react";
import { Box, Container } from "@material-ui/core";

type Props = {
  index: any;
  value: any;
};

const TabPanel: React.FC<Props> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Container>
          <Box>{children}</Box>
        </Container>
      )}
    </div>
  );
};

export default TabPanel;
