import React, { useEffect, useState } from "react";
import { CustomResult } from "../index";
import useTable from "../../../hooks/useTable";
import mainClasses from "../../Annotation/ResultView/index.module.scss";
import Paper from "@material-ui/core/Paper";
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
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { GetAppRounded } from "@material-ui/icons";
import TabPanel from "../../Annotation/ResultView/TabPanel";
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
    pageContent: {
      // margin: theme.spacing(1),
      // padding: theme.spacing(1),
    },
  })
);

const AnnotResult: React.FC<Props> = ({
  customResult,
  apiPath,
  jobId,
  classes,
}) => {
  const mclasses = useStyles();
  const initialCols = 12;

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const [snpAnnotResult, setSnpAnnotResult] = useState<string[][]>([]);
  const [snpAnnotHeader, setSnpAnnotHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingAnnot, setLoadingAnnot] = useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    snpAnnotResult,
    snpAnnotHeader,
    [10, 15, 20],
    snpAnnotResult.length
  );

  const [snpDisgenetResult, setSnpDisgenetResult] = useState<string[][]>([]);
  const [snpDisgenetHeader, setSnpDisgenetHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingDisgenet, setLoadingDisgenet] = useState(false);

  const {
    TblContainer: TblContainerDisgenet,
    TblHead: TblHeadDisgenet,
    TblPagination: TblPaginationDisgenet,
    recordsAfterPaging: recordsAfterPagingDisgenet,
  } = useTable(
    snpDisgenetResult,
    snpDisgenetHeader,
    [10, 15, 20],
    snpDisgenetResult.length
  );

  const [snpExacFreqResult, setSnpExacFreqResult] = useState<string[][]>([]);
  const [snpExacFreqHeader, setSnpExacFreqHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);

  const {
    TblContainer: TblContainerExacFreq,
    TblHead: TblHeadExacFreq,
    TblPagination: TblPaginationExacFreq,
    recordsAfterPaging: recordsAfterPagingExacFreq,
  } = useTable(
    snpExacFreqResult,
    snpExacFreqHeader,
    [10, 15, 20],
    snpExacFreqResult.length
  );

  const [snpClinvarResult, setSnpClinvarResult] = useState<string[][]>([]);
  const [snpClinvarHeader, setSnpClinvarHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);

  const {
    TblContainer: TblContainerClinvar,
    TblHead: TblHeadClinvar,
    TblPagination: TblPaginationClinvar,
    recordsAfterPaging: recordsAfterPagingClinvar,
  } = useTable(
    snpClinvarResult,
    snpClinvarHeader,
    [10, 15, 20],
    snpClinvarResult.length
  );

  const [snpPopFreqResult, setSnpPopFreqResult] = useState<string[][]>([]);
  const [snpPopFreqHeader, setSnpPopFreqHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);

  const {
    TblContainer: TblContainerPopFreq,
    TblHead: TblHeadPopFreq,
    TblPagination: TblPaginationPopFreq,
    recordsAfterPaging: recordsAfterPagingPopFreq,
  } = useTable(
    snpPopFreqResult,
    snpPopFreqHeader,
    [10, 15, 20],
    snpPopFreqResult.length
  );

  const createHeaders = (headers: string[]) => {
    const annotHead = headers.slice(0, 8);
    annotHead.push(headers[11]);
    annotHead.push(headers[headers.length - 1]);
    const dcd = annotHead.map((ele, i) => {
      return {
        id: ele.toLowerCase(),
        label: ele,
        disableSorting: true,
      };
    });
    setSnpAnnotHeader(dcd);
  };

  const getCols = () => {
    let columns = 0;
    if (customResult && customResult.status === "completed") {
      const { spgwas_params } = customResult;

      if (spgwas_params.annot_all === "true") {
        columns += 1;
      }
      if (spgwas_params.annot_afr === "true") {
        columns += 1;
      }
      if (spgwas_params.annot_sas === "true") {
        columns += 1;
      }
      if (spgwas_params.annot_eur === "true") {
        columns += 1;
      }
      if (spgwas_params.annot_eas === "true") {
        columns += 1;
      }
      if (spgwas_params.annot_amr === "true") {
        columns += 1;
      }
    }
    return columns;
  };

  const getExacCols = () => {
    let columns = 0;
    if (customResult && customResult.status === "completed") {
      const { spgwas_params } = customResult;
      if (spgwas_params.annot_exac === "true") {
        columns += 8;
      }
    }
    return columns;
  };

  const createHeadersPopFreq = (headers: string[]) => {
    const columns = getCols();
    if (columns !== 0) {
      const annotHead = headers.slice(initialCols, columns + initialCols);
      annotHead.push(headers[headers.length - 1]);
      const dcd = annotHead.map((ele, i) => {
        return {
          id: ele.toLowerCase(),
          label: ele,
          disableSorting: true,
        };
      });
      setSnpPopFreqHeader(dcd);
    }
  };

  const createHeadersExacFreq = (headers: string[]) => {
    const columns = getExacCols();
    const popCols = getCols() + initialCols;

    if (columns !== 0) {
      const annotHead = headers.slice(popCols, columns + popCols);
      annotHead.push(headers[headers.length - 1]);
      const dcd = annotHead.map((ele, i) => {
        return {
          id: ele.toLowerCase(),
          label: ele,
          disableSorting: true,
        };
      });
      setSnpExacFreqHeader(dcd);
    }
  };

  const createHeadersClinvars = (headers: string[]) => {
    const columns = getCols() + getExacCols() + initialCols;
    let clinvars = 0;

    if (customResult && customResult.status === "completed") {
      if (customResult.spgwas_params.annot_clinvar === "true") {
        clinvars = clinvars + 5;
      }
    }

    if (clinvars !== 0) {
      const annotHead = headers.slice(columns, clinvars + columns);
      annotHead.push(headers[headers.length - 1]);
      const dcd = annotHead.map((ele, i) => {
        return {
          id: ele.toLowerCase(),
          label: ele,
          disableSorting: true,
        };
      });
      setSnpClinvarHeader(dcd);
    }
  };

  const createHeadersDisgenet = (headers: string[]) => {
    const dcd = headers.map((ele, i) => {
      return {
        id: ele.toLowerCase(),
        label: ele,
        disableSorting: true,
      };
    });
    setSnpDisgenetHeader(dcd);
  };

  const createTableBody = (allines: string[]) => {
    const ddd = allines.slice(1).map((list_string: string) => {
      const list = list_string.split("\t");
      const temp = list.slice(0, 8);
      temp.push(list[11]);
      temp.push(list[list.length - 1]);
      return temp;
    });
    setSnpAnnotResult(ddd);
  };

  const createTableBodyPopFreq = (allines: string[]) => {
    const columns = getCols();
    if (columns !== 0) {
      const popfreqs: string[][] = [];
      allines.slice(1).forEach((list_string: string) => {
        const list = list_string.split("\t");
        const temp = list.slice(initialCols, columns + initialCols);
        if (temp.some((str) => str !== ".")) {
          temp.push(list[list.length - 1]);
          popfreqs.push(temp);
        }
      });
      setSnpPopFreqResult(popfreqs);
    }
  };

  const createTableBodyExacFreq = (allines: string[]) => {
    const columns = getExacCols();
    const popCols = getCols() + initialCols;

    if (columns !== 0) {
      const exacfreqs: string[][] = [];
      allines.slice(1).forEach((list_string: string) => {
        const list = list_string.split("\t");
        const temp = list.slice(popCols, columns + popCols);
        if (temp.some((str) => str !== ".")) {
          temp.push(list[list.length - 1]);
          exacfreqs.push(temp);
        }
      });
      setSnpExacFreqResult(exacfreqs);
    }
  };

  const createTableBodyClinvars = (allines: string[]) => {
    const clinvars: string[][] = [];
    const columns = getCols() + getExacCols() + initialCols;
    let clinvar_cols = 0;

    if (customResult && customResult.status === "completed") {
      if (customResult.spgwas_params.annot_clinvar) {
        clinvar_cols = clinvar_cols + 5;
      }
    }

    if (clinvar_cols !== 0) {
      allines.slice(1).forEach((list_string: string) => {
        const list = list_string.split("\t");
        const temp = list.slice(columns, clinvar_cols + columns);
        if (temp.some((str) => str !== ".")) {
          temp.push(list[list.length - 1]);
          const res = temp.map((str) =>
            str.length > 20 ? str.substr(0, 20) : str
          );
          clinvars.push(res);
        }
      });

      setSnpClinvarResult(clinvars);
    }
  };

  const createTableBodyDisgenet = (allines: string[]) => {
    const ddd = allines.slice(1).map((list_string: string) => {
      const list = list_string.split("\t");
      return list;
    });
    setSnpDisgenetResult(ddd);
  };

  const createTableSection = (
    TblContainer: React.FC,
    TblHead: React.FC,
    TblPagination: any,
    recordsAfterPaging: () => any[]
  ) => {
    if (snpAnnotResult.length > 0) {
      return (
        <div className={mainClasses.table_section}>
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
    return null;
  };

  const createTableDisgenetSection = () => {
    if (snpDisgenetResult.length > 0) {
      return (
        <div className={mainClasses.table_section}>
          <Paper className={mclasses.pageContent}>
            <TblContainerDisgenet>
              <TblHeadDisgenet />
              <TableBody>
                {recordsAfterPagingDisgenet().map((item, index) => (
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
            </TblContainerDisgenet>
            <TblPaginationDisgenet />
          </Paper>
        </div>
      );
    }
    return null;
  };

  const showDownloadButton = () => {
    if (customResult && customResult.status === "completed") {
      return (
        <div className={mainClasses.download}>
          <p>
            The tables below have been chunked and pruned to allow for proper
            display. Use the buttons below to download the full files.
          </p>
          <div className={mainClasses.buttons}>
            <Button
              variant="contained"
              color="primary"
              className={mainClasses.button}
              endIcon={<GetAppRounded />}
              href={`/results${customResult.annot_outputFile}`}
            >
              Download Annotation Results
            </Button>
            {snpDisgenetResult.length > 0 && (
              <Button
                variant="contained"
                color="default"
                className={mainClasses.button}
                endIcon={<GetAppRounded />}
                href={`/results${customResult.annot_disgenet}`}
              >
                Download DISGENET Results
              </Button>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const createTableTabs = () => {
    if (customResult && customResult.status === "completed") {
      return (
        <div className={mainClasses.table_tabs}>
          <h3 className={mainClasses.sub_heading}>Annotation Result Tables</h3>
          {showDownloadButton()}
          <AppBar
            className={mainClasses.tabs_header}
            color="default"
            position="static"
          >
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              aria-label="simple tabs example"
            >
              <Tab label="Annotation" {...a11yProps(0)} />
              <Tab label="1KGP Allele Frequencies" {...a11yProps(1)} />
              <Tab label="Exome Frequencies" {...a11yProps(2)} />
              <Tab label="Clinvar" {...a11yProps(3)} />
              <Tab label="Disgenet" {...a11yProps(4)} />
            </Tabs>
          </AppBar>
          <div className={mainClasses.panels}>
            <TabPanel value={value} index={0}>
              {loadingAnnot ? <CircularProgress /> : null}
              {createTableSection(
                TblContainer,
                TblHead,
                TblPagination,
                recordsAfterPaging
              )}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {loadingAnnot ? <CircularProgress /> : null}
              {snpPopFreqResult.length > 0 ? (
                createTableSection(
                  TblContainerPopFreq,
                  TblHeadPopFreq,
                  TblPaginationPopFreq,
                  recordsAfterPagingPopFreq
                )
              ) : (
                <p>No results found for your SNPs</p>
              )}
            </TabPanel>
            <TabPanel value={value} index={2}>
              {loadingAnnot ? <CircularProgress /> : null}
              {snpExacFreqResult.length > 0 ? (
                createTableSection(
                  TblContainerExacFreq,
                  TblHeadExacFreq,
                  TblPaginationExacFreq,
                  recordsAfterPagingExacFreq
                )
              ) : (
                <p>No results found for your SNPs</p>
              )}
            </TabPanel>
            <TabPanel value={value} index={3}>
              {loadingAnnot ? <CircularProgress /> : null}
              {snpClinvarResult.length > 0 ? (
                createTableSection(
                  TblContainerClinvar,
                  TblHeadClinvar,
                  TblPaginationClinvar,
                  recordsAfterPagingClinvar
                )
              ) : (
                <p>No results found for your SNPs</p>
              )}
            </TabPanel>
            <TabPanel value={value} index={4}>
              {loadingDisgenet ? (
                <CircularProgress />
              ) : snpDisgenetResult.length > 0 ? (
                createTableDisgenetSection()
              ) : (
                <p>No Data</p>
              )}
            </TabPanel>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (customResult && customResult.status === "completed") {
      if (snpAnnotResult.length === 0) {
        setLoadingAnnot(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${jobId}/annot_outputFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createHeaders(header);
            createTableBody(alllines);

            createHeadersPopFreq(header);
            createTableBodyPopFreq(alllines);

            createHeadersExacFreq(header);
            createTableBodyExacFreq(alllines);

            createHeadersClinvars(header);
            createTableBodyClinvars(alllines);

            setLoadingAnnot(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingAnnot(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [customResult, jobId]);

  useEffect(() => {
    if (
      customResult &&
      customResult.status === "completed" &&
      customResult.spgwas_params.annot_disgenet
    ) {
      if (snpDisgenetResult.length === 0) {
        setLoadingDisgenet(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${jobId}/annot_disgenet`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createHeadersDisgenet(header);
            createTableBodyDisgenet(alllines);
            setLoadingDisgenet(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingDisgenet(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [customResult, jobId]);

  return <div style={{ marginTop: "3rem" }}>{createTableTabs()}</div>;
};

export default AnnotResult;
