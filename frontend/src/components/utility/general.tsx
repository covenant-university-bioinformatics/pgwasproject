import React from "react";
import { Link } from "react-router-dom";
import classes from "./general.module.scss";
import {
  FormControl,
  FormHelperText,
  Grid,
  Paper,
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

export const generalFileForm = (classes: any, formik: any) => {
  const formList = [
    "marker_name",
    "chromosome",
    "position",
    "pvalue",
    "effect_allele",
    "alternate_allele",
    "se",
    "or",
    "beta",
  ];
  //variant="outlined" elevation={1}
  return formList.map((element, i) => {
    return (
      <Grid key={i} className={classes.grid} item xs={4}>
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
