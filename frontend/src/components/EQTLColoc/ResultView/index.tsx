import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import pgwasAxios from "../../../axios-fetches";
import classes from "../../utility/result_view.module.scss";
import mainClasses from "./index.module.scss";
import { Button, CircularProgress } from "@material-ui/core";
import {
  CreateInfoSection,
  createJobFailedReason,
  createJobStatus,
  createTableSection,
} from "../../utility/general";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import useTable from "../../../hooks/useTable";
import {
  createComponentTableBody,
  createComponentTableHeaders,
} from "../../utility/general_utils";
import { GetAppRounded } from "@material-ui/icons";

type Props = {};
type JobParam = {
  jobId: string;
};

export type EqtlColocResult = {
  _id: string;
  jobUID: string;
  job_name: string;
  inputFile: string;
  status: string;
  colocSummaryFile: string;
  colocResultsFile: string;
  failed_reason: string;
  longJob: boolean;
  version: number;
  completionTime: string;
  eqtlcoloc_params: {
    GTEX8tissue: string;
    p_one: string;
    p_two: string;
    p_twelve: string;
    type: string;
    s_prop: number;
    [key: string]: any;
  };
  [key: string]: any;
};

const EqtlColocResultView: React.FC<Props & RouteComponentProps<JobParam>> = (
  props
) => {
  const { user } = useTypedSelector((state) => state.auth);

  let apiPath = "";
  if (user?.username) {
    apiPath = "eqtlcoloc";
  } else {
    apiPath = "eqtlcoloc/noauth";
  }

  const reloadLimit = 60;
  const { jobId: id } = props.match.params;

  const [eqtlColocRes, setEqtlColocRes] = useState<EqtlColocResult | undefined>(
    undefined
  );

  const [errorInfo, setErrorInfo] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [seconds, setSeconds] = useState(reloadLimit);

  const [colocResults, setColocResults] = useState<string[][]>([]);
  const [colocResultHeader, setColocResultHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingResults, setLoadingResults] = useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    colocResults,
    colocResultHeader,
    [10, 15, 20],
    colocResults.length
  );

  const [summaryResults, setSummaryResults] = useState<string[]>([]);
  const [summaryHeader, setSummaryHeader] = useState<string[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const timeout = useRef<any>(null);

  const showDownloadButton = (download: string, title: string) => {
    if (
      eqtlColocRes &&
      eqtlColocRes.status === "completed" &&
      eqtlColocRes[download]
    ) {
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
              href={`/results${eqtlColocRes[download]}`}
            >
              Download {title} Results
            </Button>
          </div>
        </div>
      );
    }
    return false;
  };

  //Get status object
  useEffect(() => {
    setLoading(true);
    pgwasAxios
      .get<EqtlColocResult>(`/${apiPath}/jobs/${id}`)
      .then((result) => {
        setEqtlColocRes(result.data);
        setLoading(false);
        setError(false);
        if (
          result.data.status === "completed" ||
          result.data.status === "failed"
        ) {
          clearTimeout(timeout.current);
        }
      })
      .catch((e) => {
        console.dir(e);
        setEqtlColocRes(undefined);
        setLoading(false);
        setError(true);
        setErrorInfo(e.response.data.message);
        clearTimeout(timeout.current);
      });
  }, [apiPath, id, reload]);

  //controls timer
  useEffect(() => {
    if (
      eqtlColocRes &&
      !eqtlColocRes.longJob &&
      (eqtlColocRes.status === "running" || eqtlColocRes.status === "queued")
    ) {
      if (seconds > 0) {
        timeout.current = setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(reloadLimit);
        setReload((prev) => prev + 1);
      }
    }
  }, [eqtlColocRes, seconds]);

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  useEffect(() => {
    if (eqtlColocRes && eqtlColocRes.status === "completed") {
      if (eqtlColocRes.colocResultsFile) {
        setLoadingResults(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${id}/colocResultsFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createComponentTableHeaders(header, setColocResultHeader);
            createComponentTableBody(alllines, setColocResults);
            setLoadingResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [eqtlColocRes, id]);

  useEffect(() => {
    if (eqtlColocRes && eqtlColocRes.status === "completed") {
      if (eqtlColocRes.colocSummaryFile) {
        setLoadingSummary(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${id}/colocSummaryFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            setSummaryHeader(alllines[0].split("\t"));
            setSummaryResults(alllines[1].split("\t"));
            setLoadingSummary(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingSummary(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [eqtlColocRes, id]);

  return (
    <div className={classes.result_view}>
      {loading ? <CircularProgress /> : null}
      {error && (
        <div className={classes.error_message}>
          <p>Issue with fetching job with id: {id}</p>
          <p>Message from server: {errorInfo}</p>
        </div>
      )}
      {createJobStatus(eqtlColocRes, seconds, classes)}
      <h2 style={{ marginBottom: "2rem" }}>
        Results for Job: {eqtlColocRes ? eqtlColocRes.job_name : id}
      </h2>
      <CreateInfoSection
        resultObj={eqtlColocRes}
        params={"eqtlcoloc_params"}
        classes={classes}
      />
      {createJobFailedReason(eqtlColocRes, classes)}
      {eqtlColocRes && eqtlColocRes.status === "completed" && (
        <>
          {eqtlColocRes.colocSummaryFile && (
            <div className={mainClasses.summary}>
              <h2>Colocalization Summary</h2>
              <div className={mainClasses.buttons}>
                <Button
                  variant="contained"
                  color="primary"
                  className={mainClasses.button}
                  endIcon={<GetAppRounded />}
                  href={`/results${eqtlColocRes["colocSummaryFile"]}`}
                >
                  Download Colocaliation Summary Results
                </Button>
              </div>
              {loadingSummary ? (
                <CircularProgress />
              ) : (
                <ul className={mainClasses.list}>
                  {summaryResults.map((ele, index) => (
                    <li key={`idx${index}`} className={mainClasses.element}>
                      <span>{summaryHeader[index].replace(/['"]+/g, "")}</span>
                      <span>{ele.replace(/['"]+/g, "")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {eqtlColocRes.colocResultsFile && (
            <div className={classes.tables}>
              <h3 className={classes.sub_heading}>
                Colocalization Result Table
              </h3>
              {showDownloadButton("colocResultsFile", "Colocalization Results")}
              <div
                className={[classes.table_wrapper, mainClasses.overflow].join(
                  " "
                )}
              >
                {loadingResults ? (
                  <CircularProgress />
                ) : (
                  createTableSection(
                    TblContainer,
                    TblHead,
                    TblPagination,
                    recordsAfterPaging,
                    colocResults.length,
                    eqtlColocRes,
                    classes
                  )
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EqtlColocResultView;
