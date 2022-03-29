import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import pgwasAxios from "../../../axios-fetches";
// import classes from "./index.module.scss";
import classes from "../../utility/result_view.module.scss";
import mainClasses from "./index.module.scss";
import { Button, CircularProgress } from "@material-ui/core";
import {
  createJobFailedReason,
  createJobStatus,
  createTableSection,
  getInfoSection,
} from "../../utility/general";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { GetAppRounded } from "@material-ui/icons";
import useTable from "../../../hooks/useTable";
import {
  createComponentTableHeaders,
  showToastError,
} from "../../utility/general_utils";

type Props = {};

type JobParam = {
  jobId: string;
};

type ImputationResult = {
  _id: string;
  jobUID: string;
  job_name: string;
  createdAt: string;
  inputFile: string;
  status: string;
  failed_reason: string;
  longJob: boolean;
  imputationFile: string;
  plotsFile: string;
  version: number;
  completionTime: Date;
  imputation_params: {
    id: string;
    version: number;
    useTest: boolean;
    marker_name: number;
    chr: number;
    pos: number;
    ref: number;
    alt: number;
    zscore: number;
    af?: number;
    af_available: boolean;
    ASW?: number;
    CEU?: number;
    CHB?: number;
    CHS?: number;
    CLM?: number;
    FIN?: number;
    GBR?: number;
    IBS?: number;
    JPT?: number;
    LWK?: number;
    MXL?: number;
    PUR?: number;
    TSI?: number;
    YRI?: number;
    chromosome: string;
    windowSize: number;
    wingSize: number;
    [key: string]: any;
  };
  [key: string]: any;
};

const ImputationResultView: React.FC<Props & RouteComponentProps<JobParam>> = (
  props
) => {
  const { user } = useTypedSelector((state) => state.auth);

  let apiPath = "";
  if (user?.username) {
    apiPath = "imputation";
  } else {
    apiPath = "imputation/noauth";
  }

  const reloadLimit = 60;
  const { jobId: id } = props.match.params;

  const [imputationRes, setImputationRes] = useState<
    ImputationResult | undefined
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

  const [imputationResults, setImputationResults] = useState<string[][]>([]);
  const [imputationResultHeader, setImputationResultHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingResults, setLoadingResults] = useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    imputationResults,
    imputationResultHeader,
    [10, 15, 20],
    imputationResults.length
  );

  const createImputationTableBody = (
    allines: string[],
    stateUpdateFunction: any
  ) => {
    const ddd = allines
      .filter((line) => line !== "")
      .slice(1)
      .map((list_string: string) => {
        const line = list_string.split(" ");
        if (line[10] === "0") {
          line[10] = "imputed";
        } else if (line[10] === "1") {
          line[10] = "Measured & Genotyped";
        } else if (line[10] === "2") {
          line[10] = "Not genotyped";
        }
        return line;
      });
    stateUpdateFunction(ddd);
  };

  const createInfoSection = () => {
    let paramsList;

    if (imputationRes) {
      if (imputationRes.imputation_params.af_available) {
        const toRemove = [
          "_id",
          "job",
          "createdAt",
          "updatedAt",
          "version",
          "id",
          "ASW",
          "CEU",
          "CHB",
          "CHS",
          "CLM",
          "FIN",
          "GBR",
          "IBS",
          "JPT",
          "LWK",
          "MXL",
          "PUR",
          "TSI",
          "YRI",
        ];

        const list = Object.keys(imputationRes.imputation_params).filter(
          (x) => !toRemove.includes(x)
        );

        paramsList = (
          <div className={classes.params_list}>
            <h3>Selected Parameters</h3>
            <ul>
              {list.map((element) => (
                <li key={element}>
                  <span>{element}</span>
                  <span>
                    {String(imputationRes.imputation_params[element])}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      } else if (!imputationRes.imputation_params.af_available) {
        const toRemove = [
          "_id",
          "job",
          "createdAt",
          "updatedAt",
          "version",
          "id",
          "af",
        ];

        const list = Object.keys(imputationRes.imputation_params).filter(
          (x) => !toRemove.includes(x)
        );

        paramsList = (
          <div className={classes.params_list}>
            <h3>Selected Parameters</h3>
            <ul>
              {list.map((element) => (
                <li key={element}>
                  <span>{element}</span>
                  <span>
                    {String(imputationRes.imputation_params[element])}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      }
      return (
        <div className={classes.info_section}>
          <h3 className={classes.sub_heading}>Job Information</h3>
          <div className={classes.info}>
            {getInfoSection(imputationRes, classes)}
            {paramsList}
          </div>
        </div>
      );
    }

    return null;
  };

  const createChartSection = () => {
    if (imputationRes && imputationRes.status === "completed") {
      const plot = (
        <div className={mainClasses.image_tab}>
          {/*<h3>Imputation Chart</h3>*/}
          <div className={mainClasses.image_box}>
            <img src={`/results${imputationRes!.plotsFile}`} alt="imputation" />
          </div>
        </div>
      );

      return (
        <div className={mainClasses.imputation_overview}>
          <h3 className={mainClasses.sub_heading}>Imputation Overview</h3>
          <div>{plot}</div>
        </div>
      );
    }
    return false;
  };

  const showDownloadButton = (download: string, title: string) => {
    if (
      imputationRes &&
      imputationRes.status === "completed" &&
      imputationRes[download]
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
              href={`/results${imputationRes[download]}`}
              target={"_blank"}
              download={"imputation.txt"}
            >
              Download {title} Results
            </Button>
          </div>
        </div>
      );
    }
    return false;
  };

  useEffect(() => {
    setLoading(true);
    pgwasAxios
      .get<ImputationResult>(`/${apiPath}/jobs/${id}`)
      .then((result) => {
        setImputationRes(result.data);
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
        setImputationRes(undefined);
        setLoading(false);
        setError(true);
        setErrorInfo(e.response.data.message);
        // clearInterval(interval.current);
        clearTimeout(timeout.current);
      });
  }, [id, reload, apiPath]);

  useEffect(() => {
    if (
      imputationRes &&
      !imputationRes.longJob &&
      (imputationRes.status === "running" || imputationRes.status === "queued")
    ) {
      if (seconds > 0) {
        timeout.current = setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(reloadLimit);
        setReload((prev) => prev + 1);
      }
    }
  }, [imputationRes, seconds]);

  useEffect(() => {
    return () => {
      // clearInterval(interval.current);
      clearTimeout(timeout.current);
    };
  }, []);

  //Gets file
  useEffect(() => {
    if (imputationRes && imputationRes.status === "completed") {
      if (imputationRes.imputationFile) {
        setLoadingResults(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${id}/imputationFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split(" ");
            createComponentTableHeaders(header, setImputationResultHeader);
            createImputationTableBody(alllines, setImputationResults);
            setLoadingResults(false);
          })
          .catch((error) => {
            // console.dir(error);
            showToastError(error?.response?.data?.message);
            setLoadingResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [imputationRes, id]);

  return (
    <div className={classes.result_view}>
      {loading ? <CircularProgress /> : null}
      {error && (
        <div className={classes.error_message}>
          {genMessage}
          {errorMessage}
        </div>
      )}
      {createJobStatus(imputationRes, seconds, classes)}
      <h2 style={{ marginBottom: "2rem" }}>
        Results for Job: {imputationRes ? imputationRes.job_name : id}
      </h2>
      {createInfoSection()}
      {createJobFailedReason(imputationRes, classes)}
      {createChartSection()}
      {imputationRes && imputationRes.status === "completed" && (
        <>
          {imputationRes.imputationFile && (
            <div className={classes.tables}>
              <h3 className={classes.sub_heading}>Imputation Result Table</h3>
              {showDownloadButton("imputationFile", "Imputation Results")}
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
                    imputationResults.length,
                    imputationRes,
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

export default ImputationResultView;
