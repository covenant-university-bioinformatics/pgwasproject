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
  Paper,
  TextField,
} from "@material-ui/core";
import { generalFileForm } from "../../utility/general";
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
  ncbi_build: string | undefined;
};

const AnnotationForm: React.FC<Props> = (props) => {
  // const [loading, setLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState<any>(null);
  const fileInput = useRef<any>(null);

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
      ncbi_build: "",
    },

    validationSchema: Yup.object({
      filename: Yup.string().required("Please upload a file"),
      ...generalFormValidationObject,
      ncbi_build: Yup.string().required("This input is required"),
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
    // console.log(fileInput.current.querySelector("input"));
    fileInput.current.querySelector("input").value = "";
  };

  return (
    <div className={classes.annot_form}>
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
          {generalFileForm(classes, formik)}

          <div className={classes.header_div}>
            <h2>Liftover parameters</h2>
          </div>
          <Grid className={classes.grid} item xs={12} sm={4}>
            <Paper variant="outlined" className={classes.paper}>
              <FormControl className={classes.formControl}>
                <TextField
                  id={"ncbi_build"}
                  variant="outlined"
                  label={"NCBI Build"}
                  size={"medium"}
                  {...formik.getFieldProps("ncbi_build")}
                  {...textErrorHelper(formik, "ncbi_build")}
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

export default AnnotationForm;
