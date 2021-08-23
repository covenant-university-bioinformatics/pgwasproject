import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core";
import {
  DeleteOutlineSharp,
  GetAppRounded,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@material-ui/icons";
import classes from "../ResultList/index.module.scss";
import { LiftoverResult } from "../ResultList";
import pgwasAxios from "../../../axios-fetches";
import {
  getErrorMessage,
  showToastError,
  showToastSuccess,
} from "../../utility/general_utils";

type Props = {
  item: LiftoverResult;
  page: number;
  rowsPerPage: number;
  fetchResults: (page: number, rowsPerPage: number) => void;
};

const Row: React.FC<Props> = ({
  item,
  fetchResults,
  rowsPerPage,
  page,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteJob = (id: string) => {
    setDeleteLoading(true);
    pgwasAxios
      .delete(`/liftover/jobs/${id}`)
      .then((data) => {
        console.log(data);
        setDeleteLoading(true);
        showToastSuccess("Job deleted");
        fetchResults(page, rowsPerPage);
      })
      .catch((error) => {
        let message = getErrorMessage(error);
        setDeleteLoading(true);
        showToastError(message);
      });
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{item.job_name}</TableCell>
        <TableCell>{item.status}</TableCell>
        <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
        <TableCell>
          {item.outputFile ? (
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              endIcon={<GetAppRounded />}
              href={`/results${item.outputFile}`}
            >
              Download
            </Button>
          ) : (
            "Pending"
          )}
        </TableCell>
        <TableCell>
          {item.unliftedFile ? (
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              endIcon={<GetAppRounded />}
              href={`/results${item.unliftedFile}`}
            >
              Download
            </Button>
          ) : (
            "Pending"
          )}
        </TableCell>
        <TableCell>
          {deleteLoading ? (
            <CircularProgress
              color="secondary"
              className={[classes.spinner, "progress"].join(" ")}
            />
          ) : (
            <IconButton onClick={() => deleteJob(item._id)} aria-label="delete">
              <DeleteOutlineSharp />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Job ID: {item._id}
              </Typography>
              <p>Filename: {String(item.inputFile).split("/")[5]}</p>
              <p>Failure reason: {item.failed_reason || "None"}</p>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
