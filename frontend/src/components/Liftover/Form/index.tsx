import React, { useRef, useState } from "react";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import classes from "./index.module.scss";
import {
  getErrorMessage,
  selectIsError,
  showToastError,
  showToastMessage,
  textErrorHelper,
} from "../../utility/general_utils";
import {
  Button,
  CircularProgress,
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
import pgwasAxios from "../../../axios-fetches";
import { RouteComponentProps } from "react-router-dom";
type Props = {};

type UserFormData = {
  filename: string;
  job_name: string;
  marker_name: string | undefined;
  chromosome: string | undefined;
  position: string | undefined;
  ncbi_build: string | undefined;
};

const LiftoverForm: React.FC<Props & RouteComponentProps> = (props) => {
  const [uploadFile, setUploadFile] = useState<any>(null);
  const fileInput = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  const assemblies = [
    { label: "Gcrh38/hg38", value: 38 },
    { label: "Gcrh36/hg18", value: 36 },
  ];

  const formik = useFormik<UserFormData>({
    initialValues: {
      filename: "",
      job_name: "",
      marker_name: "",
      chromosome: "",
      position: "",
      ncbi_build: "",
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
      job_name: Yup.string().required("Job name is required"),
      ncbi_build: Yup.string().required("This input is required"),
    }),
    onSubmit: (values: FormikValues) => {
      const data = new FormData();
      data.append("file", uploadFile);
      for (const element in values) {
        if (values.hasOwnProperty(element)) {
          data.append(element, values[element]);
        }
      }
      // console.log(values);
      setLoading(true);
      pgwasAxios
        .post("/liftover/jobs", data)
        .then((res) => {
          showToastMessage("Job submitted successfully");
          setLoading(false);
          props.history.push(`/${props.match.url.split("/")[1]}/all_results`);
        })
        .catch((error) => {
          setLoading(false);
          showToastError(getErrorMessage(error));
        });
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
    <div className={classes.liftover_form}>
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
                  id={"job_name"}
                  variant={"outlined"}
                  label={"Job Name"}
                  size={"medium"}
                  {...formik.getFieldProps("job_name")}
                  {...textErrorHelper(formik, "job_name")}
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
          ])}
          <div className={classes.header_div}>
            <h2>Liftover parameters</h2>
          </div>
          <Grid className={classes.grid} item xs={12} sm={6}>
            <Paper variant="outlined" className={classes.paper}>
              <FormControl
                className={classes.formControl}
                error={selectIsError(formik, "ncbi_build")}
              >
                <InputLabel htmlFor="ncbi_build">Current NBCI Build</InputLabel>
                <NativeSelect
                  id="ncbi_build"
                  {...formik.getFieldProps("ncbi_build")}
                >
                  <option aria-label="None" value="" />
                  {assemblies.map((pop, i) => (
                    <option key={i} value={pop.value}>
                      {pop.label}
                    </option>
                  ))}
                </NativeSelect>
                {selectErrorHelper(formik, "ncbi_build")}
              </FormControl>
            </Paper>
          </Grid>
          <Grid className={classes.grid} item xs={12} sm={6}>
            <p className={classes.new_assembly}>to: Gcrh37/hg19</p>
          </Grid>
        </Grid>
        <div className={classes.button_container}>
          {loading ? (
            <CircularProgress color="secondary" className="progress" />
          ) : (
            <Button
              className={classes.form_button}
              startIcon={<PlayArrow />}
              size="large"
              type={"submit"}
              variant="contained"
              color="primary"
              disabled={!formik.isValid}
            >
              Execute <Hidden xsDown> Analysis</Hidden>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LiftoverForm;
