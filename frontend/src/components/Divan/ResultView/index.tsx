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

export type DivanResult = {
  _id: string;
  status: string;
  job_name: string;
  jobUID: string;
  inputFile: string;
  createdAt: string;
  divanResultsFile: string;
  failed_reason: string | undefined;
  longJob: string;
  completionTime: string;
  divan_params: {
    id: string;
    version: number;
    marker_name?: number;
    chr?: number;
    start_position?: number;
    stop_position?: number
    variant_type: string;
    disease: string;
    variant_db?: string;
    input_type: string;
  };
  [key: string]: any;
};

const DivanResultView: React.FC<Props & RouteComponentProps<JobParam>> = (
  props
) => {
  const { user } = useTypedSelector((state) => state.auth);

  let apiPath = "";
  if (user?.username) {
    apiPath = "divan";
  } else {
    apiPath = "divan/noauth";
  }

  const reloadLimit = 60;
  const { jobId: id } = props.match.params;
  const [divanRes, setDivanRes] = useState<DivanResult | undefined>(undefined);
  const [errorInfo, setErrorInfo] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [seconds, setSeconds] = useState(reloadLimit);
  const timeout = useRef<any>(null);
  let errorMessage: any | null = null;
  let genMessage: any | null = null;

  const [divanResults, setDivanResults] = useState<string[][]>([]);
  const [divanHeader, setDivanHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingDivanResults, setLoadingDivanResults] = useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    divanResults,
    divanHeader,
    [10, 15, 20],
    divanResults.length
  );

  const createDivanHeaders = (headers: string[]) => {
    const dcd = headers.map((ele, i) => {
      return {
        id: ele.toLowerCase(),
        label: ele,
        disableSorting: true,
      };
    });
    // dcd.unshift({ id: "123", label: "", disableSorting: true });
    setDivanHeader(dcd);
  };

  const createDivanTableBody = (allines: string[]) => {
    const ddd = allines
      .filter((line) => line !== "")
      .slice(1)
      .map((list_string: string) => {
        return list_string.split("\t");
      });
    setDivanResults(ddd);
  };

  const createTableSection = (
    TblContainer: React.FC,
    TblHead: React.FC,
    TblPagination: any,
    recordsAfterPaging: () => any[]
  ) => {
    if (
      divanRes &&
      divanRes.status === "completed" &&
      divanResults.length > 0
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
    if (divanRes && divanRes.status === "completed") {
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
              href={`/results${divanRes[download]}`}
            >
              Download {title} Results
            </Button>
          </div>
        </div>
      );
    }
    return false;
  };

  const showDivanTables = () => {
    if (divanRes && divanRes.status === "completed") {
      return (
        <div className={classes.tables}>
          <h3 className={classes.sub_heading}>DIVAN Result Table</h3>
          {showDownloadButton("divanResultsFile", "Divan")}
          <div className={classes.table_wrapper}>
            {loadingDivanResults ? (
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
      .get<DivanResult>(`/${apiPath}/jobs/${id}`)
      .then((result) => {
        setDivanRes(result.data);
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
        setDivanRes(undefined);
        setLoading(false);
        setError(true);
        setErrorInfo(e.response.data.message);
        // clearInterval(interval.current);
        clearTimeout(timeout.current);
      });
  }, [id, reload, apiPath]);

  useEffect(() => {
    if (
      divanRes &&
      !divanRes.longJob &&
      (divanRes.status === "running" || divanRes.status === "queued")
    ) {
      if (seconds > 0) {
        timeout.current = setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(reloadLimit);
        setReload((prev) => prev + 1);
      }
    }
  }, [divanRes, seconds]);

  useEffect(() => {
    return () => {
      // clearInterval(interval.current);
      clearTimeout(timeout.current);
    };
  }, []);

  useEffect(() => {
    if (divanRes && divanRes.status === "completed") {
      if (divanResults.length === 0) {
        setLoadingDivanResults(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${id}/divanResultsFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createDivanHeaders(header);
            createDivanTableBody(alllines);
            setLoadingDivanResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingDivanResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [divanRes, id]);

  return (
    <div className={classes.result_view}>
      {loading ? <CircularProgress /> : null}
      {error && (
        <div className={classes.error_message}>
          {genMessage}
          {errorMessage}
        </div>
      )}
      {createJobStatus(divanRes, seconds, classes)}
      <h2 style={{ marginBottom: "2rem" }}>
        Results for Job: {divanRes ? divanRes.job_name : id}
      </h2>
      <CreateInfoSection
        resultObj={divanRes}
        params={"divan_params"}
        classes={classes}
      />
      {createJobFailedReason(divanRes, classes)}
      {showDivanTables()}
    </div>
  );
};

export default DivanResultView;
