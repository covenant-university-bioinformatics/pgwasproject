import React, { useRef, useState } from "react";
import { FormikValues, useFormik } from "formik";
import { LinearProgress } from "@material-ui/core";
import * as Yup from "yup";
// import classes from "./index.module.scss";
import classes from "../../utility/form_styles.module.scss";
import { Button, CircularProgress, Grid, Hidden } from "@material-ui/core";
import { generalFileForm } from "../../utility/general";
import { GetAppRounded, PlayArrow } from "@material-ui/icons";
import { RouteComponentProps } from "react-router-dom";
import {
  handleFileUploadChangedCommon,
  submitToServer,
} from "../../utility/form_common";
import {
  LoadTestData,
  CommonTextElement,
  CommonFileElement,
  SelectFieldsElement,
} from "../../utility/form_common_fields";
import { useTypedSelector } from "../../../hooks/useTypedSelector";

type Props = {};

enum RunPathwayOptions {
  ON = "on",
  OFF = "off",
}

enum GeneScoringOptions {
  SUM = "sum",
  MAX = "max",
}

enum GeneSetFileOptions {
  MSIGDB_ENTREZ = "msigdb.v4.0.entrez",
  KEGG_REACTOME = "msigBIOCARTA_KEGG_REACTOME",
}

type UserFormData = {
  filename: string;
  job_name: string;
  email?: string;
  useTest: boolean;
  marker_name: string | undefined;
  p_value: string | undefined;
  population: string;
  run_pathway: RunPathwayOptions;
  chr: string;
  gene_set_file: GeneSetFileOptions;
  pvalue_cutoff: string;
  up_window: string;
  down_window: string;
  max_snp: string;
  gene_scoring: GeneScoringOptions;
  merge_distance: string;
  maf_cutoff: string;
  [key: string]: any;
};

const GeneBasedForm: React.FC<Props & RouteComponentProps> = (props) => {
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
    p_value: "",
    population: "",
    run_pathway: RunPathwayOptions.ON,
    chr: "",
    gene_set_file: GeneSetFileOptions.KEGG_REACTOME,
    pvalue_cutoff: "0.05",
    up_window: "50000",
    down_window: "50000",
    max_snp: "3000",
    gene_scoring: GeneScoringOptions.SUM,
    merge_distance: "1",
    maf_cutoff: "0.05",
  };

  const testValues = {
    filename: "test.txt",
    job_name: "Test Pathway",
    ...(!user?.username && { email: "" }),
    useTest: true,
    marker_name: "1",
    p_value: "2",
    population: "eur",
    run_pathway: RunPathwayOptions.ON,
    chr: "1",
    gene_set_file: GeneSetFileOptions.KEGG_REACTOME,
    pvalue_cutoff: "0.05",
    up_window: "50000",
    down_window: "50000",
    max_snp: "3000",
    gene_scoring: GeneScoringOptions.SUM,
    merge_distance: "1",
    maf_cutoff: "0.05",
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
      p_value: Yup.number()
        .required("Effect Allele column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      job_name: Yup.string().required("Job name is required"),
      ...(!user?.username && {
        email: Yup.string().email().required("Email field is required"),
      }),
      population: Yup.string().required("Please select a closest population"),
      run_pathway: Yup.string().required(
        "Please select value for running pathway analysis"
      ),
      chr: Yup.string().required("Please select a chromosome number"),
      gene_set_file: Yup.string().required("Please select a gene set file"),
      pvalue_cutoff: Yup.string().required("Please choose a pvalue_cutoff"),
      up_window: Yup.number().required("Please enter in a number value"),
      down_window: Yup.number().required("Please enter in a number value"),
      max_snp: Yup.number().required("Please enter in a number value"),
      gene_scoring: Yup.string().required(
        "Please choose a gene scoring option"
      ),
      merge_distance: Yup.number().required("Please enter in a number value"),
      maf_cutoff: Yup.number().required("Please enter in a number value"),
    }),

    onSubmit: (values: FormikValues) => {
      if (user?.username) {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "pathwaybased",
          "pathwaybased",
          user.username,
          props,
          setUploadProgress
        );
      } else {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "pathwaybased/noauth",
          "pathwaybased",
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

  const populations = [
    { variable: "afr", name: "AFR" },
    { variable: "eur", name: "EUR" },
    { variable: "amr", name: "AMR" },
    { variable: "eas", name: "EAS" },
    { variable: "sas", name: "SAS" },
  ];

  const run_pathways = [
    { variable: "on", name: "ON" },
    { variable: "off", name: "OFF" },
  ];

  const chromosomes = [
    { variable: "1", name: "1" },
    { variable: "2", name: "2" },
    { variable: "3", name: "3" },
    { variable: "4", name: "4" },
    { variable: "5", name: "5" },
    { variable: "6", name: "6" },
    { variable: "7", name: "7" },
    { variable: "8", name: "8" },
    { variable: "9", name: "9" },
    { variable: "10", name: "10" },
    { variable: "11", name: "11" },
    { variable: "12", name: "12" },
    { variable: "13", name: "13" },
    { variable: "14", name: "14" },
    { variable: "15", name: "15" },
    { variable: "16", name: "16" },
    { variable: "17", name: "17" },
    { variable: "18", name: "18" },
    { variable: "19", name: "19" },
    { variable: "20", name: "20" },
    { variable: "21", name: "21" },
    { variable: "22", name: "22" },
    { variable: "all", name: "all" },
  ];

  const geneScoringOptions = [
    { variable: "sum", name: "SUM" },
    { variable: "max", name: "MAX" },
  ];

  const geneSetFileOptions = [
    { variable: "msigdb.v4.0.entrez", name: "MSIGDB_ENTREZ" },
    { variable: "msigBIOCARTA_KEGG_REACTOME", name: "KEGG_REACTOME" },
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
              "https://drive.google.com/file/d/1JHhxVFmHNURD9O6I7RCX71NkbbfInhpF/view?usp=sharing"
            }
            target="_blank"
          >
            Download Test File
          </Button>
          <div className={classes.header_div}>
            <h2>Enter a Job Name</h2>
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
              title: "p_value",
              text: "the column number of the pvalue in the summary statistic file. It can be p, pvalue, pval_nominal etc.",
            },
          ])}
          <div className={classes.header_div}>
            <h2>Tool Parameters</h2>
          </div>
          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={populations}
            selectVariable={"population"}
            selectName={"Population"}
          />

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={run_pathways}
            selectVariable={"run_pathway"}
            selectName={"Run Pathway Option"}
          />

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={chromosomes}
            selectVariable={"chr"}
            selectName={"Chromosome"}
          />

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={geneSetFileOptions}
            selectVariable={"gene_set_file"}
            selectName={"Gene Set File"}
          />

          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"Pvalue Cut off"}
            textVariable={"pvalue_cutoff"}
            tooltip={
              "p-value cutoff to report the statistically significant genes and pathways. The default value is 0.05."
            }
          />

          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"Up Window Size(bp)"}
            textVariable={"up_window"}
            tooltip={
              "Upstream window size around genes. The default values are 50000 base-pairs upstream of transcription start site and 50000 base-pairs downstream of transcription termination site."
            }
          />

          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"Down Window Size(bp)"}
            textVariable={"down_window"}
            tooltip={
              "downstream window size around genes. The default values are 50000 base-pairs upstream of transcription start site and 50000 base-pairs downstream of transcription termination site."
            }
          />

          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"Max SNPs"}
            textVariable={"max_snp"}
            tooltip={
              "Maximum number of SNPs per gene. The default value is 3000 SNPs."
            }
          />
          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={geneScoringOptions}
            selectVariable={"gene_scoring"}
            selectName={"Gene Scoring Option"}
          />
          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"Merge Distance"}
            textVariable={"merge_distance"}
            tooltip={""}
          />
          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"MAF Cut off"}
            textVariable={"maf_cutoff"}
            tooltip={
              "The minor allele frequency cutoff value (between 0 and 1). The default value is 0.05"
            }
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
            >
              Execute <Hidden xsDown> Analysis</Hidden>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GeneBasedForm;
