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
import LDPairwise from "./Pairwise";
import LDAll from "./LDAll";
import LDClump from "./LDClump";

type Props = {};
type JobParam = {
  jobId: string;
};

export enum LDAnalysisOptions {
  PAIRWISE = "pairwise",
  ALLLDVALUES = "all_LD_values",
  CLUMPING = "clumping",
}

export type LDStructureResult = {
  _id: string;
  status: string;
  job_name: string;
  jobUID: string;
  inputFile: string;
  createdAt: string;
  LDPairwiseFile: string;
  LDAllFile: string;
  LDClumpFile: string;
  failed_reason: string | undefined;
  longJob: string;
  completionTime: string;
  ldplink_params: {
    id: string;
    version: number;
    marker_name: number;
    p_value: number;
    population: string;
    ld_analysis: LDAnalysisOptions;
    pairwise_snp1: string;
    pairwise_snp2: string;
    allLDValues_snp1: string;
    allLDValues_ld_window_kb: number;
    allLDValues_ld_window: number;
    allLDValues_ld_window_r2: number;
    clumping_clump_p1: number;
    clumping_clump_p2: number;
    clumping_clump_r2: number;
    clumping_clump_kb: number;
    clumping_allow_overlap: string;
    clumping_use_gene_region_file: string;
    clumping_clump_range: string;
    clumping_range_border: number;
    [key: string]: any;
  };
  [key: string]: any;
};

const LDStructureResultView: React.FC<Props & RouteComponentProps<JobParam>> = (
  props
) => {
  const { user } = useTypedSelector((state) => state.auth);

  let apiPath = "";
  if (user?.username) {
    apiPath = "ldstructure";
  } else {
    apiPath = "ldstructure/noauth";
  }

  const reloadLimit = 60;
  const { jobId: id } = props.match.params;

  const [ldStructureRes, setLDStructureRes] = useState<
    LDStructureResult | undefined
  >(undefined);
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

    if (ldStructureRes) {
      if (
        ldStructureRes.ldplink_params.ld_analysis === LDAnalysisOptions.PAIRWISE
      ) {
        paramsList = (
          <div className={classes.params_list}>
            <h3>Selected Parameters</h3>
            <ul>
              <li>
                <span>LD Analysis</span>
                <span>{String(ldStructureRes.ldplink_params.ld_analysis)}</span>
              </li>
              <li>
                <span>Population</span>
                <span>{String(ldStructureRes.ldplink_params.population)}</span>
              </li>
              <li>
                <span>SNP 1</span>
                <span>
                  {String(ldStructureRes.ldplink_params.pairwise_snp1)}
                </span>
              </li>
              <li>
                <span>SNP 2</span>
                <span>
                  {String(ldStructureRes.ldplink_params.pairwise_snp2)}
                </span>
              </li>
            </ul>
          </div>
        );
      } else if (
        ldStructureRes.ldplink_params.ld_analysis ===
        LDAnalysisOptions.ALLLDVALUES
      ) {
        paramsList = (
          <div className={classes.params_list}>
            <h3>Selected Parameters</h3>
            <ul>
              <li>
                <span>LD Analysis</span>
                <span>{String(ldStructureRes.ldplink_params.ld_analysis)}</span>
              </li>
              <li>
                <span>Population</span>
                <span>{String(ldStructureRes.ldplink_params.population)}</span>
              </li>
              <li>
                <span>SNP ID</span>
                <span>
                  {String(ldStructureRes.ldplink_params.allLDValues_snp1)}
                </span>
              </li>
              <li>
                <span>LD Window KB</span>
                <span>
                  {String(
                    ldStructureRes.ldplink_params.allLDValues_ld_window_kb
                  )}
                </span>
              </li>
              <li>
                <span>LD Window</span>
                <span>
                  {String(ldStructureRes.ldplink_params.allLDValues_ld_window)}
                </span>
              </li>
              <li>
                <span>LD Window R squared</span>
                <span>
                  {String(
                    ldStructureRes.ldplink_params.allLDValues_ld_window_r2
                  )}
                </span>
              </li>
            </ul>
          </div>
        );
      } else if (
        ldStructureRes.ldplink_params.ld_analysis === LDAnalysisOptions.CLUMPING
      ) {
        paramsList = (
          <div className={classes.params_list}>
            <h3>Selected Parameters</h3>
            <ul>
              <li>
                <span>LD Analysis</span>
                <span>{String(ldStructureRes.ldplink_params.ld_analysis)}</span>
              </li>
              <li>
                <span>Population</span>
                <span>{String(ldStructureRes.ldplink_params.population)}</span>
              </li>
              <li>
                <span>Clump P1</span>
                <span>
                  {String(ldStructureRes.ldplink_params.clumping_clump_p1)}
                </span>
              </li>
              <li>
                <span>Clump P2</span>
                <span>
                  {String(ldStructureRes.ldplink_params.clumping_clump_p2)}
                </span>
              </li>
              <li>
                <span>Clump R squared</span>
                <span>
                  {String(ldStructureRes.ldplink_params.clumping_clump_r2)}
                </span>
              </li>
              <li>
                <span>Clump KB</span>
                <span>
                  {String(ldStructureRes.ldplink_params.clumping_clump_kb)}
                </span>
              </li>
              <li>
                <span>Allow Overlap</span>
                <span>
                  {String(ldStructureRes.ldplink_params.clumping_allow_overlap)}
                </span>
              </li>
              <li>
                <span>Use gene region</span>
                <span>
                  {String(
                    ldStructureRes.ldplink_params.clumping_use_gene_region_file
                  )}
                </span>
              </li>
              <li>
                <span>Use gene region</span>
                <span>
                  {String(ldStructureRes.ldplink_params.clumping_clump_range)}
                </span>
              </li>
              <li>
                <span>Range Border</span>
                <span>
                  {String(ldStructureRes.ldplink_params.clumping_range_border)}
                </span>
              </li>
            </ul>
          </div>
        );
      }
      return (
        <div className={classes.info_section}>
          <h3 className={classes.sub_heading}>Job Information</h3>
          <div className={classes.info}>
            {getInfoSection(ldStructureRes, classes)}
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
      .get<LDStructureResult>(`/${apiPath}/jobs/${id}`)
      .then((result) => {
        setLDStructureRes(result.data);
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
        setLDStructureRes(undefined);
        setLoading(false);
        setError(true);
        setErrorInfo(e.response.data.message);
        // clearInterval(interval.current);
        clearTimeout(timeout.current);
      });
  }, [id, reload, apiPath]);

  useEffect(() => {
    if (
      ldStructureRes &&
      !ldStructureRes.longJob &&
      (ldStructureRes.status === "running" ||
        ldStructureRes.status === "queued")
    ) {
      if (seconds > 0) {
        timeout.current = setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(reloadLimit);
        setReload((prev) => prev + 1);
      }
    }
  }, [ldStructureRes, seconds]);

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
      {createJobStatus(ldStructureRes, seconds, classes)}
      <h2 style={{ marginBottom: "2rem" }}>
        Results for Job: {ldStructureRes ? ldStructureRes.job_name : id}
      </h2>
      {createInfoSection()}
      {createJobFailedReason(ldStructureRes, classes)}
      {ldStructureRes &&
        ldStructureRes.ldplink_params.ld_analysis ===
          LDAnalysisOptions.PAIRWISE && (
          <LDPairwise
            ldStructureRes={ldStructureRes}
            apiPath={apiPath}
            jobId={id}
          />
        )}
      {ldStructureRes &&
        ldStructureRes.ldplink_params.ld_analysis ===
          LDAnalysisOptions.ALLLDVALUES && (
          <LDAll
            ldStructureRes={ldStructureRes}
            apiPath={apiPath}
            jobId={id}
            classes={classes}
          />
        )}
      {ldStructureRes &&
        ldStructureRes.ldplink_params.ld_analysis ===
          LDAnalysisOptions.CLUMPING && (
          <LDClump
            ldStructureRes={ldStructureRes}
            apiPath={apiPath}
            jobId={id}
            classes={classes}
          />
        )}
    </div>
  );
};

export default LDStructureResultView;
