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

export type Loci2PathResult = {
  _id: string;
  status: string;
  job_name: string;
  jobUID: string;
  inputFile: string;
  createdAt: string;
  resultsFile: string;
  failed_reason: string | undefined;
  longJob: string;
  completionTime: string;
  loci2path_params: {
    id: string;
    version: number;
    chr: number;
    start_position: number;
    stop_position: number;
    tissue: string;
  };
  [key: string]: any;
};

const Loci2PathResultView: React.FC<Props & RouteComponentProps<JobParam>> = (
  props
) => {
  const { user } = useTypedSelector((state) => state.auth);

  let apiPath = "";
  if (user?.username) {
    apiPath = "loci2path";
  } else {
    apiPath = "loci2path/noauth";
  }

  const reloadLimit = 60;
  const { jobId: id } = props.match.params;
  const [loci2pathRes, setLoci2PathRes] = useState<Loci2PathResult | undefined>(undefined);
  const [errorInfo, setErrorInfo] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [seconds, setSeconds] = useState(reloadLimit);
  const timeout = useRef<any>(null);
  let errorMessage: any | null = null;
  let genMessage: any | null = null;

  const [loci2pathResults, setLoci2PathResults] = useState<string[][]>([]);
  const [loci2pathHeader, setLoci2PathHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingLoci2PathResults, setLoadingLoci2PathResults] = useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    loci2pathResults,
    loci2pathHeader,
    [10, 15, 20],
    loci2pathResults.length
  );

  const createLoci2PathHeaders = (headers: string[]) => {
    const dcd = headers.map((ele, i) => {
      return {
        id: ele.toLowerCase().replaceAll('"', ''),
        label: ele.replaceAll('"', ''),
        disableSorting: true,
      };
    });
    // dcd.unshift({ id: "123", label: "", disableSorting: true });
    // console.log(dcd);
    setLoci2PathHeader(dcd);
  };

  const createLoci2PathTableBody = (allines: string[]) => {
    const ddd = allines
      .filter((line) => line !== "")
      .slice(1)
      .map((list_string: string) => {
        return list_string.split("\t");
      });
    setLoci2PathResults(ddd);
  };

  const createTableSection = (
    TblContainer: React.FC,
    TblHead: React.FC,
    TblPagination: any,
    recordsAfterPaging: () => any[]
  ) => {
    if (
      loci2pathRes &&
      loci2pathRes.status === "completed" &&
      loci2pathResults.length > 0
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
    if (loci2pathRes && loci2pathRes.status === "completed") {
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
              href={`/results${loci2pathRes[download]}`}
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
    if (loci2pathRes && loci2pathRes.status === "completed") {
      return (
        <div className={classes.tables}>
          <h3 className={classes.sub_heading}>FineMapping Result Table</h3>
          {showDownloadButton("resultsFile", "Loci2Path")}
          <div className={classes.table_wrapper}>
            {loadingLoci2PathResults ? (
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
      .get<Loci2PathResult>(`/${apiPath}/jobs/${id}`)
      .then((result) => {
        setLoci2PathRes(result.data);
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
        setLoci2PathRes(undefined);
        setLoading(false);
        setError(true);
        setErrorInfo(e.response.data.message);
        // clearInterval(interval.current);
        clearTimeout(timeout.current);
      });
  }, [id, reload, apiPath]);

  useEffect(() => {
    if (
      loci2pathRes &&
      !loci2pathRes.longJob &&
      (loci2pathRes.status === "running" || loci2pathRes.status === "queued")
    ) {
      if (seconds > 0) {
        timeout.current = setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(reloadLimit);
        setReload((prev) => prev + 1);
      }
    }
  }, [loci2pathRes, seconds]);

  useEffect(() => {
    return () => {
      // clearInterval(interval.current);
      clearTimeout(timeout.current);
    };
  }, []);

  useEffect(() => {
    if (loci2pathRes && loci2pathRes.status === "completed") {
      if (loci2pathResults.length === 0) {
        setLoadingLoci2PathResults(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${id}/resultsFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createLoci2PathHeaders(header);
            createLoci2PathTableBody(alllines);
            setLoadingLoci2PathResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingLoci2PathResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [loci2pathRes, id]);

  return (
    <div className={classes.result_view}>
      {loading ? <CircularProgress /> : null}
      {error && (
        <div className={classes.error_message}>
          {genMessage}
          {errorMessage}
        </div>
      )}
      {createJobStatus(loci2pathRes, seconds, classes)}
      <h2 style={{ marginBottom: "2rem" }}>
        Results for Job: {loci2pathRes ? loci2pathRes.job_name : id}
      </h2>
      <CreateInfoSection
        resultObj={loci2pathRes}
        params={"loci2path_params"}
        classes={classes}
      />
      {createJobFailedReason(loci2pathRes, classes)}
      {showFocusTables()}
    </div>
  );
};

export default Loci2PathResultView;
