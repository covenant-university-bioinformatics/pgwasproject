import React, { useState } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { TableBody, TableCell, TableRow } from "@material-ui/core";
import useTable from "../../hooks/useTable";
import { getAllEmployees } from "./employeeService";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageContent: {
      margin: theme.spacing(5),
      padding: theme.spacing(3),
    },
  })
);

// generateData();

export default function FullWidthGrid() {
  const classes = useStyles();

  const [records, setRecord] = useState(getAllEmployees());
  const headCells = [
    { id: "fullName", label: "Employee Name", disableSorting: false },
    { id: "email", label: "Email Address (personal)", disableSorting: false },
    { id: "mobile", label: "Mobile Number", disableSorting: false },
    { id: "department", label: "Department", disableSorting: true },
  ];
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable(records, headCells);

  return (
    <div
      style={{
        marginTop: "15rem",
      }}
    >
      <Paper className={classes.pageContent}>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.mobile}</TableCell>
                <TableCell>{item.department}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
    </div>
  );
}
