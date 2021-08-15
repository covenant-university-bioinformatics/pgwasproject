import React, { useRef, useState } from "react";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import classes from "./index.module.scss";
import {
  generalFormValidationObject,
  selectIsError,
  textErrorHelper,
} from "../../utility/general_utils";
import {
  Button,
  FormControl,
  Grid,
  Hidden,
  InputLabel,
  NativeSelect,
  Paper,
  TextField,
} from "@material-ui/core";
import { generalFileForm, selectErrorHelper } from "../../utility/general";
import { PlayArrow, DeleteOutlineSharp } from "@material-ui/icons";
type Props = {};

type UserFormData = {
  filename: string;
  marker_name: string | undefined;
  chromosome: string | undefined;
  position: string | undefined;
  pvalue: string | undefined;
  effect_allele: string | undefined;
  alternate_allele: string | undefined;
  beta: string | undefined;
  or: string | undefined;
  se: string | undefined;
  population: string | undefined;
  r_squared: string | undefined;
  d_prime: string | undefined;
  window_size: string | undefined;
};

const LdStructureForm: React.FC<Props> = (props) => {
  // const [loading, setLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState<any>(null);
  const fileInput = useRef<any>(null);
  const genomesPopulation = [
    "CHB",
    "JPT",
    "CHS",
    "CDX",
    "KHV",
    "CEU",
    "TSI",
    "FIN",
    "GBR",
    "IBS",
    "YRI",
    "LWK",
    "MAG",
    "MSL",
    "ESN",
    "ASW",
    "ACB",
    "MXL",
    "PUR",
    "CLM",
    "PEL",
    "BEB",
    "STU",
    "ITU",
  ];
  const formik = useFormik<UserFormData>({
    initialValues: {
      filename: "",
      marker_name: "",
      chromosome: "",
      position: "",
      pvalue: "",
      effect_allele: "",
      alternate_allele: "",
      beta: "",
      or: "",
      se: "",
      population: "",
      r_squared: "",
      d_prime: "",
      window_size: "",
    },
    validationSchema: Yup.object({
      filename: Yup.string().required("Please upload a file"),
      ...generalFormValidationObject,
      population: Yup.string().required("This input is required"),
      r_squared: Yup.number()
        .required("R squared is required")
        .min(0, "The minimum is zero")
        .max(1, "the max is 10"),
      d_prime: Yup.number()
        .required("D prime is required")
        .min(0, "The minimum is zero")
        .max(1, "the max is 1"),
      window_size: Yup.number()
        .required("Window size is required")
        .min(10, "The minimum is zero")
        .max(1000, "the max is 1"),
    }),
    onSubmit: (values: FormikValues) => {
      alert(JSON.stringify(values));
      const data = new FormData();
      data.append("file", uploadFile);
      for (const element in values) {
        if (values.hasOwnProperty(element)) {
          data.append(element, values[element]);
        }
      }
    },
  });

  const handleFileUploadChange = (event: any) => {
    let reader = new FileReader();
    let file = event.target.files[0];

    if (file) {
      reader.onloadend = () => {
        formik.setFieldValue("filename", event.target.files[0].name);
        setUploadFile(event.target.files[0]);

        formik.setFieldError("filename", undefined);
      };
      reader.readAsDataURL(file);
    } else {
      formik.setFieldError("filename", "Please upload a file");
    }
  };

  const handleFileBlur = (event: any) => {
    if (event.target.files) {
      formik.setFieldError("filename", "Please upload a file");
      formik.setFieldTouched("filename");
    }
  };

  const handleRemove = (event: any) => {
    setUploadFile(null);
    formik.setFieldValue("filename", "");
    formik.setFieldError("filename", "Please upload a file");
    fileInput.current.querySelector("input").value = "";
  };

  return (
    <div className={classes.LDForm}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <div className={classes.header_div}>
            <h2>Upload a file</h2>
          </div>
          <Grid item xs={12}>
            <Paper elevation={0} className={classes.paper}>
              <FormControl
                error={selectIsError(formik, "filename")}
                className={classes.formControl}
              >
                <TextField
                  id={"filename"}
                  variant="outlined"
                  size={"medium"}
                  type={"file"}
                  ref={fileInput}
                  onChange={handleFileUploadChange}
                  onBlur={handleFileBlur}
                  {...textErrorHelper(formik, "filename")}
                />
              </FormControl>
              {!formik.errors.filename && formik.touched.filename && (
                <Button
                  // className={classes.form_button}
                  startIcon={<DeleteOutlineSharp />}
                  size="small"
                  type={"button"}
                  variant="contained"
                  color="primary"
                  onClick={handleRemove}
                >
                  remove
                </Button>
              )}
            </Paper>
          </Grid>
          <div className={classes.header_div}>
            <h2>Summary statistics column positions</h2>
          </div>
          {generalFileForm(classes, formik, [
            "marker_name",
            "chromosome",
            "position",
            "pvalue",
            "effect_allele",
            "alternate_allele",
            "se",
            "or",
            "beta",
          ])}

          <div className={classes.header_div}>
            <h2>LD structure parameters</h2>
          </div>
          <Grid className={classes.grid} item xs={12} sm={6}>
            <Paper variant="outlined" className={classes.paper}>
              <FormControl
                className={classes.formControl}
                error={selectIsError(formik, "population")}
              >
                <InputLabel htmlFor="population">
                  Reference Population
                </InputLabel>
                {/*  Reference Population*/}
                <NativeSelect
                  id="population"
                  {...formik.getFieldProps("population")}
                >
                  <option aria-label="None" value="" />
                  {/*  Select a reference population*/}
                  {/*</option>*/}
                  {genomesPopulation.map((pop, i) => (
                    <option key={i} value={pop}>
                      {pop}
                    </option>
                  ))}
                </NativeSelect>
                {selectErrorHelper(formik, "population")}
              </FormControl>
            </Paper>
          </Grid>
          <Grid className={classes.grid} item xs={12} sm={6}>
            <Paper variant="outlined" className={classes.paper}>
              <FormControl className={classes.formControl}>
                <TextField
                  id={"r_squared"}
                  variant="outlined"
                  label={"R Squared"}
                  size={"medium"}
                  {...formik.getFieldProps("r_squared")}
                  {...textErrorHelper(formik, "r_squared")}
                />
              </FormControl>
            </Paper>
          </Grid>
          <Grid className={classes.grid} item xs={12} sm={6}>
            <Paper variant="outlined" className={classes.paper}>
              <FormControl className={classes.formControl}>
                <TextField
                  id={"d_prime"}
                  variant="outlined"
                  size={"medium"}
                  label={"D Prime"}
                  {...formik.getFieldProps("d_prime")}
                  {...textErrorHelper(formik, "d_prime")}
                />
              </FormControl>
            </Paper>
          </Grid>
          <Grid className={classes.grid} item xs={12} sm={6}>
            <Paper variant="outlined" className={classes.paper}>
              <FormControl className={classes.formControl}>
                <TextField
                  id={"window_size"}
                  variant="outlined"
                  size={"medium"}
                  label={"Window Size"}
                  {...formik.getFieldProps("window_size")}
                  {...textErrorHelper(formik, "window_size")}
                />
              </FormControl>
            </Paper>
          </Grid>
        </Grid>
        <div className={classes.button_container}>
          <Button
            className={classes.form_button}
            startIcon={<PlayArrow />}
            size="large"
            type={"submit"}
            variant="contained"
            color="primary"
          >
            Execute <Hidden xsDown> Analysis</Hidden>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LdStructureForm;
