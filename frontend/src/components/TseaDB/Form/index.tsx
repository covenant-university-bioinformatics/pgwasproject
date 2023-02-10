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
  genes: string;
  analysisType: string;
  reference_panel: string;
  ratio: string;
  p_adjust_method: string;
};

const TseaDBForm: React.FC<Props & RouteComponentProps> = (props) => {
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
    genes: "",
    analysisType: "",
    reference_panel: "",
    ratio: "",
    p_adjust_method: ""
  };

  const testValues = {
    filename: "test.txt",
    job_name: "Test TSEA DB",
    ...(!user?.username && { email: "" }),
    useTest: true,
    genes: "1",
    analysisType: "single_sample",
    reference_panel: "GTEx_t_score",
    ratio: "0.05",
    p_adjust_method: "bonferroni"
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
      genes: Yup.number()
        .required("Genes column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      analysisType: Yup.string().required("Please select a value"),
      reference_panel: Yup.string().required("Please select a value"),
      ratio: Yup.string().required("This input is required"),
      p_adjust_method: Yup.string().required("Please select a value"),
    }),

    onSubmit: (values: FormikValues) => {
      // console.log(values);
      if (user?.username) {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "tseadb",
          "tseadb",
          user.username,
          props
        );
      } else {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "tseadb/noauth",
          "tseadb",
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
    setUploadFile(null)
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

  const P_ADJUST_METHOD = [
    { variable: "holm", name: "HOLM" },
    { variable: "hochberg", name: "HOCHBERG" },
    { variable: "hommel", name: "HOMMEL" },
    { variable: "bonferroni", name: "BONFERRONI" },
    { variable: "BH", name: "BH" },
    { variable: "BY", name: "BY" },
    { variable: "fdr", name: "FDR" },
    { variable: "none", name: "NONE" },
  ];

  const AnalysisType = [
    { variable: "single_sample", name: "SINGLE_SAMPLE" },
  ];

  const ReferencePanel = [
    { variable: "GTEx_t_score", name: "GTEx_t_score" },
    { variable: "ENCODE_z_score", name: "ENCODE_z_score" },
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
              "https://drive.google.com/file/d/1pqPBm0Y9iyj9S2PmWeJC8RPctDW_mrgb/view?usp=sharing"
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
              title: "genes",
              text:
                "the column number of the gene name in the summary statistic file. Check test file",
            }
          ])}

          <div className={classes.header_div}>
            <h2>Tool Parameters</h2>
          </div>

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={AnalysisType}
            selectVariable={"analysisType"}
            selectName={"Analysis Type"}
            tooltip={"Analysis Type"}
          />

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={ReferencePanel}
            selectVariable={"reference_panel"}
            selectName={"Reference Panel"}
            tooltip={
              "The reference panel which can be either GTex score (GTEx_t_scor) or Encode score ,ENCODE_z_score)"
            }
          />

          <CommonTextElement
              classes={classes}
              formik={formik}
              label={"Pvalue Threshold"}
              textVariable={"ratio"}
              tooltip={
                "The threshold to define tissue-specific genes (with top t-score or z-score), the default value is 0.05."
              }
          />

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={P_ADJUST_METHOD}
            selectVariable={"p_adjust_method"}
            selectName={"Pvalue ADJUST METHOD"}
            tooltip={"Pvalue adjustment method (p_adjust_method)"}
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

export default TseaDBForm;
