import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
// import SimpleBar from "simplebar-react";
// import "simplebar/dist/simplebar.min.css";
import pgwasAxios from "../../../axios-fetches";
// import mainClasses from "./index.module.scss";
import classes from "../../utility/result_view.module.scss";
import { CircularProgress } from "@material-ui/core";
import {
  CreateInfoSection,
  createJobFailedReason,
  createJobStatus,
} from "../../utility/general";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import TableTabs from "./TableTabs";

type Props = {};
type JobParam = {
  jobId: string;
};

export type EqtlResult = {
  _id: string;
  jobUID: string;
  job_name: string;
  inputFile: string;
  status: string;
  cageSMRFile: string;
  cageTransFile: string;
  cageMultiFile: string;
  cageSMRManhattanPlot: string;
  cageSMRQQPlot: string;
  cageMultiManhattanPlot: string;
  cageMultiQQPlot: string;
  tissueSMRFile: string;
  tissueTransFile: string;
  tissueMultiFile: string;
  tissueSMRManhattanPlot: string;
  tissueSMRQQPlot: string;
  tissueMultiManhattanPlot: string;
  tissueMultiQQPlot: string;
  westraSMRFile: string;
  westraTransFile: string;
  westraMultiFile: string;
  westraSMRManhattanPlot: string;
  westraSMRQQPlot: string;
  westraMultiManhattanPlot: string;
  westraMultiQQPlot: string;
  failed_reason: string;
  longJob: boolean;
  version: number;
  completionTime: string;
  eqtl_params: {
    population: string;
    heidi: string;
    trans: string;
    smr_multi: string;
    maf: string;
    diff_freq: string;
    diff_freq_prop: string;
    cis_wind: string;
    peqtl_smr: string;
    ld_upper_limit: string;
    ld_lower_limit: string;
    peqtl_heidi: string;
    heidi_mtd: string;
    heidi_min_m: string;
    heidi_max_m: string;
    trans_wind: string;
    set_wind: string;
    ld_multi_snp: string;
    Westra_eqtl: string;
    CAGE_eqtl: string;
    GTEx_v8_tissue: string;
    [key: string]: any;
  };
  [key: string]: any;
};

const EqtlResultView: React.FC<Props & RouteComponentProps<JobParam>> = (
  props
) => {
  const { user } = useTypedSelector((state) => state.auth);

  let apiPath = "";
  if (user?.username) {
    apiPath = "eqtl";
  } else {
    apiPath = "eqtl/noauth";
  }

  const reloadLimit = 60;
  const { jobId: id } = props.match.params;

  const [eqtlRes, setEqtlRes] = useState<EqtlResult | undefined>(undefined);

  const [errorInfo, setErrorInfo] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [seconds, setSeconds] = useState(reloadLimit);

  const timeout = useRef<any>(null);

  // const createTheInfoSection = () => {
  //   const toRemove = ["_id", "job", "createdAt", "updatedAt", "version", "id"];
  //   if (eqtlRes) {
  //     const list = Object.keys(eqtlRes.eqtl_params).filter(
  //       (x) => !toRemove.includes(x)
  //     );
  //
  //     const paramsList = (
  //       <div className={classes.params_list}>
  //         <h3>Selected Parameters</h3>
  //         <ul>
  //           {list.map((element) => (
  //             <li key={element}>
  //               <span>{element}</span>
  //               <span>{String(eqtlRes.eqtl_params[element])}</span>
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     );
  //     return (
  //       <div className={classes.info_section}>
  //         <h3 className={classes.sub_heading}>Job Information</h3>
  //         <div className={classes.info}>
  //           {getInfoSection(eqtlRes, classes)}
  //           {paramsList}
  //         </div>
  //       </div>
  //     );
  //   }
  //
  //   return false;
  // };

  //Get status object
  useEffect(() => {
    setLoading(true);
    pgwasAxios
      .get<EqtlResult>(`/${apiPath}/jobs/${id}`)
      .then((result) => {
        console.log(result.data);
        setEqtlRes(result.data);
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
        setEqtlRes(undefined);
        setLoading(false);
        setError(true);
        setErrorInfo(e.response.data.message);
        clearTimeout(timeout.current);
      });
  }, [apiPath, id, reload]);

  //controls timer
  useEffect(() => {
    if (
      eqtlRes &&
      !eqtlRes.longJob &&
      (eqtlRes.status === "running" || eqtlRes.status === "queued")
    ) {
      if (seconds > 0) {
        timeout.current = setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(reloadLimit);
        setReload((prev) => prev + 1);
      }
    }
  }, [eqtlRes, seconds]);

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  console.log(eqtlRes);

  return (
    <div className={classes.result_view}>
      {loading ? <CircularProgress /> : null}
      {error && (
        <div className={classes.error_message}>
          <p>Issue with fetching job with id: {id}</p>
          <p>Message from server: {errorInfo}</p>
        </div>
      )}
      {createJobStatus(eqtlRes, seconds, classes)}
      <h2 style={{ marginBottom: "2rem" }}>
        Results for Job: {eqtlRes ? eqtlRes.job_name : id}
      </h2>
      {/*{createTheInfoSection()}*/}
      <CreateInfoSection
        resultObj={eqtlRes}
        params={"eqtl_params"}
        classes={classes}
      />
      {createJobFailedReason(eqtlRes, classes)}
      {eqtlRes?.eqtl_params?.GTEx_v8_tissue && (
        <TableTabs
          eqtlRes={eqtlRes}
          apiPath={apiPath}
          dataset={"Tissue"}
          jobId={id}
          classes={classes}
          tissueName={eqtlRes.eqtl_params.GTEx_v8_tissue}
        />
      )}
      {eqtlRes?.eqtl_params?.CAGE_eqtl === "true" && (
        <TableTabs
          eqtlRes={eqtlRes}
          apiPath={apiPath}
          dataset={"Cage"}
          jobId={id}
          classes={classes}
        />
      )}
      {eqtlRes?.eqtl_params?.Westra_eqtl === "true" && (
        <TableTabs
          eqtlRes={eqtlRes}
          apiPath={apiPath}
          dataset={"Westra"}
          jobId={id}
          classes={classes}
        />
      )}
    </div>
  );
};

export default EqtlResultView;
