import React, { useRef, useState } from "react";
import { FormikValues, useFormik } from "formik";
import { LinearProgress } from "@material-ui/core";
import * as Yup from "yup";
import classes from "../../utility/form_styles.module.scss";
import { Button, CircularProgress, Grid, Hidden } from "@material-ui/core";
import { generalFileForm } from "../../utility/general";
import { GetAppRounded, PlayArrow } from "@material-ui/icons";
import { RouteComponentProps } from "react-router-dom";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import {
  handleFileUploadChangedCommon,
  submitToServer,
} from "../../utility/form_common";
import {
  CommonFileElement,
  CommonTextElement,
  LoadTestData,
} from "../../utility/form_common_fields";
// import classes from "./index.module.scss";

type Props = {};

type UserFormData = {
  filename: string;
  job_name: string;
  useTest: boolean;
  email?: string;
  chr: string;
  start_position: string;
  stop_position: string;
  alleles: string;
  strand: string;
};

const EnsemblVEPForm: React.FC<Props & RouteComponentProps> = (props) => {
  const { user } = useTypedSelector((state) => state.auth);
  const [uploadFile, setUploadFile] = useState<any>(null);
  const [useTest, setUseTest] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<UserFormData>();
  const fileInput = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const initialValues = {
    filename: "",
    job_name: "",
    ...(!user?.username && { email: "" }),
    useTest: false,
    chr: "",
    start_position: "",
    stop_position: "",
    alleles: "",
    strand: "",
  };

  const testValues = {
    filename: "test.txt",
    job_name: "Test CADD",
    ...(!user?.username && { email: "" }),
    useTest: true,
    chr: "1",
    start_position: "2",
    stop_position: "3",
    alleles: "4",
    strand: "5",
  };

  const formik = useFormik<UserFormData>({
    initialValues: formValues || initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      filename: Yup.string().required("Please upload a file"),
      job_name: Yup.string().required("Job name is required"),
      ...(!user?.username && {
        email: Yup.string().email().required("Email field is required"),
      }),
      chr: Yup.number()
        .required("Chromosome column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      start_position: Yup.number()
        .required("Start position column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      stop_position: Yup.number()
        .required("Stop position column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      alleles: Yup.number()
        .required("alleles column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      strand: Yup.number()
        .required("strand column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
    }),

    onSubmit: (values: FormikValues) => {
      // console.log(values);
      if (user?.username) {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "ensemblvep",
          "ensemblvep",
          user.username,
          props,
          setUploadProgress
        );
      } else {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "ensemblvep/noauth",
          "ensemblvep",
          undefined,
          props,
          setUploadProgress
        );
      }
    },
  });

  const handleUseTest = (event: any) => {
    formik.resetForm();
    setUseTest(true);
    setFormValues(testValues);
    setUploadFile(null);
    fileInput.current.querySelector("input").disabled = true;
  };

  const handleRemoveUseTest = (event: any) => {
    setUseTest(false);
    setFormValues(undefined);
    formik.setFieldValue("filename", "");
    fileInput.current.querySelector("input").value = "";
    fileInput.current.querySelector("input").disabled = false;
    formik.resetForm();
  };

  const handleFileUploadChange = (event: any) => {
    handleFileUploadChangedCommon(event, formik, setUploadFile);
  };

  const handleFileBlur = (event: any) => {
    if (!event.target.files) {
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
    <div className={classes.job_form}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <LoadTestData
            classes={classes}
            useTest={useTest}
            handleUseTest={handleUseTest}
            handleRemoveUseTest={handleRemoveUseTest}
          />
          <Button
            type={"button"}
            variant="contained"
            color="primary"
            size={"small"}
            className={classes.button}
            endIcon={<GetAppRounded />}
            href={
              "https://drive.google.com/file/d/1_zxyfh0ckzfNjzs6320hOkthvNtRy-85/view?usp=sharing"
            }
            target="_blank"
          >
            Download Test File
          </Button>
          <div className={classes.header_div}>
            <h2>Enter Job Name</h2>
          </div>
          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"Job Name"}
            textVariable={"job_name"}
            tooltip={"Enter the name of the job"}
          />
          {user?.username ? null : (
            <>
              <div className={classes.header_div}>
                <h2>Enter your email</h2>
              </div>
              <CommonTextElement
                classes={classes}
                formik={formik}
                label={"Email"}
                textVariable={"email"}
                tooltip={"Enter your email"}
              />
            </>
          )}
          <div className={classes.header_div}>
            <h2>Upload a file</h2>
          </div>
          <CommonFileElement
            classes={classes}
            formik={formik}
            fileInput={fileInput}
            handleFileUploadChange={handleFileUploadChange}
            handleFileBlur={handleFileBlur}
            handleRemove={handleRemove}
          />

          <div className={classes.header_div}>
            <h2>Summary statistics column positions</h2>
          </div>

          {generalFileForm(classes, formik, [
            {
              title: "chr",
              text: "the column number of the chromosome in the summary statistic file. It can be also be chr",
            },
            {
              title: "start_position",
              text: "the column number of the base pair positions in the summary statistic file. It can be bp",
            },
            {
              title: "stop_position",
              text: "the column number of the base pair positions in the summary statistic file. It can be bp",
            },
            {
              title: "alleles",
              text: "the column number of the alleles in the summary statistic file.",
            },
            {
              title: "strand",
              text: "the column number of the strand in the summary statistic file.",
            },
          ])}
        </Grid>
        <div className={classes.button_container}>
          {loading ? (
            <div
              style={{
                width: "280px",
              }}
            >
              <CircularProgress color="secondary" className="progress" />
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                style={{
                  margin: "1rem 0",
                  width: "100%",
                }}
              />
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                {uploadProgress < 50 && <p>Uploading file...</p>}
                {uploadProgress >= 50 && uploadProgress < 60 && (
                  <p>Half way there... Hang on!</p>
                )}
                {uploadProgress >= 60 && uploadProgress < 80 && (
                  <p>Almost there...</p>
                )}
                {uploadProgress >= 80 && (
                  <p>Processing... Job about to be queued</p>
                )}
              </div>
            </div>
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

export default EnsemblVEPForm;
