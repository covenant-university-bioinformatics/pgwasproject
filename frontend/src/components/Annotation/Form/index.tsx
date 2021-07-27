import React, { useRef, useState } from "react";
import { FormikValues, useFormik } from "formik";
import pgwasAxios from "../../../axios-fetches";
import * as Yup from "yup";
import classes from "./index.module.scss";
import { selectIsError, textErrorHelper } from "../../utility/general_utils";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
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
  jobName: string;
  marker_name: string | undefined;
  chromosome: string | undefined;
  position: string | undefined;
  effect_allele: string | undefined;
  alternate_allele: string | undefined;
  cytoband: false;
  kgp_all: false;
  kgp_afr: false;
  kgp_amr: false;
  kgp_eas: false;
  kgp_eur: false;
  kgp_sas: false;
  exac: false;
  dbnsfp: false;
  clinvar: false;
  intervar: false;
  [key: string]: any;
};

const AnnotationForm: React.FC<Props> = (props) => {
  // const [loading, setLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState<any>(null);
  const fileInput = useRef<any>(null);

  const formik = useFormik<UserFormData>({
    initialValues: {
      filename: "",
      jobName: "",
      marker_name: "",
      chromosome: "",
      position: "",
      effect_allele: "",
      alternate_allele: "",
      cytoband: false,
      kgp_all: false,
      kgp_afr: false,
      kgp_amr: false,
      kgp_eas: false,
      kgp_eur: false,
      kgp_sas: false,
      exac: false,
      dbnsfp: false,
      clinvar: false,
      intervar: false,
    },

    validationSchema: Yup.object({
      filename: Yup.string().required("Please upload a file"),
      marker_name: Yup.number()
        .required("Marker name column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      chromosome: Yup.number()
        .required("Chromosome column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      position: Yup.number()
        .required("Position column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      effect_allele: Yup.number()
        .required("Effect Allele column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      alternate_allele: Yup.number()
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      jobName: Yup.string().required("Job name is required"),
    }),
    onSubmit: (values: FormikValues) => {
      alert(JSON.stringify(values));
      console.log(values);
      const data = new FormData();
      data.append("file", uploadFile);
      for (const element in values) {
        if (values.hasOwnProperty(element)) {
          data.append(element, values[element]);
        }
      }
      pgwasAxios
        .post("/jobs", data)
        .then((res) => {
          // then print response status
          console.log(res);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
  });

  const handleFileUploadChange = (event: any) => {
    let reader = new FileReader();
    let file = event.target.files[0];

    if (file) {
      if (file.type === "text/plain") {
        reader.onloadend = () => {
          formik.setFieldValue("filename", event.target.files[0].name);
          setUploadFile(event.target.files[0]);

          formik.setFieldError("filename", undefined);
        };
        reader.readAsDataURL(file);
      } else {
        formik.setFieldError("filename", "Please upload a text file");
      }
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

  const databases = [
    { variable: "cytoband", name: "Cytoband" },
    { variable: "kgp_all", name: "Frequency in 1KGP (ALL)" },
    { variable: "kgp_afr", name: "Frequency in 1KGP (AFR)" },
    { variable: "kgp_amr", name: "Frequency in 1KGP (AMR)" },
    { variable: "kgp_eur", name: "Frequency in 1KGP (EUR)" },
    { variable: "kgp_eas", name: "Frequency in 1KGP (EAS)" },
    { variable: "kgp_sas", name: "Frequency in 1KGP (SAS)" },
    { variable: "exac", name: "EXAC" },
    { variable: "dbnsfp", name: "DBNSFP" },
    { variable: "clinvar", name: "CLINVAR" },
    { variable: "intervar", name: "INTERVAR" },
  ];

  console.log("render");
  // console.log(formik.values);
  return (
    <div className={classes.annot_form}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <div className={classes.header_div}>
            <h2>Upload a file</h2>
          </div>
          <Grid className={classes.grid} item xs={6}>
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
          <Grid className={classes.grid} item xs={6}>
            <Paper elevation={0} className={classes.paper}>
              <FormControl className={classes.formControl}>
                <TextField
                  id={"jobName"}
                  variant={"outlined"}
                  label={"Job Name"}
                  size={"medium"}
                  {...formik.getFieldProps("jobName")}
                  {...textErrorHelper(formik, "jobName")}
                />
              </FormControl>
            </Paper>
          </Grid>
          <div className={classes.header_div}>
            <h2>Summary statistics column positions</h2>
          </div>
          {generalFileForm(classes, formik, [
            "marker_name",
            "chromosome",
            "position",
            "effect_allele",
            "alternate_allele",
          ])}

          <div className={classes.header_div}>
            <h2>Annotation Databases</h2>
          </div>
          <Grid className={classes.grid} item xs={12}>
            <Paper variant="outlined" className={classes.paper}>
              <FormGroup row>
                {databases.map((data, index) => (
                  <FormControlLabel
                    key={`check_${index}`}
                    control={
                      <Checkbox
                        checked={formik.values[data.variable]}
                        {...formik.getFieldProps(data.variable)}
                      />
                    }
                    label={data.name}
                  />
                ))}
              </FormGroup>
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
