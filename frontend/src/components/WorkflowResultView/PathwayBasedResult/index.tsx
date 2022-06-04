import React, { useEffect, useState } from "react";
import useTable from "../../../hooks/useTable";
import { CustomResult } from "../index";
import { AppBar, Button, CircularProgress, Tab, Tabs } from "@material-ui/core";
import TabPanel from "../../Annotation/ResultView/TabPanel";
import { createTableSection } from "../../utility/general";
import {
  createComponentTableBody,
  createComponentTableHeaders,
} from "../../utility/general_utils";
import pgwasAxios from "../../../axios-fetches";
import { GetAppRounded } from "@material-ui/icons";

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

const PathwayBasedResult: React.FC<Props> = ({
  customResult,
  apiPath,
  jobId,
  classes,
}) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const [geneScoreResults, setGeneScoreResults] = useState<string[][]>([]);
  const [geneScoreHeader, setGeneScoreHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingGeneScoreResults, setLoadingGeneScoreResults] = useState(false);

  const {
    TblContainer: GeneScoreTblContainer,
    TblHead: GeneScoreTblHead,
    TblPagination: GeneScoreTblPagination,
    recordsAfterPaging: GeneScoreRecordsAfterPaging,
  } = useTable(
    geneScoreResults,
    geneScoreHeader,
    [10, 15, 20],
    geneScoreResults.length
  );

  const [pathwayBasedResults, setPathwayBasedResults] = useState<string[][]>(
    []
  );
  const [pathwayBasedHeader, setPathwayBasedHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingPathwayBasedResults, setLoadingPathwayBasedResults] = useState(
    false
  );

  const {
    TblContainer: PathwayBasedTblContainer,
    TblHead: PathwayBasedTblHead,
    TblPagination: PathwayBasedTblPagination,
    recordsAfterPaging: PathwayBasedRecordsAfterPaging,
  } = useTable(
    pathwayBasedResults,
    pathwayBasedHeader,
    [10, 15, 20],
    pathwayBasedResults.length
  );

  const [fusionScoreResults, setFusionScoreResults] = useState<string[][]>([]);
  const [fusionScoreHeader, setFusionScoreHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingFusionScoreResults, setLoadingFusionScoreResults] = useState(
    false
  );

  const {
    TblContainer: FusionScoreTblContainer,
    TblHead: FusionScoreTblHead,
    TblPagination: FusionScoreTblPagination,
    recordsAfterPaging: FusionScoreRecordsAfterPaging,
  } = useTable(
    fusionScoreResults,
    fusionScoreHeader,
    [10, 15, 20],
    fusionScoreResults.length
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
              href={"/results" + customResult[`pascal_geneScoresFile`]}
              target="_blank"
            >
              Download Gene Score
            </Button>
            {customResult.spgwas_params.pascal_runpathway === "on" && (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<GetAppRounded />}
                href={"/results" + customResult[`pascal_pathwaySetFile`]}
                target="_blank"
              >
                Download Pathway file
              </Button>
            )}
            {customResult.spgwas_params.pascal_runpathway === "on" && (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<GetAppRounded />}
                href={"/results" + customResult[`pascal_fusionGenesFile`]}
                target="_blank"
              >
                Download Fusion Score
              </Button>
            )}
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
            Pathway Based Dataset Result Tables
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
                {customResult.spgwas_params.pascal_runpathway === "on" && (
                  <Tab label="Pathway" {...a11yProps(1)} />
                )}
                {customResult.spgwas_params.pascal_runpathway === "on" && (
                  <Tab label="Fusion" {...a11yProps(1)} />
                )}
              </Tabs>
            </AppBar>
            <div className={classes.panels}>
              <TabPanel value={value} index={0}>
                {loadingGeneScoreResults ? (
                  <CircularProgress />
                ) : (
                  createTableSection(
                    GeneScoreTblContainer,
                    GeneScoreTblHead,
                    GeneScoreTblPagination,
                    GeneScoreRecordsAfterPaging,
                    geneScoreResults.length,
                    customResult,
                    classes
                  )
                )}
              </TabPanel>
              {customResult.spgwas_params.pascal_runpathway === "on" && (
                <TabPanel value={value} index={1}>
                  {loadingPathwayBasedResults ? (
                    <CircularProgress />
                  ) : (
                    createTableSection(
                      PathwayBasedTblContainer,
                      PathwayBasedTblHead,
                      PathwayBasedTblPagination,
                      PathwayBasedRecordsAfterPaging,
                      pathwayBasedResults.length,
                      customResult,
                      classes
                    )
                  )}
                </TabPanel>
              )}
              {customResult.spgwas_params.pascal_runpathway === "on" && (
                <TabPanel value={value} index={2}>
                  {loadingFusionScoreResults ? (
                    <CircularProgress />
                  ) : (
                    createTableSection(
                      FusionScoreTblContainer,
                      FusionScoreTblHead,
                      FusionScoreTblPagination,
                      FusionScoreRecordsAfterPaging,
                      fusionScoreResults.length,
                      customResult,
                      classes
                    )
                  )}
                </TabPanel>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  //download gene score
  useEffect(() => {
    if (customResult && customResult.status === "completed") {
      if (geneScoreResults.length === 0) {
        setLoadingGeneScoreResults(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${jobId}/pascal_geneScoresFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createComponentTableHeaders(header, setGeneScoreHeader);
            createComponentTableBody(alllines, setGeneScoreResults);
            setLoadingGeneScoreResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingGeneScoreResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [apiPath, customResult, jobId]);

  //download pathway file
  useEffect(() => {
    if (
      customResult &&
      customResult.status === "completed" &&
      customResult.spgwas_params.pascal_runpathway === "on"
    ) {
      if (pathwayBasedResults.length === 0) {
        setLoadingPathwayBasedResults(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${jobId}/pascal_pathwaySetFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createComponentTableHeaders(header, setPathwayBasedHeader);
            createComponentTableBody(alllines, setPathwayBasedResults);
            setLoadingPathwayBasedResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingPathwayBasedResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [apiPath, customResult, jobId]);

  //download fusion file
  useEffect(() => {
    if (
      customResult &&
      customResult.status === "completed" &&
      customResult.spgwas_params.pascal_runpathway === "on"
    ) {
      if (fusionScoreResults.length === 0) {
        setLoadingFusionScoreResults(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${jobId}/pascal_fusionGenesFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createComponentTableHeaders(header, setFusionScoreHeader);
            createComponentTableBody(alllines, setFusionScoreResults);
            setLoadingFusionScoreResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingFusionScoreResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [apiPath, customResult, jobId]);

  return <div>{showTableTabs()}</div>;
};

export default PathwayBasedResult;
