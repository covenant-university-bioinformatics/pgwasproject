import React, { useCallback, useEffect, useState } from "react";
import useTable from "../../../hooks/useTable";
import { RouteComponentProps } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { CircularProgress, TableBody } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import classes from "./index.module.scss";
import GeneBasedRow from "../../utility/Row";
import pgwasAxios from "../../../axios-fetches";
import { getErrorMessage } from "../../utility/general_utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageContent: {
      margin: theme.spacing(5),
      padding: theme.spacing(3),
    },
  })
);

type Props = {};

const GeneBasedResultList: React.FC<Props & RouteComponentProps> = (props) => {
  const mclasses = useStyles();

  const headCells = [
    { id: "name", label: "Job Name", disableSorting: false },
    { id: "status", label: "Job Status", disableSorting: false },
    { id: "created", label: "Created At", disableSorting: false },
    { id: "results", label: "Results", disableSorting: true },
    { id: "actions", label: "Actions", disableSorting: true },
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterSorting,
    page,
    rowsPerPage,
  } = useTable(data, headCells, [3, 6, 9], total);

  const getResults = useCallback((page: number, limit: number) => {
    setLoading(true);
    pgwasAxios
      .get(`/genebased/jobs?page=${page + 1}&limit=${limit}`)
      .then((response) => {
        setLoading(false);
        setData(response.data.data);
        setTotal(response.data.total);
      })
      .catch((error) => {
        setLoading(false);
        setError(getErrorMessage(error));
      });
  }, []);

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
            {data &&
              data.length > 0 &&
              recordsAfterSorting().map((item: any, index) => (
                <GeneBasedRow
                  key={item._id}
                  item={item}
                  link={`/${
                    props.match.url.split("/")[1]
                  }/genebased/result_view/${item._id}`}
                  page={page}
                  route={"genebased"}
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

export default GeneBasedResultList;
