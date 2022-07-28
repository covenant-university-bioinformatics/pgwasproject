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

export type FocusResult = {
  _id: string;
  status: string;
  job_name: string;
  jobUID: string;
  inputFile: string;
  createdAt: string;
  focusResultsFile: string;
  focusManhattanPlot: string;
  focusQQPlot: string;
  failed_reason: string | undefined;
  longJob: string;
  completionTime: string;
  focus_params: {
    id: string;
    version: number;
    marker_name: number;
    chr: number;
    position: number;
    effect_allele: number;
    alternate_allele: number;
    freq: number;
    beta: number;
    se: number;
    p_value: number;
    sample_size: number;
    locations: string;
    population: string;
    chromosome: string;
    all_gwas_sig: string;
    p_threshold: number;
    ridge_term: number;
    intercept: string;
    max_genes: number;
    prior_prob: string;
    credible_level: number;
    min_r2pred: number;
    max_impute: number;
    plot: string;
    tissue: string;
    start: string;
    stop: string;
  };
  [key: string]: any;
};

const FocusResultView: React.FC<Props & RouteComponentProps<JobParam>> = (
  props
) => {
  const { user } = useTypedSelector((state) => state.auth);

  let apiPath = "";
  if (user?.username) {
    apiPath = "focus";
  } else {
    apiPath = "focus/noauth";
  }

  const reloadLimit = 60;
  const { jobId: id } = props.match.params;
  const [focusRes, setFocusRes] = useState<FocusResult | undefined>(undefined);
  const [errorInfo, setErrorInfo] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [seconds, setSeconds] = useState(reloadLimit);
  const timeout = useRef<any>(null);
  let errorMessage: any | null = null;
  let genMessage: any | null = null;

  const [focusResults, setFocusResults] = useState<string[][]>([]);
  const [focusHeader, setFocusHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingFocusResults, setLoadingFocusResults] = useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    focusResults,
    focusHeader,
    [10, 15, 20],
    focusResults.length
  );

  const createChartSection = () => {
    if (focusRes && focusRes.status === "completed") {
      const chartOne = (
        <div className={classes.image_tab}>
          <h3>Manhattan Plot</h3>
          <div className={classes.image_box}>
            <img
              src={`/results${focusRes!.focusManhattanPlot}`}
              alt="Manhattan plot"
            />
          </div>
        </div>
      );

      const chartTwo = (
        <div className={classes.image_tab}>
          <h3>QQ plot</h3>
          <div className={classes.image_box}>
            <img src={`/results${focusRes!.focusQQPlot}`} alt="QQ plot" />
          </div>
        </div>
      );

      return (
        <div className={classes.chart_section}>
          <h3 className={classes.sub_heading}>Summary Statistics Overview</h3>
          <div className={classes.images}>
            {chartOne}
            {chartTwo}
          </div>
        </div>
      );
    }
    return false;
  };

  const createFocusHeaders = (headers: string[]) => {
    const dcd = headers.map((ele, i) => {
      return {
        id: ele.toLowerCase(),
        label: ele,
        disableSorting: true,
      };
    });
    // dcd.unshift({ id: "123", label: "", disableSorting: true });
    setFocusHeader(dcd);
  };

  const createFocusTableBody = (allines: string[]) => {
    const ddd = allines
      .filter((line) => line !== "")
      .slice(1)
      .map((list_string: string) => {
        return list_string.split("\t");
      });
    setFocusResults(ddd);
  };

  const createTableSection = (
    TblContainer: React.FC,
    TblHead: React.FC,
    TblPagination: any,
    recordsAfterPaging: () => any[]
  ) => {
    if (
      focusRes &&
      focusRes.status === "completed" &&
      focusResults.length > 0
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

  const showDownloadButton = (download: string, title: string) => {
    if (focusRes && focusRes.status === "completed") {
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
              href={`/results${focusRes[download]}`}
            >
              Download {title} Results
            </Button>
          </div>
        </div>
      );
    }
    return false;
  };

  const showFocusTables = () => {
    if (focusRes && focusRes.status === "completed") {
      return (
        <div className={classes.tables}>
          <h3 className={classes.sub_heading}>FineMapping Result Table</h3>
          {showDownloadButton("focusResultsFile", "FineMapping")}
          <div className={classes.table_wrapper}>
            {loadingFocusResults ? (
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
      .get<FocusResult>(`/${apiPath}/jobs/${id}`)
      .then((result) => {
        setFocusRes(result.data);
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
        setFocusRes(undefined);
        setLoading(false);
        setError(true);
        setErrorInfo(e.response.data.message);
        // clearInterval(interval.current);
        clearTimeout(timeout.current);
      });
  }, [id, reload, apiPath]);

  useEffect(() => {
    if (
      focusRes &&
      !focusRes.longJob &&
      (focusRes.status === "running" || focusRes.status === "queued")
    ) {
      if (seconds > 0) {
        timeout.current = setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(reloadLimit);
        setReload((prev) => prev + 1);
      }
    }
  }, [focusRes, seconds]);

  useEffect(() => {
    return () => {
      // clearInterval(interval.current);
      clearTimeout(timeout.current);
    };
  }, []);

  useEffect(() => {
    if (focusRes && focusRes.status === "completed") {
      if (focusResults.length === 0) {
        setLoadingFocusResults(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${id}/focusResultsFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createFocusHeaders(header);
            createFocusTableBody(alllines);
            setLoadingFocusResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingFocusResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [focusRes, id]);

  return (
    <div className={classes.result_view}>
      {loading ? <CircularProgress /> : null}
      {error && (
        <div className={classes.error_message}>
          {genMessage}
          {errorMessage}
        </div>
      )}
      {createJobStatus(focusRes, seconds, classes)}
      <h2 style={{ marginBottom: "2rem" }}>
        Results for Job: {focusRes ? focusRes.job_name : id}
      </h2>
      <CreateInfoSection
        resultObj={focusRes}
        params={"focus_params"}
        classes={classes}
      />
      {createJobFailedReason(focusRes, classes)}
      {createChartSection()}
      {showFocusTables()}
    </div>
  );
};

export default FocusResultView;
