import React, { useRef, useState } from "react";
import { FormikValues, useFormik } from "formik";
import { LinearProgress } from "@material-ui/core";
import * as Yup from "yup";
// import classes from "./index.module.scss";
import classes from "../../utility/form_styles.module.scss";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grid,
  Hidden,
  Paper,
} from "@material-ui/core";
import { generalFileForm } from "../../utility/general";
import { GetAppRounded, PlayArrow } from "@material-ui/icons";
import { RouteComponentProps } from "react-router-dom";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import {
  CommonTextElement,
  CommonFileElement,
  LoadTestData,
  SelectFieldsElement,
} from "../../utility/form_common_fields";
import {
  handleFileUploadChangedCommon,
  submitToServer,
} from "../../utility/form_common";

type Props = {};

type UserFormData = {
  filename: string;
  job_name: string;
  email?: string;
  useTest: boolean;
  marker_name: string | undefined;
  chromosome: string | undefined;
  position: string | undefined;
  effect_allele: string | undefined;
  alternate_allele: string | undefined;
  gene_db: string;
  cytoband: boolean;
  kgp_all: boolean;
  kgp_afr: boolean;
  kgp_amr: boolean;
  kgp_eas: boolean;
  kgp_eur: boolean;
  kgp_sas: boolean;
  exac: boolean;
  disgenet: boolean;
  clinvar: boolean;
  intervar: boolean;
  [key: string]: any;
};

const AnnotationForm: React.FC<Props & RouteComponentProps> = (props) => {
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
    marker_name: "",
    chromosome: "",
    position: "",
    effect_allele: "",
    alternate_allele: "",
    gene_db: "",
    cytoband: false,
    kgp_all: false,
    kgp_afr: false,
    kgp_amr: false,
    kgp_eas: false,
    kgp_eur: false,
    kgp_sas: false,
    exac: false,
    disgenet: false,
    clinvar: false,
    intervar: false,
  };

  const testValues = {
    filename: "test.txt",
    job_name: "Test Annot",
    ...(!user?.username && { email: "" }),
    useTest: true,
    marker_name: "6",
    chromosome: "1",
    position: "2",
    effect_allele: "4",
    alternate_allele: "5",
    gene_db: "refseq",
    cytoband: true,
    kgp_all: true,
    kgp_afr: true,
    kgp_amr: false,
    kgp_eas: true,
    kgp_eur: true,
    kgp_sas: false,
    exac: true,
    disgenet: true,
    clinvar: true,
    intervar: false,
  };

  const formik = useFormik<UserFormData>({
    initialValues: formValues || initialValues,
    enableReinitialize: true,
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
        .required("Effect Allele column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      job_name: Yup.string().required("Job name is required"),
      ...(!user?.username && {
        email: Yup.string().email().required("Email field is required"),
      }),
      gene_db: Yup.string().required("Please select a database"),
    }),
    // validateOnChange: true,
    // validateOnBlur: true,
    // validateOnMount: true,
    onSubmit: (values: FormikValues) => {
      // console.log(values);
      if (user?.username) {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "annot",
          "annotation",
          user.username,
          props,
          setUploadProgress
        );
      } else {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "annot/noauth",
          "annotation",
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

  const databases = [
    { variable: "cytoband", name: "Cytoband" },
    { variable: "kgp_all", name: "Frequency in 1KGP (ALL)" },
    { variable: "kgp_afr", name: "Frequency in 1KGP (AFR)" },
    { variable: "kgp_amr", name: "Frequency in 1KGP (AMR)" },
    { variable: "kgp_eur", name: "Frequency in 1KGP (EUR)" },
    { variable: "kgp_eas", name: "Frequency in 1KGP (EAS)" },
    { variable: "kgp_sas", name: "Frequency in 1KGP (SAS)" },
    { variable: "exac", name: "Exome Frequencies" },
    { variable: "disgenet", name: "DISGENET" },
    { variable: "clinvar", name: "CLINVAR" },
    { variable: "intervar", name: "INTERVAR" },
  ];

  const gene_dbs = [
    { variable: "refseq", name: "RefSeq" },
    { variable: "ucsc", name: "UCSC" },
    { variable: "ensembl", name: "Ensembl" },
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
              "https://drive.google.com/file/d/1SEDlM3EjXq4Mfdfvcp85j9rESBy3JXNT/view?usp=sharing"
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
            tooltip={"Enter a name for your job"}
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
                tooltip={"Enter your email address"}
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
              text: "the column number of the marker name in the summary statistic file. It can be marker_name, rsid, snpid etc",
            },
            {
              title: "chromosome",
              text: "the column number of the chromosome in the summary statistic file. It can be also be chr",
            },
            {
              title: "position",
              text: "the column number of the  base pair positions in the summary statistic file. It can be bp",
            },
            {
              title: "effect_allele",
              text: "the column number of the reference or effect allele in the summary statistic file",
            },
            {
              title: "alternate_allele",
              text: "the column number of the alternate allele in the summary statistic file",
            },
          ])}
          <div className={classes.header_div}>
            <h2>Gene Annotation Database</h2>
          </div>
          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={gene_dbs}
            selectVariable={"gene_db"}
            selectName={"Gene Annotation"}
          />
          <div className={classes.header_div}>
            <h2>Other Annotation Databases</h2>
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

export default AnnotationForm;
