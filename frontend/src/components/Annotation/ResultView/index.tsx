import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import pgwasAxios from "../../../axios-fetches";
import classes from "./index.module.scss";
import useTable from "../../../hooks/useTable";
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
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TabPanel from "./TabPanel";
import { GetAppRounded } from "@material-ui/icons";

type Props = {};
type JobParam = {
  jobId: string;
};

export type AnnotationResult = {
  _id: string;
  status: string;
  job_name: string;
  jobUID: string;
  inputFile: string;
  createdAt: string;
  outputFile: string;
  disgenet: string;
  snp_plot: string;
  annot: {
    intervar: boolean;
    clinvar: boolean;
    disgenet: boolean;
    exac: boolean;
    kgp_sas: boolean;
    kgp_eur: boolean;
    kgp_eas: boolean;
    kgp_amr: boolean;
    kgp_afr: boolean;
    kgp_all: boolean;
    cytoband: boolean;
  };
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

const AnnotationResultView: React.FC<Props & RouteComponentProps<JobParam>> = (
  props
) => {
  const { jobId: id } = props.match.params;
  const [annotRes, setAnnotRes] = useState<AnnotationResult | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");
  const [jobRunning, setJobRunning] = useState(false);

  let errorMessage: any | null = null;
  let genMessage: any | null = null;

  const mclasses = useStyles();
  const initialCols = 12;
  const [snpAnnotResult, setSnpAnnotResult] = useState<string[][]>([]);
  const [snpAnnotHeader, setSnpAnnotHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingAnnot, setLoadingAnnot] = useState(false);

  const [snpDisgenetResult, setSnpDisgenetResult] = useState<string[][]>([]);
  const [snpDisgenetHeader, setSnpDisgenetHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingDisgenet, setLoadingDisgenet] = useState(false);

  const [snpPopFreqResult, setSnpPopFreqResult] = useState<string[][]>([]);
  const [snpPopFreqHeader, setSnpPopFreqHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);

  const [snpExacFreqResult, setSnpExacFreqResult] = useState<string[][]>([]);
  const [snpExacFreqHeader, setSnpExacFreqHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);

  const [snpClinvarResult, setSnpClinvarResult] = useState<string[][]>([]);
  const [snpClinvarHeader, setSnpClinvarHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    snpAnnotResult,
    snpAnnotHeader,
    [10, 15, 20],
    snpAnnotResult.length
  );

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

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const createHeaders = (headers: string[]) => {
    const annotHead = headers.slice(0, 7);
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
    if (annotRes && annotRes.status === "completed") {
      const { annot } = annotRes;

      if (annot.kgp_all) {
        columns += 1;
      }
      if (annot.kgp_afr) {
        columns += 1;
      }
      if (annot.kgp_sas) {
        columns += 1;
      }
      if (annot.kgp_eur) {
        columns += 1;
      }
      if (annot.kgp_eas) {
        columns += 1;
      }
      if (annot.kgp_amr) {
        columns += 1;
      }
    }
    return columns;
  };

  const getExacCols = () => {
    let columns = 0;
    if (annotRes && annotRes.status === "completed") {
      const { annot } = annotRes;
      if (annot.exac) {
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

    if (annotRes && annotRes.status === "completed") {
      if (annotRes.annot.clinvar) {
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
      const temp = list.slice(0, 7);
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
        const temp = list.slice(12, columns + 12);
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

    if (annotRes && annotRes.status === "completed") {
      if (annotRes.annot.clinvar) {
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
        <div className={classes.table_section}>
          {/*<Paper className={mclasses.pageContent}>*/}
          <TblContainer>
            <TblHead />
            <TableBody>
              {recordsAfterPaging().map((item, index) => (
                <TableRow key={`row${index}`}>
                  {item.map((element: string, idx: number) => (
                    <TableCell key={`idx${idx}`}>
                      {element === "." ? "NA" : element}
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
        <div className={classes.table_section}>
          <Paper className={mclasses.pageContent}>
            <TblContainerDisgenet>
              <TblHeadDisgenet />
              <TableBody>
                {recordsAfterPagingDisgenet().map((item, index) => (
                  <TableRow key={`row${index}`}>
                    {item.map((element: string, idx: number) => (
                      <TableCell key={`idx${idx}`}>
                        {element === "." ? "NA" : element}
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
    if (annotRes && annotRes.status === "completed") {
      return (
        <div className={classes.download}>
          <p>
            The tables below have been chuked and pruned to allow for proper
            display. Use the buttons below to download the full files.
          </p>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              endIcon={<GetAppRounded />}
              href={`https://pgwas.dev/api/annot${annotRes.outputFile}`}
            >
              Download Annotation Results
            </Button>
            {snpDisgenetResult.length > 0 && (
              <Button
                variant="contained"
                color="default"
                className={classes.button}
                endIcon={<GetAppRounded />}
                href={`https://pgwas.dev/api/annot${annotRes.disgenet}`}
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
    if (snpAnnotResult.length > 0) {
      return (
        <div className={classes.table_tabs}>
          <h3 className={classes.sub_heading}>Annotation Result Tables</h3>
          {showDownloadButton()}
          <AppBar color="default" position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
            >
              <Tab label="Annotation" {...a11yProps(0)} />
              {snpPopFreqHeader.length > 0 && (
                <Tab label="1KGP Allele Frequencies" {...a11yProps(1)} />
              )}
              {snpExacFreqHeader.length > 0 && (
                <Tab label="Exome Frequencies" {...a11yProps(2)} />
              )}
              {snpClinvarHeader.length > 0 && (
                <Tab label="Clinvar" {...a11yProps(3)} />
              )}
              {snpDisgenetHeader.length > 0 && (
                <Tab label="Disgenet" {...a11yProps(4)} />
              )}
            </Tabs>
          </AppBar>
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
              <p>No Data</p>
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
              <p>No Data</p>
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
              <p>No Data</p>
            )}
          </TabPanel>
          <TabPanel value={value} index={4}>
            {loadingDisgenet ? <CircularProgress /> : null}
            {snpDisgenetResult.length > 0 ? (
              createTableDisgenetSection()
            ) : (
              <p>No Data</p>
            )}
          </TabPanel>
        </div>
      );
    }
    return null;
  };

  const createInfoSection = () => {
    if (annotRes) {
      const dbList = (
        <div className={classes.db_list}>
          <h3>Selected Databases</h3>
          <ul>
            <li>
              <span>Cytoband</span>
              <span>{String(annotRes.annot.cytoband)}</span>
            </li>
            <li>
              <span>Clinvar</span>
              <span>{String(annotRes.annot.clinvar)}</span>
            </li>
            <li>
              <span>Disgenet</span>
              <span>{String(annotRes.annot.disgenet)}</span>
            </li>
            <li>
              <span>EXAC</span> <span>{String(annotRes.annot.exac)}</span>
            </li>
            <li>
              <span>1KGP SAS</span>
              <span>{String(annotRes.annot.kgp_sas)}</span>
            </li>
            <li>
              <span>1KGP EUR</span>
              <span>{String(annotRes.annot.kgp_eur)}</span>
            </li>
            <li>
              <span>1KGP EAS</span>
              <span>{String(annotRes.annot.kgp_eas)}</span>
            </li>
            <li>
              <span>1KGP AMR</span>
              <span>{String(annotRes.annot.kgp_amr)}</span>
            </li>
            <li>
              <span>1KGP ALL</span>
              <span>{String(annotRes.annot.kgp_all)}</span>
            </li>
            <li>
              <span>1KGP AFR</span>
              <span>{String(annotRes.annot.kgp_afr)}</span>
            </li>
          </ul>
        </div>
      );

      const jobList = (
        <div className={classes.job_list}>
          <h3>Job Details</h3>
          <ul>
            <li>
              <span>Job Name</span>
              <span>{String(annotRes.job_name)}</span>
            </li>
            <li>
              <span>Job UID</span>
              <span>{String(annotRes.jobUID)}</span>
            </li>
            <li>
              <span>Job Status</span>
              <span>{String(annotRes.status)}</span>
            </li>
            <li>
              <span>Input File</span>
              <span>{String(annotRes.inputFile).split("/")[5]}</span>
            </li>
            <li>
              <span>Created Date</span>
              <span>{new Date(annotRes.createdAt).toLocaleString()}</span>
            </li>
          </ul>
        </div>
      );

      return (
        <div className={classes.info_section}>
          <h3 className={classes.sub_heading}>Job Information</h3>
          <div className={classes.info}>
            {jobList}
            {dbList}
          </div>
        </div>
      );
    }
    return false;
  };

  const createChartSection = () => {
    if (annotRes && annotRes.status === "completed") {
      const chart = (
        <div className={classes.image_tab}>
          <h3>SNP Locations</h3>
          <div className={classes.image_box}>
            <img
              src={`https://spgwas.waslitbre.org/api/annot${
                annotRes!.snp_plot
              }`}
              alt="snp_plot"
            />
          </div>
        </div>
      );

      return (
        <div className={classes.annot_overview}>
          <h3 className={classes.sub_heading}>Annotation Overview</h3>
          {chart}
        </div>
      );
    }
    return false;
  };

  if (error) {
    genMessage = <p>Issue with fetching job with id: {id}</p>;
    errorMessage = <p>Message from server: {errorInfo}</p>;
  }

  useEffect(() => {
    setLoading(true);
    pgwasAxios
      .get<AnnotationResult>(`/annot/jobs/${id}`)
      .then((result) => {
        setAnnotRes(result.data);
        setJobRunning(result.data.status === "running");
        setLoading(false);
        setError(false);
      })
      .catch((e) => {
        setAnnotRes(undefined);
        setLoading(false);
        setError(true);
        setErrorInfo(e.response.data.message);
      });
  }, [id]);

  useEffect(() => {
    if (annotRes && annotRes.status === "completed") {
      if (snpAnnotResult.length === 0) {
        setLoadingAnnot(true);
        pgwasAxios
          .get(`/annot/jobs/output/${id}/outputFile`)
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
  }, [annotRes, id]);

  useEffect(() => {
    if (
      annotRes &&
      annotRes.status === "completed" &&
      annotRes.annot.disgenet
    ) {
      if (snpDisgenetResult.length === 0) {
        setLoadingDisgenet(true);
        pgwasAxios
          .get(`/annot/jobs/output/${id}/disgenet`)
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
  }, [annotRes, id]);

  console.log("render");

  return (
    <div className={classes.result_view}>
      {loading ? <CircularProgress /> : null}
      {error && (
        <div className={classes.error_message}>
          {genMessage}
          {errorMessage}
        </div>
      )}
      {jobRunning && (
        <div className={classes.job_running}>
          <p>Job is currently running. Please wait for it to complete</p>
        </div>
      )}
      <h2 style={{ marginBottom: "2rem" }}>
        Results for Job: {annotRes ? annotRes.job_name : id}
      </h2>
      {createInfoSection()}
      {createChartSection()}
      {createTableTabs()}
    </div>
  );
};

export default AnnotationResultView;
