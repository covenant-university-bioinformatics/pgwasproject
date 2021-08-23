import React, { useEffect, useRef, useState } from "react";
import pgwasAxios from "../../../axios-fetches";
import useTable from "../../../hooks/useTable";
import { getErrorMessage, showToastError } from "../../utility/general_utils";
import classes from "./index.module.scss";
import { CircularProgress, TableBody } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Row from "../Row";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageContent: {
      margin: theme.spacing(5),
      padding: theme.spacing(3),
    },
  })
);
type Props = {};
export type LiftoverResult = {
  _id: string;
  job_name: string;
  status: string;
  createdAt: string;
  inputFile: string;
  outputFile: string;
  unliftedFile: string;
  failed_reason: string;
};

type axiosResponse = {
  count: number;
  total: number;
  data: LiftoverResult[];
  success: boolean;
  pagination: any;
};

const LiftoverResultList: React.FC<Props> = (props: Props) => {
  const reloadLimit = 15;
  const [liftoverRes, setLiftoverRes] = useState<LiftoverResult[]>([]);
  const [totalDocs, setTotalDocs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jobRunning, setJobRunning] = useState(false);
  // const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);
  const [seconds, setSeconds] = React.useState(reloadLimit);
  const timeout = useRef<any>(null);
  const mclasses = useStyles();

  const fetchResults = (page: number, rowsPerpage: number) => {
    pgwasAxios
      .get<axiosResponse>(
        `/liftover/jobs?page=${page + 1}&limit=${rowsPerPage}`
      )
      .then((result) => {
        setLiftoverRes(result.data.data);
        setTotalDocs(result.data.total);
        setLoading(false);
        // setError(false);
      })
      .catch((e) => {
        setLiftoverRes([]);
        setLoading(false);
        // setError(true);
        showToastError(getErrorMessage(e));
      });
  };

  const headCells = [
    { id: "arrow", label: "", disableSorting: true },
    { id: "name", label: "Job Name", disableSorting: false },
    { id: "status", label: "Job Status", disableSorting: false },
    { id: "created", label: "Created At", disableSorting: false },
    { id: "lifted", label: "Lifted Over", disableSorting: true },
    { id: "unlifted", label: "Unlifted", disableSorting: true },
    { id: "actions", label: "Actions", disableSorting: true },
  ];

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterSorting,
    page,
    rowsPerPage,
  } = useTable(liftoverRes, headCells, [3, 6, 9], totalDocs);

  useEffect(() => {
    setLoading(true);
    pgwasAxios
      .get<axiosResponse>(
        `/liftover/jobs?page=${page + 1}&limit=${rowsPerPage}`
      )
      .then((result) => {
        setLiftoverRes(result.data.data);
        setTotalDocs(result.data.total);
        setLoading(false);
        // setError(false);

        if (result.data.data.some((res) => res.status === "failed")) {
          showToastError(
            "One or more jobs failed, click on down arrow to see more information"
          );
        }

        const run = result.data.data.findIndex(
          (res) => res.status === "running"
        );
        const queue = result.data.data.findIndex(
          (res) => res.status === "queued"
        );

        if (run <= -1 && queue <= -1) {
          setJobRunning(false);
          clearTimeout(timeout.current);
        } else {
          setJobRunning(true);
        }
      })
      .catch((e) => {
        setLiftoverRes([]);
        setLoading(false);
        // setError(true);
        showToastError(getErrorMessage(e));
        clearTimeout(timeout.current);
        setJobRunning(false);
      });
  }, [page, rowsPerPage, reload]);

  useEffect(() => {
    if (
      liftoverRes.length > 0 &&
      liftoverRes.some(
        (res) => res.status === "running" || res.status === "queued"
      )
    ) {
      if (seconds > 0) {
        timeout.current = setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(reloadLimit);
        setReload((prev) => prev + 1);
      }
    }
  }, [liftoverRes, seconds]);

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  return (
    <>
      {jobRunning && (
        <div className={classes.job_running}>
          <p>One or more jobs are running</p>
          <p>Time to next reload: {seconds}</p>
        </div>
      )}
      <div className={classes.result_list}>
        {loading ? (
          <div className={classes.loading}>
            <CircularProgress />
          </div>
        ) : null}
        <Paper className={[mclasses.pageContent, classes.paper].join(" ")}>
          <TblContainer>
            <TblHead />
            <TableBody>
              {recordsAfterSorting().map((item: any, index) => (
                <Row
                  key={item._id}
                  item={item}
                  fetchResults={fetchResults}
                  page={page}
                  rowsPerPage={rowsPerPage}
                />
              ))}
            </TableBody>
          </TblContainer>
          <TblPagination />
        </Paper>
      </div>
    </>
  );
};

export default LiftoverResultList;
