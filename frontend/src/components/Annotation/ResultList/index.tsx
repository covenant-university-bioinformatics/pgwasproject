import React, { useCallback, useEffect, useState } from "react";
import useTable from "../../../hooks/useTable";
import { Link, RouteComponentProps } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  CircularProgress,
  IconButton,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";
import pgwasAxios from "../../../axios-fetches";
import Paper from "@material-ui/core/Paper";
import classes from "./index.module.scss";
import { DeleteOutlineSharp } from "@material-ui/icons";
import { useActions } from "../../../hooks/useActions";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { showToastError } from "../../utility/general_utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageContent: {
      margin: theme.spacing(5),
      padding: theme.spacing(3),
    },
  })
);

type Props = {};

const AnnotationResultList: React.FC<Props & RouteComponentProps> = (props) => {
  const mclasses = useStyles();
  const { getAnnotationResults } = useActions();

  const getResults = useCallback(
    (page: number, limit: number) => {
      getAnnotationResults(page, limit);
    },
    [getAnnotationResults]
  );

  const { loading, error, success, data, total } = useTypedSelector(
    (state) => state.annot
  );

  const headCells = [
    { id: "name", label: "Job Name", disableSorting: false },
    { id: "status", label: "Job Status", disableSorting: false },
    { id: "created", label: "Created At", disableSorting: false },
    { id: "results", label: "Results", disableSorting: true },
    { id: "actions", label: "Actions", disableSorting: true },
  ];

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterSorting,
    page,
    rowsPerPage,
  } = useTable(data, headCells, [3, 6, 9], total);

  console.log(data);
  console.log(page);
  console.log(rowsPerPage);

  const deleteJob = (id: string) => {
    pgwasAxios
      .delete(`/annot/jobs/${id}`)
      .then(() => {
        getResults(page, rowsPerPage);
      })
      .catch((error) => {
        console.log(error.response.data);
        let message = "";
        if (Array.isArray(error.response.data.message)) {
          message = error.response.data.message.join("\n");
        } else {
          message = error.response.data.message;
        }
        showToastError(message);
      });
  };

  useEffect(() => {
    getResults(page, rowsPerPage);
  }, [page, rowsPerPage]);

  return (
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
              <TableRow key={item._id}>
                <TableCell>{item.job_name}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Link
                    to={`/${props.match.url.split("/")[1]}/result_view/${
                      item._id
                    }`}
                  >
                    view
                  </Link>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      deleteJob(item._id);
                    }}
                    aria-label="delete"
                  >
                    <DeleteOutlineSharp />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
      {error ? <div className={classes.error}>{error}</div> : null}
    </div>
  );
};

export default AnnotationResultList;
