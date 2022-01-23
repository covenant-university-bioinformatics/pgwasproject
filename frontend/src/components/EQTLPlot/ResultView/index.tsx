import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import pgwasAxios from "../../../axios-fetches";
import classes from "./index.module.scss";
// import classes from "../../utility/result_view.module.scss";
import { CircularProgress } from "@material-ui/core";
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

export type EqtlPlotResult = {
  _id: string;
  status: string;
  job_name: string;
  jobUID: string;
  inputFile: string;
  createdAt: string;
  EffectSizePlot: string;
  LocusPlot: string;
  failed_reason: string | undefined;
  longJob: string;
  completionTime: string;
  eqtlplot_params: {
    id: string;
    version: number;
    population: string;
    eqtl_summary: string;
    probe: string;
    probe_wind: string;
    gene_list: string;
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
    smr_thresh: string;
    heidi_thresh: string;
    plotWindow: string;
    max_anno_probe: string;
    [key: string]: any;
  };
  [key: string]: any;
};

const EqtlPlotResultView: React.FC<Props & RouteComponentProps<JobParam>> = (
  props
) => {
  const { user } = useTypedSelector((state) => state.auth);

  let apiPath = "";
  if (user?.username) {
    apiPath = "eqtlplot";
  } else {
    apiPath = "eqtlplot/noauth";
  }

  const reloadLimit = 60;
  const { jobId: id } = props.match.params;
  const [eqtlPlotRes, setEqtlPlotRes] = useState<EqtlPlotResult | undefined>(
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
    const toRemove = ["_id", "job", "createdAt", "updatedAt", "version", "id"];
    if (eqtlPlotRes) {
      const list = Object.keys(eqtlPlotRes.eqtlplot_params).filter(
        (x) => !toRemove.includes(x)
      );

      const paramsList = (
        <div className={classes.params_list}>
          <h3>Selected Parameters</h3>
          <ul>
            {list.map((element) => (
              <li key={element}>
                <span>{element}</span>
                <span>{String(eqtlPlotRes.eqtlplot_params[element])}</span>
              </li>
            ))}
          </ul>
        </div>
      );
      return (
        <div className={classes.info_section}>
          <h3 className={classes.sub_heading}>Job Information</h3>
          <div className={classes.info}>
            {getInfoSection(eqtlPlotRes, classes)}
            {paramsList}
          </div>
        </div>
      );
    }

    return false;
  };

  const createChartSection = () => {
    if (eqtlPlotRes && eqtlPlotRes.status === "completed") {
      const chartOne = (
        <div className={classes.image_tab}>
          <h3>Effect Size Plot</h3>
          <div className={classes.image_box}>
            <img
              src={`/results${eqtlPlotRes!.EffectSizePlot}`}
              alt="effect size plot"
            />
          </div>
        </div>
      );

      const chartTwo = (
        <div className={classes.image_tab}>
          <h3>Locus Plot</h3>
          <div className={classes.image_box}>
            <img src={`/results${eqtlPlotRes!.LocusPlot}`} alt="locus plot" />
          </div>
        </div>
      );

      return (
        <div className={classes.chart_section}>
          <h3 className={classes.sub_heading}>SMR Plots</h3>
          <div className={classes.images}>
            {chartOne}
            {chartTwo}
          </div>
        </div>
      );
    }
    return false;
  };

  // const showDownloadButton = (download: string, title: string) => {
  //   if (eqtlPlotRes && eqtlPlotRes.status === "completed") {
  //     return (
  //       <div className={classes.download}>
  //         <p>
  //           The table below have been chunked and pruned to allow for proper
  //           display. Use the buttons below to download the full files.
  //         </p>
  //         <div className={classes.buttons}>
  //           <Button
  //             variant="contained"
  //             color="primary"
  //             className={classes.button}
  //             endIcon={<GetAppRounded />}
  //             href={`/results${eqtlPlotRes[download]}`}
  //           >
  //             Download {title} Results
  //           </Button>
  //         </div>
  //       </div>
  //     );
  //   }
  //   return false;
  // };

  if (error) {
    genMessage = <p>Issue with fetching job with id: {id}</p>;
    errorMessage = <p>Message from server: {errorInfo}</p>;
  }

  useEffect(() => {
    setLoading(true);
    pgwasAxios
      .get<EqtlPlotResult>(`/${apiPath}/jobs/${id}`)
      .then((result) => {
        setEqtlPlotRes(result.data);
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
        setEqtlPlotRes(undefined);
        setLoading(false);
        setError(true);
        setErrorInfo(e.response.data);
        // clearInterval(interval.current);
        clearTimeout(timeout.current);
      });
  }, [id, reload, apiPath]);

  useEffect(() => {
    if (
      eqtlPlotRes &&
      !eqtlPlotRes.longJob &&
      (eqtlPlotRes.status === "running" || eqtlPlotRes.status === "queued")
    ) {
      if (seconds > 0) {
        timeout.current = setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(reloadLimit);
        setReload((prev) => prev + 1);
      }
    }
  }, [eqtlPlotRes, seconds]);

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
      {createJobStatus(eqtlPlotRes, seconds, classes)}
      <h2 style={{ marginBottom: "2rem" }}>
        Results for Job: {eqtlPlotRes ? eqtlPlotRes.job_name : id}
      </h2>
      {createTheInfoSection()}
      {createJobFailedReason(eqtlPlotRes, classes)}
      {createChartSection()}
    </div>
  );
};

export default EqtlPlotResultView;
