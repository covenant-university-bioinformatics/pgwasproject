import React, { useEffect, useState } from "react";
import useTable from "../../../../hooks/useTable";
import pgwasAxios from "../../../../axios-fetches";
import { EqtlResult } from "../index";
import {
  AppBar,
  Button,
  CircularProgress,
  Tab,
  TableBody,
  TableCell,
  TableRow,
  Tabs,
} from "@material-ui/core";
import TabPanel from "../../../Annotation/ResultView/TabPanel";
import { GetAppRounded } from "@material-ui/icons";

type Props = {
  eqtlRes: EqtlResult | undefined;
  apiPath: string;
  dataset: string;
  jobId: string;
  classes: any;
  tissueName?: string;
};

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TableTabs: React.FC<Props> = ({
  eqtlRes,
  apiPath,
  dataset,
  jobId,
  classes,
  tissueName,
}: Props) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const [SMRResults, setSMRResults] = useState<string[][]>([]);
  const [SMRHeader, setSMRHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingSMRResults, setLoadingSMRResults] = useState(false);

  const {
    TblContainer: SMRTblContainer,
    TblHead: SMRTblHead,
    TblPagination: SMRTblPagination,
    recordsAfterPaging: SMRRecordsAfterPaging,
  } = useTable(SMRResults, SMRHeader, [10, 15, 20], SMRResults.length);

  const [TransResults, setTransResults] = useState<string[][]>([]);
  const [TransHeader, setTransHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingTransResults, setLoadingTransResults] = useState(false);

  const {
    TblContainer: TransTblContainer,
    TblHead: TransTblHead,
    TblPagination: TransTblPagination,
    recordsAfterPaging: TransRecordsAfterPaging,
  } = useTable(TransResults, TransHeader, [10, 15, 20], TransResults.length);

  const [MultiResults, setMultiResults] = useState<string[][]>([]);
  const [MultiHeader, setMultiHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingMultiResults, setLoadingMultiResults] = useState(false);

  const {
    TblContainer: MultiTblContainer,
    TblHead: MultiTblHead,
    TblPagination: MultiTblPagination,
    recordsAfterPaging: MultiRecordsAfterPaging,
  } = useTable(MultiResults, MultiHeader, [10, 15, 20], MultiResults.length);

  const createComponentTableHeaders = (
    headers: string[],
    stateUpdateFunction: any
  ) => {
    const dcd = headers.map((ele, i) => {
      return {
        id: ele.toLowerCase(),
        label: ele,
        disableSorting: true,
      };
    });
    // dcd.unshift({ id: "123", label: "", disableSorting: true });
    stateUpdateFunction(dcd);
  };

  const createComponentTableBody = (
    allines: string[],
    stateUpdateFunction: any
  ) => {
    const ddd = allines
      .filter((line) => line !== "")
      .slice(1)
      .map((list_string: string) => {
        return list_string.split("\t");
      });
    stateUpdateFunction(ddd);
  };

  const showDownloadButton = (dataset: string) => {
    if (eqtlRes && eqtlRes.status === "completed") {
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
              href={"/results" + eqtlRes[`${dataset.toLowerCase()}SMRFile`]}
              target="_blank"
            >
              Download SMR Results
            </Button>
            {eqtlRes.eqtl_params.trans === "on" && (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<GetAppRounded />}
                href={"/results" + eqtlRes[`${dataset.toLowerCase()}TransFile`]}
                target="_blank"
              >
                Download Trans Results
              </Button>
            )}
            {eqtlRes.eqtl_params.smr_multi === "on" && (
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<GetAppRounded />}
                href={"/results" + eqtlRes[`${dataset.toLowerCase()}MultiFile`]}
                target="_blank"
              >
                Download Multi Results
              </Button>
            )}
          </div>
        </div>
      );
    }
    return false;
  };

  const createChartSection = (dataset: string) => {
    if (eqtlRes && eqtlRes.status === "completed") {
      const chartOne = (
        <div className={classes.image_tab}>
          <h3>Manhattan Plot</h3>
          <div className={classes.image_box}>
            <img
              src={
                "/results" + eqtlRes[`${dataset.toLowerCase()}SMRManhattanPlot`]
              }
              alt="Manhattan plot"
            />
          </div>
        </div>
      );

      const chartTwo = (
        <div className={classes.image_tab}>
          <h3>QQ plot</h3>
          <div className={classes.image_box}>
            <img
              src={"/results" + eqtlRes[`${dataset.toLowerCase()}SMRQQPlot`]}
              alt="QQ plot"
            />
          </div>
        </div>
      );

      return (
        <div className={classes.chart_section}>
          <h3 className={classes.sub_heading}>
            {tissueName ? tissueName : ""} {dataset} SMR Summary Statistics
            Overview
          </h3>
          <div className={classes.images}>
            {chartOne}
            {chartTwo}
          </div>
        </div>
      );
    }
    return false;
  };

  const createTableSection = (
    TblContainer: React.FC,
    TblHead: React.FC,
    TblPagination: any,
    recordsAfterPaging: () => any[],
    resultsObjLength: number
  ) => {
    if (eqtlRes && eqtlRes.status === "completed" && resultsObjLength > 0) {
      return (
        <div className={classes.table_section}>
          {/*<Paper className={mclasses.pageContent}>*/}
          <TblContainer>
            <TblHead />
            <TableBody>
              {recordsAfterPaging().map((item, index) => (
                <TableRow key={`row${index}`}>
                  {item.map((element: string, idx: number) => (
                    <TableCell key={`idx${idx}`}>
                      {element === "."
                        ? "NA"
                        : element.length > 30
                        ? `${element.substr(0, 31)} ...`
                        : element}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </TblContainer>
          <TblPagination />
          {/*</Paper>*/}
        </div>
      );
    }
    return (
      <p>No results for your data. Check if you used correct parameters.</p>
    );
  };

  const showTableTabs = (dataset: string) => {
    if (
      eqtlRes &&
      eqtlRes.status === "completed"
      // eqtlRes.eqtl_params[`${dataset}_eqtl`] === "true"
    ) {
      return (
        <div className={classes.tables}>
          <h3 className={classes.sub_heading}>
            {tissueName ? tissueName : ""} {dataset} Dataset Result Tables
          </h3>
          {showDownloadButton(dataset)}
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
                <Tab label="SMR" {...a11yProps(0)} />
                {eqtlRes.eqtl_params.trans === "on" && (
                  <Tab label="Trans" {...a11yProps(1)} />
                )}
                {eqtlRes.eqtl_params.smr_multi === "on" && (
                  <Tab label="Multi" {...a11yProps(1)} />
                )}
              </Tabs>
            </AppBar>
            <div className={classes.panels}>
              <TabPanel value={value} index={0}>
                {loadingSMRResults ? (
                  <CircularProgress />
                ) : (
                  createTableSection(
                    SMRTblContainer,
                    SMRTblHead,
                    SMRTblPagination,
                    SMRRecordsAfterPaging,
                    SMRResults.length
                  )
                )}
              </TabPanel>
              {eqtlRes.eqtl_params.trans === "on" && (
                <TabPanel value={value} index={1}>
                  {loadingTransResults ? (
                    <CircularProgress />
                  ) : (
                    createTableSection(
                      TransTblContainer,
                      TransTblHead,
                      TransTblPagination,
                      TransRecordsAfterPaging,
                      TransResults.length
                    )
                  )}
                </TabPanel>
              )}
              {eqtlRes.eqtl_params.smr_multi === "on" && (
                <TabPanel value={value} index={2}>
                  {loadingMultiResults ? (
                    <CircularProgress />
                  ) : (
                    createTableSection(
                      MultiTblContainer,
                      MultiTblHead,
                      MultiTblPagination,
                      MultiRecordsAfterPaging,
                      MultiResults.length
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

  useEffect(() => {
    if (eqtlRes && eqtlRes.status === "completed") {
      if (SMRResults.length === 0) {
        setLoadingSMRResults(true);
        pgwasAxios
          .get(
            `/${apiPath}/jobs/output/${jobId}/${dataset.toLowerCase()}SMRFile`
          )
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createComponentTableHeaders(header, setSMRHeader);
            createComponentTableBody(alllines, setSMRResults);
            setLoadingSMRResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingSMRResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [apiPath, eqtlRes, jobId]);

  useEffect(() => {
    if (
      eqtlRes &&
      eqtlRes.status === "completed" &&
      eqtlRes.eqtl_params.trans === "on"
    ) {
      if (TransResults.length === 0) {
        setLoadingTransResults(true);
        pgwasAxios
          .get(
            `/${apiPath}/jobs/output/${jobId}/${dataset.toLowerCase()}TransFile`
          )
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createComponentTableHeaders(header, setTransHeader);
            createComponentTableBody(alllines, setTransResults);
            setLoadingTransResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingTransResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [apiPath, eqtlRes, jobId]);

  useEffect(() => {
    if (
      eqtlRes &&
      eqtlRes.status === "completed" &&
      eqtlRes.eqtl_params.smr_multi === "on"
    ) {
      if (MultiResults.length === 0) {
        setLoadingMultiResults(true);
        pgwasAxios
          .get(
            `/${apiPath}/jobs/output/${jobId}/${dataset.toLowerCase()}MultiFile`
          )
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createComponentTableHeaders(header, setMultiHeader);
            createComponentTableBody(alllines, setMultiResults);
            setLoadingMultiResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingMultiResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [apiPath, eqtlRes, jobId]);

  return (
    <>
      {createChartSection(dataset)}
      {showTableTabs(dataset)}
    </>
  );
};

export default TableTabs;
