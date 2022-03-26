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

type ZscoreResult = {
  _id: string;
  jobUID: string;
  job_name: string;
  inputFile: string;
  status: string;
  zscoreFile: string;
  failed_reason: string;
  longJob: boolean;
  version: number;
  completionTime: string;
  zscore_params: {
    useTest: boolean;
    beta: number;
    se: number;
    pvalue: number;
    [key: string]: any;
  };
  [key: string]: any;
};

const ZscoreResultView: React.FC<Props & RouteComponentProps<JobParam>> = (
  props
) => {
  const { user } = useTypedSelector((state) => state.auth);

  let apiPath = "";
  if (user?.username) {
    apiPath = "zscore";
  } else {
    apiPath = "zscore/noauth";
  }

  const reloadLimit = 60;
  const { jobId: id } = props.match.params;

  const [zscoreRes, setZscoreRes] = useState<ZscoreResult | undefined>(
    undefined
  );

  const [errorInfo, setErrorInfo] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [seconds, setSeconds] = useState(reloadLimit);

  const [zscoreResults, setZscoreResults] = useState<string[][]>([]);
  const [zscoreResultHeader, setZscoreResultHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingResults, setLoadingResults] = useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    zscoreResults,
    zscoreResultHeader,
    [10, 15, 20],
    zscoreResults.length
  );

  const timeout = useRef<any>(null);

  const showDownloadButton = (download: string, title: string) => {
    const fileList = zscoreRes ? zscoreRes[download].split(/(\\|\/)/g) : [];
    let downloadName = "Zscore.txt";

    if (fileList.length > 0) {
      // downloadName = fileList[fileList.length - 1].replace(/\.[^/.]+$/, "");
      downloadName = fileList[fileList.length - 1];
    }

    if (zscoreRes && zscoreRes.status === "completed" && zscoreRes[download]) {
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
              href={`/results${zscoreRes[download]}`}
              target={"_blank"}
              download={downloadName}
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
      .get<ZscoreResult>(`/${apiPath}/jobs/${id}`)
      .then((result) => {
        setZscoreRes(result.data);
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
        setZscoreRes(undefined);
        setLoading(false);
        setError(true);
        setErrorInfo(e.response.data.message);
        clearTimeout(timeout.current);
      });
  }, [apiPath, id, reload]);

  //controls timer
  useEffect(() => {
    if (
      zscoreRes &&
      !zscoreRes.longJob &&
      (zscoreRes.status === "running" || zscoreRes.status === "queued")
    ) {
      if (seconds > 0) {
        timeout.current = setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(reloadLimit);
        setReload((prev) => prev + 1);
      }
    }
  }, [zscoreRes, seconds]);

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  //Gets file
  useEffect(() => {
    if (zscoreRes && zscoreRes.status === "completed") {
      if (zscoreRes.zscoreFile) {
        setLoadingResults(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${id}/zscoreFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createComponentTableHeaders(header, setZscoreResultHeader);
            createComponentTableBody(alllines, setZscoreResults);
            setLoadingResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [zscoreRes, id]);

  return (
    <div className={classes.result_view}>
      {loading ? <CircularProgress /> : null}
      {error && (
        <div className={classes.error_message}>
          <p>Issue with fetching job with id: {id}</p>
          <p>Message from server: {errorInfo}</p>
        </div>
      )}
      {createJobStatus(zscoreRes, seconds, classes)}
      <h2 style={{ marginBottom: "2rem" }}>
        Results for Job: {zscoreRes ? zscoreRes.job_name : id}
      </h2>
      <CreateInfoSection
        resultObj={zscoreRes}
        params={"zscore_params"}
        classes={classes}
      />
      {createJobFailedReason(zscoreRes, classes)}
      {zscoreRes && zscoreRes.status === "completed" && (
        <>
          {zscoreRes.zscoreFile && (
            <div className={classes.tables}>
              <h3 className={classes.sub_heading}>Zscore Result Table</h3>
              {showDownloadButton("zscoreFile", "Zscore Results")}
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
                    zscoreResults.length,
                    zscoreRes,
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

export default ZscoreResultView;
