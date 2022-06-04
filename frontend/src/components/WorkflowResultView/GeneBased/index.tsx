import React, { useEffect, useState } from "react";
import { CustomResult } from "../index";
import useTable from "../../../hooks/useTable";
import { AppBar, Button, CircularProgress, Tab, Tabs } from "@material-ui/core";
import { GetAppRounded } from "@material-ui/icons";
import TabPanel from "../../Annotation/ResultView/TabPanel";
import { createTableSection } from "../../utility/general";
import {
  createComponentTableBody,
  createComponentTableHeaders,
} from "../../utility/general_utils";
import pgwasAxios from "../../../axios-fetches";

type Props = {
  customResult: CustomResult | undefined;
  apiPath: string;
  jobId: string;
  classes: any;
};

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const GeneBasedResult: React.FC<Props> = ({
  customResult,
  apiPath,
  jobId,
  classes,
}) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const [geneBasedResults, setGeneBasedResults] = useState<string[][]>([]);
  const [geneBasedHeader, setGeneBasedHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingGeneBasedResults, setLoadingGeneBasedResults] = useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    geneBasedResults,
    geneBasedHeader,
    [10, 15, 20],
    geneBasedResults.length
  );

  const [tissueBasedResults, setTissueBasedResults] = useState<string[][]>([]);
  const [tissueBasedHeader, setTissueBasedHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingTissueBasedResults, setLoadingTissueBasedResults] = useState(
    false
  );

  const {
    TblContainer: tissueTblContainer,
    TblHead: tissueTblHead,
    TblPagination: tissueTblPagination,
    recordsAfterPaging: tissueRecordsAfterPaging,
  } = useTable(
    tissueBasedResults,
    tissueBasedHeader,
    [10, 15, 20],
    tissueBasedResults.length
  );

  const showDownloadButton = () => {
    if (customResult && customResult.status === "completed") {
      return (
        <div className={classes.download}>
          <p>
            The table below may have been chunked and pruned to allow for proper
            display. Use the buttons below to download the full files.
          </p>

          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              endIcon={<GetAppRounded />}
              href={"/results" + customResult[`emagma_genes_out`]}
              target="_blank"
            >
              Download Gene Score
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              endIcon={<GetAppRounded />}
              href={"/results" + customResult[`emagma_tissue_genes_out`]}
              target="_blank"
            >
              Download Tissue Score
            </Button>
          </div>
        </div>
      );
    }
    return false;
  };

  const showTableTabs = () => {
    if (customResult && customResult.status === "completed") {
      return (
        <div className={classes.tables}>
          <h3 className={classes.sub_heading}>
            Gene Based Dataset Result Tables
          </h3>
          {showDownloadButton()}
          <div className={classes.table_wrapper}>
            <AppBar
              className={classes.tabs_header}
              color="default"
              position="static"
            >
              <Tabs
                value={value}
                onChange={handleChange}
                // variant="scrollable"
                aria-label="simple tabs example"
              >
                <Tab label="GeneScore" {...a11yProps(0)} />
                <Tab label="Tissue GeneScore" {...a11yProps(1)} />
              </Tabs>
            </AppBar>
            <div className={classes.panels}>
              <TabPanel value={value} index={0}>
                {loadingGeneBasedResults ? (
                  <CircularProgress />
                ) : (
                  createTableSection(
                    TblContainer,
                    TblHead,
                    TblPagination,
                    recordsAfterPaging,
                    geneBasedResults.length,
                    customResult,
                    classes
                  )
                )}
              </TabPanel>
              <TabPanel value={value} index={1}>
                {loadingTissueBasedResults ? (
                  <CircularProgress />
                ) : (
                  createTableSection(
                    tissueTblContainer,
                    tissueTblHead,
                    tissueTblPagination,
                    tissueRecordsAfterPaging,
                    tissueBasedResults.length,
                    customResult,
                    classes
                  )
                )}
              </TabPanel>
            </div>
          </div>
        </div>
      );
    }
  };

  //download gene based file
  useEffect(() => {
    if (customResult && customResult.status === "completed") {
      if (geneBasedResults.length === 0) {
        setLoadingGeneBasedResults(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${jobId}/emagma_genes_out`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createComponentTableHeaders(header, setGeneBasedHeader);
            createComponentTableBody(alllines, setGeneBasedResults);
            setLoadingGeneBasedResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingGeneBasedResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [customResult, jobId]);

  //download tissue based file
  useEffect(() => {
    if (
      customResult &&
      customResult.status === "completed"
      // customResult.spgwas_params.emagma_tissue_genes_out
    ) {
      if (tissueBasedResults.length === 0) {
        setLoadingTissueBasedResults(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${jobId}/emagma_tissue_genes_out`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createComponentTableHeaders(header, setTissueBasedHeader);
            createComponentTableBody(alllines, setTissueBasedResults);
            setLoadingTissueBasedResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingTissueBasedResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [customResult, jobId]);

  return <div>{showTableTabs()}</div>;
};

export default GeneBasedResult;
