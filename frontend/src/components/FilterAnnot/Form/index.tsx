import React, { useRef, useState } from "react";
import { FormikValues, useFormik } from "formik";
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
  SelectFieldsElement,
} from "../../utility/form_common_fields";
// import classes from "./index.module.scss";

type Props = {};

type UserFormData = {
  filename: string;
  job_name: string;
  useTest: boolean;
  email?: string;
  marker_name: string;
  chromosome: string;
  position: string;
  effect_allele: string;
  alternate_allele: string;
  annotation_type: string;
};

const FilterAnnotForm: React.FC<Props & RouteComponentProps> = (props) => {
  const { user } = useTypedSelector((state) => state.auth);
  const [uploadFile, setUploadFile] = useState<any>(null);
  const [useTest, setUseTest] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<UserFormData>();
  const fileInput = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    filename: "",
    job_name: "",
    ...(!user?.username && { email: "" }),
    useTest: false,
    marker_name: "",
    chromosome: "",
    position: "",
    effect_allele: "",
    alternate_allele: "",
    annotation_type: ""
  };

  const testValues = {
    filename: "test.txt",
    job_name: "Test Func Pred",
    ...(!user?.username && { email: "" }),
    useTest: true,
    marker_name: "6",
    chromosome: "1",
    position: "2",
    effect_allele: "4",
    alternate_allele: "5",
    annotation_type: "GWAVA"
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
      marker_name: Yup.number()
          .required("Chromosome column number is required")
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
          .required("Effect Allele column number is required")
          .min(1, "The minimum is one")
          .max(15, "the max is fifteen"),
      annotation_type: Yup.string().required("This input is required"),
    }),

    onSubmit: (values: FormikValues) => {
      // console.log(values);
      if (user?.username) {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "filterannot",
          "filterannot",
          user.username,
          props
        );
      } else {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "filterannot/noauth",
          "filterannot",
          undefined,
          props
        );
      }
    },
  });

  const handleUseTest = (event: any) => {
    formik.resetForm();
    setUseTest(true);
    setFormValues(testValues);
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

  const annotation_type = [
    // { variable: "none", name: "None" },
    { variable: "GWAVA", name: "GWAVA" },
    { variable: "DANN", name: "DANN" },
    { variable: "GERP", name: "GERP" },
    { variable: "EIGEN", name: "EIGEN" },
  ];

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
              "https://drive.google.com/file/d/12LdBC1ZS2qTlI-WX4QyI3g9ER46Xze7I/view?usp=sharing"
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
              title: "marker_name",
              text:
                  "the column number of the marker name in the summary statistic file. It can be marker_name, rsid, snpid etc",
            },
            {
              title: "chromosome",
              text:
                  "the column number of the chromosome in the summary statistic file. It can be also be chr",
            },
            {
              title: "position",
              text:
                  "the column number of the  base pair positions in the summary statistic file. It can be bp",
            },
            {
              title: "effect_allele",
              text:
                  "the column number of the reference or effect allele in the summary statistic file",
            },
            {
              title: "alternate_allele",
              text:
                  "the column number of the alternate allele in the summary statistic file",
            },
          ])}

          <div className={classes.header_div}>
            <h2>Tool Parameters</h2>
          </div>

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={annotation_type}
            selectVariable={"annotation_type"}
            selectName={"Annotation Type"}
            tooltip={
              "Name of Annotation type for analysis."
            }
          />
        </Grid>
        <div className={classes.button_container}>
          {loading ? (
              <div>
                <CircularProgress color="secondary" className="progress" />
                <div>Uploading...</div>
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

export default FilterAnnotForm;
