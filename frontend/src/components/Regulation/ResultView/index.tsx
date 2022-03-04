import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import pgwasAxios from "../../../axios-fetches";
// import classes from "./index.module.scss";
import classes from "../../utility/result_view.module.scss";
import { CircularProgress } from "@material-ui/core";
import {
  createJobFailedReason,
  createJobStatus,
  getInfoSection,
} from "../../utility/general";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import Regulome from "./Regulome";
import HaploR from "./HaploR";

type Props = {};

type JobParam = {
  jobId: string;
};

export enum AnalysisOptions {
  HAPLOREG = "HaploReg",
  REGULOME = "Regulome",
}

export type HaploRResult = {
  _id: string;
  jobUID: string;
  job_name: string;
  createdAt: string;
  inputFile: string;
  status: string;
  failed_reason: string;
  longJob: boolean;
  haploRFile: string;
  haploRErrorFile: string;
  regulomeFile: string;
  regulomeNearbySNPsFile: string;
  version: number;
  completionTime: Date;
  haplor_params: {
    id: string;
    version: number;
    useTest: boolean;
    analysisType: AnalysisOptions;
    marker_name: number;
    ldThresh: number;
    ldPop: string;
    epi: string;
    cons: string;
    genetypes: string;
    snpID: string;
    genomeAssembly: string;
    [key: string]: any;
  };
  [key: string]: any;
};

const HaploRResultView: React.FC<Props & RouteComponentProps<JobParam>> = (
  props
) => {
  const { user } = useTypedSelector((state) => state.auth);

  let apiPath = "";
  if (user?.username) {
    apiPath = "haplor";
  } else {
    apiPath = "haplor/noauth";
  }

  const reloadLimit = 60;
  const { jobId: id } = props.match.params;

  const [haploRRes, setHaploRRes] = useState<HaploRResult | undefined>(
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

  if (error) {
    genMessage = <p>Issue with fetching job with id: {id}</p>;
    errorMessage = <p>Message from server: {errorInfo}</p>;
  }

  const createInfoSection = () => {
    let paramsList;

    if (haploRRes) {
      if (haploRRes.haplor_params.analysisType === AnalysisOptions.REGULOME) {
        paramsList = (
          <div className={classes.params_list}>
            <h3>Selected Parameters</h3>
            <ul>
              <li>
                <span>Analysis Type</span>
                <span>{String(haploRRes.haplor_params.analysisType)}</span>
              </li>
              <li>
                <span>SNP ID</span>
                <span>{String(haploRRes.haplor_params.snpID)}</span>
              </li>
              <li>
                <span>Genome Assembly</span>
                <span>{String(haploRRes.haplor_params.genomeAssembly)}</span>
              </li>
            </ul>
          </div>
        );
      } else if (
        haploRRes.haplor_params.analysisType === AnalysisOptions.HAPLOREG
      ) {
        paramsList = (
          <div className={classes.params_list}>
            <h3>Selected Parameters</h3>
            <ul>
              <li>
                <span>Analysis Type</span>
                <span>{String(haploRRes.haplor_params.analysisType)}</span>
              </li>
              <li>
                <span>Population</span>
                <span>{String(haploRRes.haplor_params.ldPop)}</span>
              </li>
              <li>
                <span>LD Thresh</span>
                <span>{String(haploRRes.haplor_params.ldThresh)}</span>
              </li>
              <li>
                <span>EPI</span>
                <span>{String(haploRRes.haplor_params.epi)}</span>
              </li>
              <li>
                <span>CONS</span>
                <span>{String(haploRRes.haplor_params.cons)}</span>
              </li>
              <li>
                <span>Genetypes</span>
                <span>{String(haploRRes.haplor_params.genetypes)}</span>
              </li>
            </ul>
          </div>
        );
      }
      return (
        <div className={classes.info_section}>
          <h3 className={classes.sub_heading}>Job Information</h3>
          <div className={classes.info}>
            {getInfoSection(haploRRes, classes)}
            {paramsList}
          </div>
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    setLoading(true);
    pgwasAxios
      .get<HaploRResult>(`/${apiPath}/jobs/${id}`)
      .then((result) => {
        setHaploRRes(result.data);
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
        setHaploRRes(undefined);
        setLoading(false);
        setError(true);
        setErrorInfo(e.response.data.message);
        // clearInterval(interval.current);
        clearTimeout(timeout.current);
      });
  }, [id, reload, apiPath]);

  useEffect(() => {
    if (
      haploRRes &&
      !haploRRes.longJob &&
      (haploRRes.status === "running" || haploRRes.status === "queued")
    ) {
      if (seconds > 0) {
        timeout.current = setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(reloadLimit);
        setReload((prev) => prev + 1);
      }
    }
  }, [haploRRes, seconds]);

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
      {createJobStatus(haploRRes, seconds, classes)}
      <h2 style={{ marginBottom: "2rem" }}>
        Results for Job: {haploRRes ? haploRRes.job_name : id}
      </h2>
      {createInfoSection()}
      {createJobFailedReason(haploRRes, classes)}
      {haploRRes &&
        haploRRes.status === "completed" &&
        haploRRes.haplor_params.analysisType === AnalysisOptions.HAPLOREG && (
          <HaploR
            resultObj={haploRRes}
            apiPath={apiPath}
            jobId={id}
            classes={classes}
          />
        )}
      {haploRRes &&
        haploRRes.status === "completed" &&
        haploRRes.haplor_params.analysisType === AnalysisOptions.REGULOME && (
          <Regulome
            resultObj={haploRRes}
            apiPath={apiPath}
            jobId={id}
            classes={classes}
          />
        )}
    </div>
  );
};

export default HaploRResultView;
