import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import pgwasAxios from "../../../axios-fetches";
import classes from "./index.module.scss";
import { Button, CircularProgress } from "@material-ui/core";
import { GetAppRounded } from "@material-ui/icons";
import {
  createJobFailedReason,
  createJobStatus,
  getInfoSection,
} from "../../utility/general";
import { useTypedSelector } from "../../../hooks/useTypedSelector";

type Props = {};
type JobParam = {
  jobId: string;
};

type LiftoverResult = {
  _id: string;
  job_name: string;
  status: string;
  createdAt: string;
  inputFile: string;
  outputFile: string;
  unliftedFile: string;
  failed_reason: string;
  [key: string]: any;
};

const LiftOverResultView: React.FC<Props & RouteComponentProps<JobParam>> = (
  props
) => {
  const { user } = useTypedSelector((state) => state.auth);

  let apiPath = "";
  if (user?.username) {
    apiPath = "liftover";
  } else {
    apiPath = "liftover/noauth";
  }

  const reloadLimit = 20;

  const { jobId: id } = props.match.params;
  const [liftOverRes, setLiftOverRes] = useState<LiftoverResult | undefined>(
    undefined
  );
  const [errorInfo, setErrorInfo] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [seconds, setSeconds] = useState(reloadLimit);
  const timeout = useRef<any>(null);
  let errorMessage: any | null = null;
  let genMessage: any | null = null;

  const createTheInfoSection = () => {
    if (liftOverRes) {
      return (
        <div className={classes.info_section}>
          <h3 className={classes.sub_heading}>Job Information</h3>
          <div className={classes.info}>
            {getInfoSection(liftOverRes, classes)}
          </div>
        </div>
      );
    }
    return false;
  };

  const showDownloadButton = () => {
    if (liftOverRes && liftOverRes.status === "completed") {
      return (
        <div className={classes.download}>
          <h2>Please use the download buttons below</h2>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              endIcon={<GetAppRounded />}
              href={`/results${liftOverRes["outputFile"]}`}
              target="_blank"
            >
              Download Liftover Results
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              endIcon={<GetAppRounded />}
              href={`/results${liftOverRes["unliftedFile"]}`}
              target="_blank"
            >
              Download Unlifted Results
            </Button>
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
      .get<LiftoverResult>(`/${apiPath}/jobs/${id}`)
      .then((result) => {
        setLiftOverRes(result.data);
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
        setLiftOverRes(undefined);
        setLoading(false);
        setError(true);
        setErrorInfo(e.response.data.message);
        // clearInterval(interval.current);
        clearTimeout(timeout.current);
      });
  }, [id, reload, apiPath]);

  useEffect(() => {
    if (
      liftOverRes &&
      !liftOverRes.longJob &&
      (liftOverRes.status === "running" || liftOverRes.status === "queued")
    ) {
      if (seconds > 0) {
        timeout.current = setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(reloadLimit);
        setReload((prev) => prev + 1);
      }
    }
  }, [liftOverRes, seconds]);

  useEffect(() => {
    return () => {
      // clearInterval(interval.current);
      clearTimeout(timeout.current);
    };
  }, []);

  return (
    <div className={classes.result_view}>
      {loading ? <CircularProgress /> : null}
      {error && (
        <div className={classes.error_message}>
          {genMessage}
          {errorMessage}
        </div>
      )}
      {createJobStatus(liftOverRes, seconds, classes)}
      <h2 style={{ marginBottom: "2rem" }}>
        Results for Job: {liftOverRes ? liftOverRes.job_name : id}
      </h2>
      {createTheInfoSection()}
      {createJobFailedReason(liftOverRes, classes)}
      {showDownloadButton()}
    </div>
  );
};

export default LiftOverResultView;
