import React, { useState } from "react";
import {
  CircularProgress,
  IconButton,
  TableCell,
  TableRow,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import classes from "../ResultList/index.module.scss";
import { DeleteOutlineSharp } from "@material-ui/icons";
import { AnnotationResult } from "../ResultView";
import pgwasAxios from "../../../axios-fetches";
import {
  getErrorMessage,
  showToastError,
  showToastSuccess,
} from "../../utility/general_utils";

type Props = {
  item: AnnotationResult;
  page: number;
  rowsPerPage: number;
  link: string;
  getResults: (page: number, limit: number) => void;
};

const AnnotRow: React.FC<Props> = ({
  item,
  page,
  rowsPerPage,
  link,
  getResults,
}: Props) => {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteJob = (id: string) => {
    setDeleteLoading(true);
    pgwasAxios
      .delete(`/annot/jobs/${id}`)
      .then(() => {
        setDeleteLoading(false);
        showToastSuccess("Job deleted");
        getResults(page, rowsPerPage);
      })
      .catch((error) => {
        setDeleteLoading(false);
        showToastError(getErrorMessage(error));
      });
  };
  return (
    <TableRow key={item._id}>
      <TableCell>{item.job_name}</TableCell>
      <TableCell>{item.status}</TableCell>
      <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
      <TableCell>
        <Link to={link}>view</Link>
      </TableCell>
      <TableCell>
        {deleteLoading ? (
          <CircularProgress
            color="secondary"
            className={[classes.spinner, "progress"].join(" ")}
          />
        ) : (
          <IconButton
            onClick={() => {
              deleteJob(item._id);
            }}
            aria-label="delete"
          >
            <DeleteOutlineSharp />
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
};

export default AnnotRow;
