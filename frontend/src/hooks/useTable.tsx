import React, { useState } from "react";
import {
  Table,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

type TableProps = {};
type TableHeadProps = {
  // headCells: any[];
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      marginTop: theme.spacing(3),
      "& thead th": {
        fontWeight: "600",
        // color: theme.palette.primary.main,
        color: "#fff",
        backgroundColor: theme.palette.primary.light,
      },
      "& tbody td": {
        fontWeight: "bold",
      },
      "& tbody tr:hover": {
        backgroundColor: "#fffbf2",
        // cursor: "pointer",
      },
    },
  })
);
type Order = "asc" | "desc";

const useTable = (
  records: any[],
  headCells: any[],
  limit?: number[],
  count?: number
) => {
  const mclasses = useStyles();

  const pages = Array.isArray(limit) ? limit : [5, 10, 25]; //limit ranges
  const [page, setPage] = useState(0); //page
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]); //limit
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState("");
  const totalDocuments = count ? count : records.length;

  const TblContainer: React.FC<TableProps> = (props) => (
    <Table className={mclasses.table}>{props.children}</Table>
  );

  const TblHead: React.FC<TableHeadProps> = (props) => {
    const handleSortRequest = (cellId: string) => {
      const isAsc = orderBy === cellId && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(cellId);
    };
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              {headCell.disableSorting ? (
                headCell.label
              ) : (
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={() => {
                    handleSortRequest(headCell.id);
                  }}
                >
                  {headCell.label}
                </TableSortLabel>
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const TblPagination = () => (
    <TablePagination
      component="div"
      count={totalDocuments}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={pages}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );

  function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
  ) => number {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const recordsAfterPagingAndSorting = () => {
    return stableSort(records, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );
  };

  const recordsAfterSorting = () => {
    return stableSort(records, getComparator(order, orderBy));
  };

  return {
    TblContainer,
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting,
    recordsAfterSorting,
    page,
    rowsPerPage,
  };
};

export default useTable;
