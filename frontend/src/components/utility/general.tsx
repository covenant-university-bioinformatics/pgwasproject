import React from "react";
import { Link } from "react-router-dom";
import classes from "./general.module.scss";
import {
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from "@material-ui/core";
import { textErrorHelper } from "./general_utils";

type LogoProps = {
  link: boolean;
  linkTo: string;
  width: string;
  height: string;
  img: string;
};

export const Logo: React.FC<LogoProps> = (props) => {
  const template = (
    <div
      className={classes.img_cover}
      style={{
        width: props.width,
        height: props.height,
        // background: `url(${props.img}) no-repeat`,
      }}
    >
      <img className={classes.image_logo} src={props.img} alt="logo" />
    </div>
  );
  if (props.link) {
    return <Link to={props.linkTo}>{template}</Link>;
  } else {
    return template;
  }
};

export const generalFileForm = (
  classes: any,
  formik: any,
  formList: string[]
) => {
  // const formList = [
  //   "marker_name",
  //   "chromosome",
  //   "position",
  //   "pvalue",
  //   "effect_allele",
  //   "alternate_allele",
  //   "se",
  //   "or",
  //   "beta",
  // ];
  //variant="outlined" elevation={1}
  return formList.map((element, i) => {
    return (
      <Grid key={i} className={classes.grid} item xs={12} sm={6} md={4}>
        <Paper elevation={0} className={classes.paper}>
          <FormControl className={classes.formControl}>
            <TextField
              id={element}
              variant="outlined"
              label={element}
              size={"medium"}
              {...formik.getFieldProps(element)}
              {...textErrorHelper(formik, element)}
            />
          </FormControl>
        </Paper>
      </Grid>
    );
  });
};

// export const generalFileForm = (classes: any, formik: any) => {
//   return (
//     <>
//       <Grid item xs={4}>
//         <Paper variant="outlined" elevation={3} className={classes.paper}>
//           <FormControl className={classes.formControl}>
//             <TextField
//               id={"chromosome"}
//               variant="outlined"
//               label={"Chromosome"}
//               size={"large"}
//               {...formik.getFieldProps("chromosome")}
//               {...textErrorHelper(formik, "chromosome")}
//             />
//           </FormControl>
//         </Paper>
//       </Grid>
//       <Grid item xs={4}>
//         <Paper variant="outlined" elevation={3} className={classes.paper}>
//           xs=3
//         </Paper>
//       </Grid>
//       <Grid item xs={4}>
//         <Paper variant="outlined" elevation={3} className={classes.paper}>
//           xs=3
//         </Paper>
//       </Grid>
//       <Grid item xs={4}>
//         <Paper variant="outlined" elevation={3} className={classes.paper}>
//           xs=3
//         </Paper>
//       </Grid>
//       <Grid item xs={4}>
//         <Paper variant="outlined" elevation={3} className={classes.paper}>
//           xs=3
//         </Paper>
//       </Grid>
//       <Grid item xs={4}>
//         <Paper variant="outlined" elevation={3} className={classes.paper}>
//           xs=3
//         </Paper>
//       </Grid>
//       <Grid item xs={4}>
//         <Paper variant="outlined" elevation={3} className={classes.paper}>
//           xs=3
//         </Paper>
//       </Grid>
//       <Grid item xs={4}>
//         <Paper variant="outlined" elevation={3} className={classes.paper}>
//           xs=3
//         </Paper>
//       </Grid>
//       <Grid item xs={4}>
//         <Paper variant="outlined" elevation={3} className={classes.paper}>
//           xs=3
//         </Paper>
//       </Grid>
//     </>
//   );
// };

export const selectErrorHelper = (formik: any, values: string) => {
  if (formik.errors[values] && formik.touched[values]) {
    return <FormHelperText>{formik.errors[values]}</FormHelperText>;
  }
  return false;
};

export const createJobStatus = (data: any, seconds: number, classes: any) => {
  if (data && (data.status === "running" || data.status === "queued")) {
    return (
      <div className={classes.job_running}>
        <p>Job is currently {data.status}</p>
        {data.longJob ? (
          <p>
            This job may take a while to complete. Don't worry, an email will be
            sent to you when it is done.
          </p>
        ) : (
          <p>Time to next reload: {seconds}</p>
        )}
      </div>
    );
  } else {
    return null;
  }
};

export const getTotalTime = (data: any) => {
  if (data && data.completionTime && data.createdAt) {
    const timeOne = new Date(data.completionTime);
    const timeTwo = new Date(data.createdAt);
    let time = -1;
    if (timeOne && timeTwo) {
      // @ts-ignore
      time = (Math.abs(timeOne - timeTwo) / (1000 * 60)).toFixed(2);
    }
    return time;
  }
  return -1;
};

export const createInfoSection = (data: any, classes: any) => {
  if (data) {
    // const dbList = (
    //   <div className={classes.db_list}>
    //     <h3>Selected Databases</h3>
    //     <ul>
    //       <li>
    //         <span>Gene DB</span>
    //         <span>{String(annotRes.annot.gene_db)}</span>
    //       </li>
    //       <li>
    //         <span>Cytoband</span>
    //         <span>{String(annotRes.annot.cytoband)}</span>
    //       </li>
    //       <li>
    //         <span>Clinvar</span>
    //         <span>{String(annotRes.annot.clinvar)}</span>
    //       </li>
    //       <li>
    //         <span>Disgenet</span>
    //         <span>{String(annotRes.annot.disgenet)}</span>
    //       </li>
    //       <li>
    //         <span>EXAC</span> <span>{String(annotRes.annot.exac)}</span>
    //       </li>
    //       <li>
    //         <span>1KGP SAS</span>
    //         <span>{String(annotRes.annot.kgp_sas)}</span>
    //       </li>
    //       <li>
    //         <span>1KGP EUR</span>
    //         <span>{String(annotRes.annot.kgp_eur)}</span>
    //       </li>
    //       <li>
    //         <span>1KGP EAS</span>
    //         <span>{String(annotRes.annot.kgp_eas)}</span>
    //       </li>
    //       <li>
    //         <span>1KGP AMR</span>
    //         <span>{String(annotRes.annot.kgp_amr)}</span>
    //       </li>
    //       <li>
    //         <span>1KGP ALL</span>
    //         <span>{String(annotRes.annot.kgp_all)}</span>
    //       </li>
    //       <li>
    //         <span>1KGP AFR</span>
    //         <span>{String(annotRes.annot.kgp_afr)}</span>
    //       </li>
    //       <li>
    //         <span>Intervar</span>
    //         <span>{String(annotRes.annot.intervar)}</span>
    //       </li>
    //     </ul>
    //   </div>
    // );

    const jobList = (
      <div className={classes.job_list}>
        <h3>Job Details</h3>
        <ul>
          <li>
            <span>Job Name</span>
            <span>{String(data.job_name)}</span>
          </li>
          <li>
            <span>Job UID</span>
            <span>{String(data.jobUID)}</span>
          </li>
          <li>
            <span>Job Status</span>
            <span>{String(data.status)}</span>
          </li>
          <li>
            <span>Input File</span>
            <span>{String(data.inputFile).split("/")[5]}</span>
          </li>
          <li>
            <span>Created Date</span>
            <span>{new Date(data.createdAt).toLocaleString()}</span>
          </li>
          <li>
            <span>Completion Date</span>
            <span>
              {data.completionTime
                ? new Date(data.completionTime).toLocaleString()
                : "Pending"}
            </span>
          </li>
          <li>
            <span>Total time</span>
            <span>{getTotalTime(data)} minutes</span>
          </li>
        </ul>
      </div>
    );

    return (
      <div className={classes.info_section}>
        <h3 className={classes.sub_heading}>Job Information</h3>
        <div className={classes.info}>
          {jobList}
          {/*{dbList}*/}
        </div>
      </div>
    );
  }
  return false;
};

export const getInfoSection = (data: any, classes: any) => {
  if (data) {
    const jobList = (
      <div className={classes.job_list}>
        <h3>Job Details</h3>
        <ul>
          <li>
            <span>Job Name</span>
            <span>{String(data.job_name)}</span>
          </li>
          <li>
            <span>Job UID</span>
            <span>{String(data.jobUID)}</span>
          </li>
          <li>
            <span>Job Status</span>
            <span>{String(data.status)}</span>
          </li>
          <li>
            <span>Input File</span>
            <span>{String(data.inputFile).split("/")[5]}</span>
          </li>
          <li>
            <span>Created Date</span>
            <span>{new Date(data.createdAt).toLocaleString()}</span>
          </li>
          <li>
            <span>Completion Date</span>
            <span>
              {data.completionTime
                ? new Date(data.completionTime).toLocaleString()
                : "Pending"}
            </span>
          </li>
          <li>
            <span>Total time</span>
            <span>{getTotalTime(data)} minutes</span>
          </li>
        </ul>
      </div>
    );

    return jobList;
  }
  return false;
};

export const createJobFailedReason = (data: any, classes: any) => {
  if (data && data.failed_reason) {
    return (
      <div className={classes.error_message}>
        <p>Reason for failure: </p>
        <p>{data.failed_reason}</p>
      </div>
    );
  } else {
    return null;
  }
};

type Props = {
  resultObj: any;
  params: string;
  classes: any;
};

export const CreateInfoSection: React.FC<Props> = ({
  resultObj,
  params,
  classes,
}: Props) => {
  const toRemove = ["_id", "job", "createdAt", "updatedAt", "version", "id"];

  if (resultObj) {
    const list = Object.keys(resultObj[params]).filter(
      (x) => !toRemove.includes(x)
    );

    const paramsList = (
      <div className={classes.params_list}>
        <h3>Selected Parameters</h3>
        <ul>
          {list.map((element) => (
            <li key={element}>
              <span>{element}</span>
              <span>{String(resultObj[params][element])}</span>
            </li>
          ))}
        </ul>
      </div>
    );
    return (
      <div className={classes.info_section}>
        <h3 className={classes.sub_heading}>Job Information</h3>
        <div className={classes.info}>
          {getInfoSection(resultObj, classes)}
          {paramsList}
        </div>
      </div>
    );
  }

  return null;
};

export const createTableSection = (
  TblContainer: React.FC,
  TblHead: React.FC,
  TblPagination: any,
  recordsAfterPaging: () => any[],
  resultsObjLength: number,
  resultStatusObj: any,
  classes: any
) => {
  if (
    resultStatusObj &&
    resultStatusObj.status === "completed" &&
    resultsObjLength > 0
  ) {
    return (
      <div className={classes.table_section}>
        {/*<Paper className={mclasses.pageContent}>*/}
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPaging().map((item, index) => (
              <TableRow key={`row${index}`}>
                {item.map((element: string, idx: number) => (
                  <TableCell key={`idx${idx}`}>
                    {element === "."
                      ? "NA"
                      : element.length > 30
                      ? `${element.substr(0, 31)} ...`
                      : element}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
        {/*</Paper>*/}
      </div>
    );
  }
  return <p>No results for your data. Check if you used correct parameters.</p>;
};
