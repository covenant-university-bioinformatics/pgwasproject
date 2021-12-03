import React, { useRef, useState } from "react";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import classes from "./index.module.scss";
import { selectIsError } from "../../utility/general_utils";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  Hidden,
  InputLabel,
  NativeSelect,
  Paper,
} from "@material-ui/core";
import { generalFileForm, selectErrorHelper } from "../../utility/general";
import { PlayArrow } from "@material-ui/icons";
import { RouteComponentProps } from "react-router-dom";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import {
  handleFileUploadChangedCommon,
  submitToServer,
} from "../../utility/form_common";
import {
  commonFileElement,
  commonTextElement,
} from "../../utility/form_common_fields";
type Props = {};

type UserFormData = {
  filename: string;
  job_name: string;
  email?: string;
  marker_name: string | undefined;
  chromosome: string | undefined;
  position: string | undefined;
  ncbi_build: string | undefined;
};

const LiftoverForm: React.FC<Props & RouteComponentProps> = (props) => {
  const { user } = useTypedSelector((state) => state.auth);
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
      ...(!user?.username && {
        email: Yup.string().email().required("Email field is required"),
      }),
      ncbi_build: Yup.string().required("This input is required"),
    }),
    onSubmit: (values: FormikValues) => {
      if (user?.username) {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "liftover",
          "liftover",
          user.username,
          props
        );
      } else {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "liftover/noauth",
          "liftover",
          undefined,
          props
        );
      }
    },
  });

  const handleFileUploadChange = (event: any) => {
    handleFileUploadChangedCommon(event, formik, setUploadFile);
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
            <h2>Enter Job Name</h2>
          </div>
          {commonTextElement(classes, formik, "Job Name", "job_name")}
          {user?.username ? null : (
            <>
              <div className={classes.header_div}>
                <h2>Enter your email</h2>
              </div>
              {commonTextElement(classes, formik, "Email", "email")}
            </>
          )}
          <div className={classes.header_div}>
            <h2>Upload a file</h2>
          </div>
          {commonFileElement(
            classes,
            formik,
            fileInput,
            handleFileUploadChange,
            handleFileBlur,
            handleRemove
          )}
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
