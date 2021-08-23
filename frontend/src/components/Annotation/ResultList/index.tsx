import React, { useCallback, useEffect } from "react";
import useTable from "../../../hooks/useTable";
import { RouteComponentProps } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { CircularProgress, TableBody } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import classes from "./index.module.scss";
import { useActions } from "../../../hooks/useActions";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import AnnotRow from "../Row";

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

  const { loading, error, data, total } = useTypedSelector(
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

  useEffect(() => {
    getResults(page, rowsPerPage);
  }, [page, rowsPerPage, getResults]);

  return (
    <div className={classes.result_list}>
      {loading ? (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      ) : null}
      {error ? <div className={classes.error}>{error}</div> : null}
      <Paper className={[mclasses.pageContent, classes.paper].join(" ")}>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterSorting().map((item: any, index) => (
              <AnnotRow
                key={item._id}
                item={item}
                link={`/${props.match.url.split("/")[1]}/result_view/${
                  item._id
                }`}
                page={page}
                rowsPerPage={rowsPerPage}
                getResults={getResults}
              />
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
    </div>
  );
};

export default AnnotationResultList;
