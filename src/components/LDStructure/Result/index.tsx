import React, { useEffect, useState } from 'react'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PageviewOutlinedIcon from '@material-ui/icons/PageviewOutlined';
import myclasses from "./index.module.scss";

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import fileDownload from 'js-file-download'
import pgwasAxios from "../../../axios-fetches";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    root: {
      width: '100%',
    },
    container: {
      maxHeight: '100%',
    }
  }),
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function LDStructureResult() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [outputFilepath, setOutputFilepath] = useState('');
  const [modalContent, setModalContent] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [tableHeader] = useState(['S/No', 'Job Name', 'Date Submitted', 'Status', 'Result', 'Delete']);

  useEffect(() => {
    getAllSubmittedJobs()
  }, [])
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClickOpen = (jobUniqueID: any, filepath: any,) => () => {
    setOpen(true);
    getFewContent(jobUniqueID);
    setOutputFilepath(filepath);
    // getJobInfo(jobUniqueID);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownload = () => {
    pgwasAxios
      .get('../' + outputFilepath, {
        responseType: 'blob',
      })
      .then((res: { data: any; }) => {
        fileDownload(res.data, 'LDStructureOutput.txt')
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  const getFewContent = (jobUniqueID: any) => {
    pgwasAxios
      .get('/ldstructure/jobs/' + jobUniqueID)
      .then((response: any) => {
        setModalContent(response.data);
      })
      .catch((error: any) => {
        alert(error);
      });
  }

  const getAllSubmittedJobs = () => {
    pgwasAxios
      .get('/ldstructure/jobs/')
      .then((response: any) => {
        setJobs(response.data)
      })
      .catch((error: any) => {
        alert(error);
      });
  }

  const deleteJob = (jobUniqueID: any) => {
    pgwasAxios
      .delete('/ldstructure/jobs/' + jobUniqueID)
      .then((response: any) => {
        setJobs(response.data)
      })
      .catch((error: any) => {
        alert(error);
      });
  }

  const renderTableHeader = () => {
    return (
      <TableHead>
        <TableRow id={myclasses.tableHead}>
          {tableHeader.map((header, index) => (
            <TableCell key={index}> {header.toUpperCase()} </TableCell>
          ))}
        </TableRow>
      </TableHead>
    )
  }

  const renderTableData = () => {
    let i = 1;
    return(
      <TableBody>
        {jobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((job: any) => {
          const { _id, jobName, jobUniqueID, dateSubmitted, status, outputFilepath } = job;
          return (
            <TableRow hover role="checkbox" tabIndex={-1} key={_id}>
              <TableCell>{i++}</TableCell>
              <TableCell>{jobName}</TableCell>
              <TableCell>{dateSubmitted.split("T")[0] + " " + dateSubmitted.split("T")[1].split(".")[0]}</TableCell>
              <TableCell>{status}</TableCell>
              <TableCell>
                <IconButton
                  aria-label="view"
                  color="primary"
                  disabled = {(status === 'COMPLETED') ? false : true}
                  onClick={handleClickOpen(jobUniqueID, outputFilepath)}>
                  <PageviewOutlinedIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton
                  aria-label="delete"
                  color="secondary"
                  onClick={() => { if (window.confirm('Are you sure you wish to delete this job ?')) deleteJob(jobUniqueID) }}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    );
  }

  const renderModal = () => {
    return (
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              LD Structure Output
              {/* LD Structure Output (Below is first 20 output. Click download to save complete output) */}
            </Typography>
            <Button autoFocus color="inherit" onClick={handleDownload}>
              Download
            </Button>
          </Toolbar>
        </AppBar>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              {renderModalHeader()}
              {renderModalContent()}
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={modalContent.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Dialog>
    );
  }

  const renderModalHeader = () => {
    let modalHeader:any = modalContent[0];
    return (
      <TableHead>
        <TableRow>
          <TableCell>S/No</TableCell>
          {modalHeader && modalHeader.split("\t").map((header:any, index: any) => (
            <TableCell key={index}> {header.toUpperCase()} </TableCell>
          ))}
        </TableRow>
      </TableHead>
    )
  }

  const renderModalContent = () => {
    let i = 1;
    return(
      <TableBody>
        {modalContent && modalContent.slice(1).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any, index:any) => {
          const rowArray = row.split("\t")
          return (
            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
              <TableCell>{i++}</TableCell>
              {rowArray && rowArray.map((content:any, index: any) => (
                <TableCell key={index}> {content} </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    );
  }

  return (
    <div>
      <h1 id={myclasses.title}>LD Structure Jobs</h1>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            {renderTableHeader()}
            {renderTableData()}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={jobs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <div>
          {renderModal()}
        </div>
      </Paper>
    </div>
  )
}

export default LDStructureResult