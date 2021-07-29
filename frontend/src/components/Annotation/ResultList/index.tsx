import React, { useEffect, useState } from "react";
import useTable from "../../../hooks/useTable";
import { Link, RouteComponentProps } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  IconButton,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import classes from "./index.module.scss";
import pgwasAxios from "../../../axios-fetches";
import { DeleteOutlineSharp } from "@material-ui/icons";

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
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

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
  } = useTable(records, headCells, [3, 6, 9], total);

  console.log(records);
  console.log(page);
  console.log(rowsPerPage);
  console.log(props.match.url.split("/"));

  useEffect(() => {
    setLoading(true);
    pgwasAxios
      .get(`/annot/jobs?page=${page + 1}&limit=${rowsPerPage}`)
      .then((res) => {
        setLoading(false);
        setTotal(res.data.total);
        setRecords(res.data.data);
      })
      .catch((error) => {
        let message = "";
        if (Array.isArray(error.response.data.message)) {
          message = error.response.data.message.join("\n");
        } else {
          message = error.response.data.message;
        }
        setLoading(false);
        setError(message);
      });
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
                    to={`${props.match.url.split("/")[1]}/result_view?id=${
                      item._id
                    }`}
                  >
                    view
                  </Link>
                </TableCell>
                <TableCell>
                  <IconButton aria-label="delete">
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
