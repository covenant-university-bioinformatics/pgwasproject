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

export type TseaDBResult = {
  _id: string;
  status: string;
  job_name: string;
  jobUID: string;
  inputFile: string;
  createdAt: string;
  tseaResultsFile: string;
  failed_reason: string | undefined;
  longJob: string;
  completionTime: string;
  tsea_params: {
    id: string;
    version: number;
    genes: string;
    analysisType: string;
    reference_panel: string;
    ratio: string;
    p_adjust_method: string;
  };
  [key: string]: any;
};

const TseaDBResultView: React.FC<Props & RouteComponentProps<JobParam>> = (
  props
) => {
  const { user } = useTypedSelector((state) => state.auth);

  let apiPath = "";
  if (user?.username) {
    apiPath = "tseadb";
  } else {
    apiPath = "tseadb/noauth";
  }

  const reloadLimit = 60;
  const { jobId: id } = props.match.params;
  const [tseaRes, setTseaRes] = useState<TseaDBResult | undefined>(undefined);
  const [errorInfo, setErrorInfo] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [seconds, setSeconds] = useState(reloadLimit);
  const timeout = useRef<any>(null);
  let errorMessage: any | null = null;
  let genMessage: any | null = null;

  const [tseaResults, setTseaResults] = useState<string[][]>([]);
  const [tseaHeader, setTseaHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingTseaResults, setLoadingTseaResults] = useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    tseaResults,
    tseaHeader,
    [10, 15, 20],
    tseaResults.length
  );


  const createTseaHeaders = (headers: string[]) => {
    const dcd = headers.map((ele, i) => {
      return {
        id: ele.toLowerCase(),
        label: ele,
        disableSorting: true,
      };
    });
    // dcd.unshift({ id: "123", label: "", disableSorting: true });
    setTseaHeader(dcd);
  };

  const createTseaTableBody = (allines: string[]) => {
    const ddd = allines
      .filter((line) => line !== "")
      .slice(1)
      .map((list_string: string) => {
        return list_string.split("\t");
      });
    setTseaResults(ddd);
  };

  const createTableSection = (
    TblContainer: React.FC,
    TblHead: React.FC,
    TblPagination: any,
    recordsAfterPaging: () => any[]
  ) => {
    if (
      tseaRes &&
      tseaRes.status === "completed" &&
      tseaResults.length > 0
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
    if (tseaRes && tseaRes.status === "completed") {
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
              href={`/results${tseaRes[download]}`}
            >
              Download {title} Results
            </Button>
          </div>
        </div>
      );
    }
    return false;
  };

  const showTseaTables = () => {
    if (tseaRes && tseaRes.status === "completed") {
      return (
        <div className={classes.tables}>
          <h3 className={classes.sub_heading}>FineMapping Result Table</h3>
          {showDownloadButton("tseaResultsFile", "TSEA Result File")}
          <div className={classes.table_wrapper}>
            {loadingTseaResults ? (
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
      .get<TseaDBResult>(`/${apiPath}/jobs/${id}`)
      .then((result) => {
        setTseaRes(result.data);
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
        setTseaRes(undefined);
        setLoading(false);
        setError(true);
        setErrorInfo(e.response.data.message);
        // clearInterval(interval.current);
        clearTimeout(timeout.current);
      });
  }, [id, reload, apiPath]);

  useEffect(() => {
    if (
      tseaRes &&
      !tseaRes.longJob &&
      (tseaRes.status === "running" || tseaRes.status === "queued")
    ) {
      if (seconds > 0) {
        timeout.current = setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(reloadLimit);
        setReload((prev) => prev + 1);
      }
    }
  }, [tseaRes, seconds]);

  useEffect(() => {
    return () => {
      // clearInterval(interval.current);
      clearTimeout(timeout.current);
    };
  }, []);

  useEffect(() => {
    if (tseaRes && tseaRes.status === "completed") {
      if (tseaResults.length === 0) {
        setLoadingTseaResults(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${id}/focusResultsFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createTseaHeaders(header);
            createTseaTableBody(alllines);
            setLoadingTseaResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingTseaResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [tseaRes, id]);

  return (
    <div className={classes.result_view}>
      {loading ? <CircularProgress /> : null}
      {error && (
        <div className={classes.error_message}>
          {genMessage}
          {errorMessage}
        </div>
      )}
      {createJobStatus(tseaRes, seconds, classes)}
      <h2 style={{ marginBottom: "2rem" }}>
        Results for Job: {tseaRes ? tseaRes.job_name : id}
      </h2>
      <CreateInfoSection
        resultObj={tseaRes}
        params={"tsea_params"}
        classes={classes}
      />
      {createJobFailedReason(tseaRes, classes)}
      {showTseaTables()}
    </div>
  );
};

export default TseaDBResultView;
