import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import pgwasAxios from "../../../axios-fetches";
import classes from "./index.module.scss";
import useTable from "../../../hooks/useTable";
import { Button, CircularProgress, TableBody } from "@material-ui/core";
import ListRow from "../../utility/RowExtra";
import { GetAppRounded } from "@material-ui/icons";
import {
  createInfoSection,
  createJobFailedReason,
  createJobStatus,
} from "../../utility/general";
import { createScoresObject } from "../../utility/general_utils";

type Props = {};
type JobParam = {
  jobId: string;
};

export type DeletResult = {
  _id: string;
  status: string;
  job_name: string;
  jobUID: string;
  inputFile: string;
  createdAt: string;
  outputFile: string;
  exon_plot: string;
  failed_reason: string | undefined;
  longJob: string;
  completionTime: string;
};

const DeleteriousnessResultView: React.FC<
  Props & RouteComponentProps<JobParam>
> = (props) => {
  const reloadLimit = 60;
  const { jobId: id } = props.match.params;
  const [deletRes, setDeletRes] = useState<DeletResult | undefined>(undefined);
  const [error, setError] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");
  const [reload, setReload] = useState(0);
  const [seconds, setSeconds] = useState(reloadLimit);
  const [loading, setLoading] = useState(false);
  const timeout = useRef<any>(null);
  let errorMessage: any | null = null;
  let genMessage: any | null = null;

  const [snpResults, setSnpResults] = useState<string[][]>([]);
  const [snpHeader, setSnpHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [deletScores, setDeletScores] = useState<
    (
      | {
          name: string;
          score: string;
          rank_score: string;
          prediction: string;
        }[]
      | null
    )[]
  >([]);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    snpResults,
    snpHeader,
    [10, 15, 20],
    snpResults.length
  );

  const createHeaders = (headers: string[]) => {
    const deletHead = headers.slice(0, 9);
    deletHead.push(headers[headers.length - 1]);
    const dcd = deletHead.map((ele, i) => {
      return {
        id: ele.toLowerCase(),
        label: ele,
        disableSorting: true,
      };
    });
    dcd.unshift({ id: "123", label: "", disableSorting: true });
    setSnpHeader(dcd);
  };

  const getScores = (headers: string[], allines: string[]) => {
    const deletHead = headers.slice(10);
    deletHead.splice(-1);

    const deletBody = allines.slice(1).map((list_string: string) => {
      const list = list_string.split("\t");
      const temp = list.slice(10);
      temp.splice(-1);
      return temp;
    });

    const result = createScoresObject(deletHead, deletBody);
    setDeletScores(result);
  };

  const createTableBody = (allines: string[]) => {
    const ddd = allines
      .filter((line) => line !== "")
      .slice(1)
      .map((list_string: string) => {
        const list = list_string.split("\t");
        const temp = list.slice(0, 9);
        temp.push(list[list.length - 1]);
        return temp;
      });
    setSnpResults(ddd);
  };

  const createTableSection = (
    TblContainer: React.FC,
    TblHead: React.FC,
    TblPagination: any,
    recordsAfterPaging: () => any[]
  ) => {
    if (snpResults.length > 0) {
      return (
        <div className={classes.table_section}>
          {/*<Paper className={mclasses.pageContent}>*/}
          <TblContainer>
            <TblHead />
            <TableBody>
              {recordsAfterPaging().map((item, index) => (
                <ListRow
                  key={`row${index}`}
                  item={item}
                  scores={deletScores[index]}
                />
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

  const showDownloadButton = () => {
    if (deletRes && deletRes.status === "completed") {
      return (
        <div className={classes.download}>
          <p>
            The tables below have been chunked and pruned to allow for proper
            display. Use the buttons below to download the full files.
          </p>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              endIcon={<GetAppRounded />}
              href={`/results${deletRes.outputFile}`}
            >
              Download Deleteriousness Results
            </Button>
          </div>
        </div>
      );
    }
    return null;
  };

  const createChartSection = () => {
    if (deletRes && deletRes.status === "completed") {
      const exons = (
        <div className={classes.image_tab}>
          <h3>Exon Locations</h3>
          <div className={classes.image_box}>
            <img src={`/results${deletRes!.exon_plot}`} alt="exon plot" />
          </div>
        </div>
      );

      return (
        <div className={classes.delet_overview}>
          <h3 className={classes.sub_heading}>Data Overview</h3>
          <div>{exons}</div>
        </div>
      );
    }
    return false;
  };

  const showTables = () => {
    return (
      <div className={classes.tables}>
        <h3 className={classes.sub_heading}>Deleteriousness Result Table</h3>
        {showDownloadButton()}
        <div className={classes.table_wrapper}>
          {loadingResults ? (
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
  };

  if (error) {
    genMessage = <p>Issue with fetching job with id: {id}</p>;
    errorMessage = <p>Message from server: {errorInfo}</p>;
  }

  useEffect(() => {
    setLoading(true);
    pgwasAxios
      .get<DeletResult>(`/delet/jobs/${id}`)
      .then((result) => {
        setDeletRes(result.data);
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
        setDeletRes(undefined);
        setLoading(false);
        setError(true);
        setErrorInfo(e.response.data.message);
        // clearInterval(interval.current);
        clearTimeout(timeout.current);
      });
  }, [id, reload]);

  useEffect(() => {
    if (
      deletRes &&
      !deletRes.longJob &&
      (deletRes.status === "running" || deletRes.status === "queued")
    ) {
      if (seconds > 0) {
        timeout.current = setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(reloadLimit);
        setReload((prev) => prev + 1);
      }
    }
  }, [deletRes, seconds]);

  useEffect(() => {
    return () => {
      // clearInterval(interval.current);
      clearTimeout(timeout.current);
    };
  }, []);

  useEffect(() => {
    if (deletRes && deletRes.status === "completed") {
      if (snpResults.length === 0) {
        setLoadingResults(true);
        pgwasAxios
          .get(`/delet/jobs/output/${id}/outputFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createHeaders(header);
            createTableBody(alllines);
            getScores(header, alllines);
            setLoadingResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [deletRes, id]);

  return (
    <div className={classes.result_view}>
      {loading ? <CircularProgress /> : null}
      {error && (
        <div className={classes.error_message}>
          {genMessage}
          {errorMessage}
        </div>
      )}
      {createJobStatus(deletRes, seconds, classes)}
      <h2 style={{ marginBottom: "2rem" }}>
        Results for Job: {deletRes ? deletRes.job_name : id}
      </h2>
      {createInfoSection(deletRes, classes)}
      {createJobFailedReason(deletRes, classes)}
      {createChartSection()}
      {showTables()}
    </div>
  );
};

export default DeleteriousnessResultView;
