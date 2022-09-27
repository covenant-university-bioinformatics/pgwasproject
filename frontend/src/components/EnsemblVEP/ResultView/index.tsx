import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import pgwasAxios from "../../../axios-fetches";
// import classes from "./index.module.scss";
import useTable from "../../../hooks/useTable";
import {
  Button,
  CircularProgress,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";
import { GetAppRounded } from "@material-ui/icons";
import {
  CreateInfoSection,
  createJobFailedReason,
  createJobStatus,
} from "../../utility/general";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import classes from "../../utility/result_view.module.scss";

type Props = {};
type JobParam = {
  jobId: string;
};

export type EnsemblVEPResult = {
  _id: string;
  status: string;
  job_name: string;
  jobUID: string;
  inputFile: string;
  createdAt: string;
  resultsFile: string;
  summaryFile: string;
  failed_reason: string | undefined;
  longJob: string;
  completionTime: string;
  ensemblvep_params: {
    id: string;
    version: number;
    useTest: boolean;
    chr: number;
    start_position: number;
    stop_position: number;
    alleles: number;
    strand: number;
  };
  [key: string]: any;
};

const EnsemblVEPResultView: React.FC<Props & RouteComponentProps<JobParam>> = (
    props
) => {
  const { user } = useTypedSelector((state) => state.auth);

  let apiPath = "";
  if (user?.username) {
    apiPath = "ensemblvep";
  } else {
    apiPath = "ensemblvep/noauth";
  }

  const reloadLimit = 60;
  const { jobId: id } = props.match.params;
  const [ensembelVEPRes, setensemblVEPRes] = useState<EnsemblVEPResult | undefined>(undefined);
  const [errorInfo, setErrorInfo] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [seconds, setSeconds] = useState(reloadLimit);
  const timeout = useRef<any>(null);
  let errorMessage: any | null = null;
  let genMessage: any | null = null;

  //table data
  const [ensemblVEPResults, setEnsemblVEPResults] = useState<string[][]>([]);
  const [ensemblVEPHeader, setEnsemblVEPHeader] = useState<
      { id: string; label: string; disableSorting: boolean }[]
      >([]);
  const [loadingEnsemblVEPResults, setLoadingEnsemblVEPResults] = useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
      ensemblVEPResults,
      ensemblVEPHeader,
      [10, 15, 20],
      ensemblVEPResults.length
  );

  const createEnsemblVEPHeaders = (headers: string[]) => {
    const dcd = headers.map((ele, i) => {
      return {
        id: ele.toLowerCase().replaceAll('"', ''),
        label: ele.replaceAll('"', ''),
        disableSorting: true,
      };
    });
    // dcd.unshift({ id: "123", label: "", disableSorting: true });
    // console.log(dcd);
    setEnsemblVEPHeader(dcd);
  };

  const createEnsemblVEPTableBody = (allines: string[]) => {
    const ddd = allines
        .filter((line) => line !== "")
        .slice(1)
        .map((list_string: string) => {
          return list_string.split("\t");
        });
    setEnsemblVEPResults(ddd);
  };

  const createTableSection = (
      TblContainer: React.FC,
      TblHead: React.FC,
      TblPagination: any,
      recordsAfterPaging: () => any[]
  ) => {
    if (
        ensembelVEPRes &&
        ensembelVEPRes.status === "completed" &&
        ensemblVEPResults.length > 0
    ) {
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
                                    ? `${element.replace(/['"]+/g, "").substr(0, 31)} ...`
                                    : element.replace(/['"]+/g, "")}
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

  const showDownloadButton = (download: string, title: string, download_two: string, title_two: string) => {
    if (ensembelVEPRes && ensembelVEPRes.status === "completed") {
      return (
          <div className={classes.download}>
            <p>
              The table below have been chunked and pruned to allow for proper
              display. Use the buttons below to download the full files.
            </p>
            <div className={classes.buttons}>
              <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  endIcon={<GetAppRounded />}
                  href={`/results${ensembelVEPRes[download]}`}
              >
                Download {title} Results
              </Button>
              <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  endIcon={<GetAppRounded />}
                  href={`/results${ensembelVEPRes[download_two]}`}
              >
                Download {title_two} Results
              </Button>
            </div>
          </div>
      );
    }
    return false;
  };

  const showEnsemblVEPTables = () => {
    if (ensembelVEPRes && ensembelVEPRes.status === "completed") {
      return (
          <div className={classes.tables}>
            <h3 className={classes.sub_heading}>FineMapping Result Table</h3>
            {showDownloadButton("resultsFile", "CADD Annotation", "summaryFile", "Summary File")}
            <div className={classes.table_wrapper}>
              {loadingEnsemblVEPResults ? (
                  <CircularProgress />
              ) : (
                  createTableSection(
                      TblContainer,
                      TblHead,
                      TblPagination,
                      recordsAfterPaging
                  )
              )}
            </div>
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
        .get<EnsemblVEPResult>(`/${apiPath}/jobs/${id}`)
        .then((result) => {
          setensemblVEPRes(result.data);
          setLoading(false);
          setError(false);
          if (
              result.data.status === "completed" ||
              result.data.status === "failed"
          ) {
            // clearInterval(interval.current);
            clearTimeout(timeout.current);
          }
        })
        .catch((e) => {
          setensemblVEPRes(undefined);
          setLoading(false);
          setError(true);
          setErrorInfo(e.response.data.message);
          // clearInterval(interval.current);
          clearTimeout(timeout.current);
        });
  }, [id, reload, apiPath]);

  useEffect(() => {
    if (
        ensembelVEPRes &&
        !ensembelVEPRes.longJob &&
        (ensembelVEPRes.status === "running" || ensembelVEPRes.status === "queued")
    ) {
      if (seconds > 0) {
        timeout.current = setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(reloadLimit);
        setReload((prev) => prev + 1);
      }
    }
  }, [ensembelVEPRes, seconds]);

  useEffect(() => {
    return () => {
      // clearInterval(interval.current);
      clearTimeout(timeout.current);
    };
  }, []);

  useEffect(() => {
    if (ensembelVEPRes && ensembelVEPRes.status === "completed") {
      if (ensemblVEPResults.length === 0) {
        setLoadingEnsemblVEPResults(true);
        pgwasAxios
            .get(`/${apiPath}/jobs/output/${id}/resultsFile`)
            .then((response) => {
              const alllines = response.data.split("\n");
              const header: string[] = alllines[0].split("\t");
              createEnsemblVEPHeaders(header);
              createEnsemblVEPTableBody(alllines);
              setLoadingEnsemblVEPResults(false);
            })
            .catch((error) => {
              console.dir(error);
              setLoadingEnsemblVEPResults(false);
            });
      }
    }
    // eslint-disable-next-line
  }, [ensembelVEPRes, id]);

  return (
      <div className={classes.result_view}>
        {loading ? <CircularProgress /> : null}
        {error && (
            <div className={classes.error_message}>
              {genMessage}
              {errorMessage}
            </div>
        )}
        {createJobStatus(ensembelVEPRes, seconds, classes)}
        <h2 style={{ marginBottom: "2rem" }}>
          Results for Job: {ensembelVEPRes ? ensembelVEPRes.job_name : id}
        </h2>
        <CreateInfoSection
            resultObj={ensembelVEPRes}
            params={"ensemblvep_params"}
            classes={classes}
        />
        {createJobFailedReason(ensembelVEPRes, classes)}
        {showEnsemblVEPTables()}
      </div>
  );
};

export default EnsemblVEPResultView;
