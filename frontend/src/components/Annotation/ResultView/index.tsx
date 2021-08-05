import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
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
  const [jobRunning, setJobRunning] = useState(false);
  const { data } = useTypedSelector((state) => state.annot);
  let errorMessage: JSX.Element | null = null;
  let genMessage: JSX.Element | null = null;
  let runningMessage: JSX.Element | null = (
    <div
      style={{
        fontSize: "2rem",
        fontWeight: "bold",
        marginBottom: "2rem",
        color: "red",
      }}
    >
      Job is currently running. Please wait for it to complete
    </div>
  );
  const mclasses = useStyles();

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

  const createTableBodyDisgenet = (allines: string[]) => {
    const ddd = allines.slice(1).map((list_string: string) => {
      const list = list_string.split("\t");
      return list;
    });
    setSnpDisgenetResult(ddd);
  };

  const createTableSection = () => {
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
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              endIcon={<GetAppRounded />}
              href={`https://pgwas.dev/api/annot${annotRes.disgenet}`}
            >
              Download DISGENET Results
            </Button>
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
              <Tab label="Allele Frequencies" {...a11yProps(1)} />
              <Tab label="Disgenet" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            {loadingAnnot ? <CircularProgress /> : null}
            {createTableSection()}
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item Two
          </TabPanel>
          <TabPanel value={value} index={2}>
            {loadingDisgenet ? <CircularProgress /> : null}
            {createTableDisgenetSection()}
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

      return (
        <div className={classes.info_section}>
          <h3 className={classes.sub_heading}>Job Information</h3>
          <div className={classes.info}>{dbList}</div>
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
              src={`https://pgwas.dev/api/annot${annotRes!.snp_plot}`}
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

  useEffect(() => {
    setLoading(true);
    console.log("fetching jobs");
    pgwasAxios
      .get<AnnotationResult>(`/annot/jobs/${id}`)
      .then((result) => {
        console.log(result);
        setAnnotRes(result.data);
        setJobRunning(result.data.status === "running");
        setLoading(false);
        setError(false);
      })
      .catch((e) => {
        setAnnotRes(undefined);
        setLoading(false);
        setError(true);
        genMessage = <div>Issue with fetching job with id: {id}</div>;
        errorMessage = <div>{e.message}</div>;
      });
  }, []);

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
            setLoadingAnnot(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingAnnot(false);
          });
      }
    }
  }, [annotRes]);

  useEffect(() => {
    if (annotRes && annotRes.status === "completed") {
      if (snpDisgenetResult.length === 0) {
        setLoadingDisgenet(true);
        pgwasAxios
          .get(`/annot/jobs/output/${id}/disgenet`)
          .then((response) => {
            const alllines = response.data.split("\n");
            console.log(alllines);
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
  }, [annotRes]);

  return (
    <div className={classes.result_view}>
      {loading ? <CircularProgress /> : null}
      {error ? (
        <>
          {genMessage}
          {errorMessage}
        </>
      ) : null}
      {jobRunning && runningMessage}
      {annotRes ? (
        <h2 style={{ marginBottom: "2rem" }}>
          Results for Job: {annotRes.job_name.toUpperCase()}
        </h2>
      ) : null}
      {createInfoSection()}
      {createChartSection()}
      {createTableTabs()}
    </div>
  );
};

export default AnnotationResultView;
