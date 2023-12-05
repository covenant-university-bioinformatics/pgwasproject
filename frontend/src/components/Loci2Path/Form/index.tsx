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
  SelectFieldsElement,
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
  tissue: string;
};

const Loci2PathForm: React.FC<Props & RouteComponentProps> = (props) => {
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
    tissue: "",
  };

  const testValues = {
    filename: "test.txt",
    job_name: "Test Loci2Path",
    ...(!user?.username && { email: "" }),
    useTest: true,
    chr: "1",
    start_position: "2",
    stop_position: "3",
    tissue: "Adipose_Subcutaneous",
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
      tissue: Yup.string().required("This input is required"),
    }),

    onSubmit: (values: FormikValues) => {
      // console.log(values);
      if (user?.username) {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "loci2path",
          "loci2path",
          user.username,
          props,
          setUploadProgress
        );
      } else {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "loci2path/noauth",
          "loci2path",
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

  const tissues = [
    // { variable: "none", name: "None" },
    { variable: "Adipose_Subcutaneous", name: "Adipose_Subcutaneous" },
    { variable: "Adipose_Visceral_Omentum", name: "Adipose_Visceral_Omentum" },
    { variable: "Adrenal_Gland", name: "Adrenal_Gland" },
    { variable: "Artery_Aorta", name: "Artery_Aorta" },
    { variable: "Artery_Coronary", name: "Artery_Coronary" },
    { variable: "Artery_Tibial", name: "Artery_Tibial" },
    { variable: "Brain_Amygdala", name: "Brain_Amygdala" },
    {
      variable: "Brain_Anterior_cingulate_cortex_BA24",
      name: "Brain_Anterior_cingulate_cortex_BA24",
    },
    {
      variable: "Brain_Caudate_basal_ganglia",
      name: "Brain_Caudate_basal_ganglia",
    },
    {
      variable: "Brain_Cerebellar_Hemisphere",
      name: "Brain_Cerebellar_Hemisphere",
    },
    { variable: "Brain_Cerebellum", name: "Brain_Cerebellum" },
    { variable: "Brain_Cortex", name: "Brain_Cortex" },
    { variable: "Brain_Frontal_Cortex_BA9", name: "Brain_Frontal_Cortex_BA9" },
    { variable: "Brain_Hippocampus", name: "Brain_Hippocampus" },
    { variable: "Brain_Hypothalamus", name: "Brain_Hypothalamus" },
    {
      variable: "Brain_Nucleus_accumbens_basal_ganglia",
      name: "Brain_Nucleus_accumbens_basal_ganglia",
    },
    {
      variable: "Brain_Putamen_basal_ganglia",
      name: "Brain_Putamen_basal_ganglia",
    },
    {
      variable: "Brain_Spinal_cord_cervical_c_1",
      name: "Brain_Spinal_cord_cervical_c-1",
    },
    { variable: "Brain_Substantia_nigra", name: "Brain_Substantia_nigra" },
    { variable: "Breast_Mammary_Tissue", name: "Breast_Mammary_Tissue" },
    {
      variable: "Cells_EBV_transformed_lymphocytes",
      name: "Cells_EBV-transformed_lymphocytes",
    },
    { variable: "Colon_Sigmoid", name: "Colon_Sigmoid" },
    { variable: "Colon_Transverse", name: "Colon_Transverse" },
    {
      variable: "Esophagus_Gastroesophageal_Junction",
      name: "Esophagus_Gastroesophageal_Junction",
    },
    { variable: "Esophagus_Mucosa", name: "Esophagus_Mucosa" },
    { variable: "Esophagus_Muscularis", name: "Esophagus_Muscularis" },
    { variable: "Heart_Atrial_Appendage", name: "Heart_Atrial_Appendage" },
    { variable: "Heart_Left_Ventricle", name: "Heart_Left_Ventricle" },
    { variable: "Liver", name: "Liver" },
    { variable: "Lung", name: "Lung" },
    { variable: "Minor_Salivary_Gland", name: "Minor_Salivary_Gland" },
    { variable: "Muscle_Skeletal", name: "Muscle_Skeletal" },
    { variable: "Nerve_Tibial", name: "Nerve_Tibial" },
    { variable: "Ovary", name: "Ovary" },
    { variable: "Pancreas", name: "Pancreas" },
    { variable: "Pituitary", name: "Pituitary" },
    { variable: "Prostate", name: "Prostate" },
    {
      variable: "Skin_Not_Sun_Exposed_Suprapubic",
      name: "Skin_Not_Sun_Exposed_Suprapubic",
    },
    {
      variable: "Skin_Sun_Exposed_Lower_leg",
      name: "Skin_Sun_Exposed_Lower_leg",
    },
    {
      variable: "Small_Intestine_Terminal_Ileum",
      name: "Small_Intestine_Terminal_Ileum",
    },
    { variable: "Spleen", name: "Spleen" },
    { variable: "Stomach", name: "Stomach" },
    { variable: "Testis", name: "Testis" },
    { variable: "Thyroid", name: "Thyroid" },
    { variable: "Uterus", name: "Uterus" },
    { variable: "Vagina", name: "Vagina" },
    { variable: "Whole_Blood", name: "Whole_Blood" },
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
              "https://drive.google.com/file/d/1z8Y23kp6pdG3PvXKj8rtnuz2Poz6ndj3/view?usp=sharing"
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
          ])}

          <div className={classes.header_div}>
            <h2>Tool Parameters</h2>
          </div>

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={tissues}
            selectVariable={"tissue"}
            selectName={"Tissue"}
            tooltip={"Name of tissue for analysis."}
          />
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

export default Loci2PathForm;
