import React, { useRef, useState } from "react";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import classes from "../../utility/form_styles.module.scss";
import mainClasses from "./index.module.scss";
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

type Props = {};

type UserFormData = {
  filename: string;
  job_name: string;
  useTest: boolean;
  email?: string;
  analysisType: string;
  marker_name?: string;
  ldThresh?: string;
  ldPop?: string;
  epi?: string;
  cons?: string;
  genetypes?: string;
  snpID?: string;
  genomeAssembly?: string;
};

type AnalysisType = "HaploReg" | "Regulome";

const RegHaploRForm: React.FC<Props> = (props) => {
  const { user } = useTypedSelector((state) => state.auth);
  const [uploadFile, setUploadFile] = useState<any>(null);
  const [useTest, setUseTest] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<UserFormData>();
  const fileInput = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [analysisTypeState, setAnalysisTypeState] = useState<AnalysisType>(
    "HaploReg"
  );

  const initialValues = {
    filename: "",
    job_name: "",
    ...(!user?.username && { email: "" }),
    useTest: false,
    analysisType: "HaploReg",
    marker_name: "",
    ldThresh: "",
    ldPop: "",
    epi: "",
    cons: "",
    genetypes: "",
    snpID: "",
    genomeAssembly: "",
  };

  const testValues = {
    filename: "test.txt",
    job_name: "Test HaploR",
    ...(!user?.username && { email: "" }),
    useTest: true,
    analysisType: "HaploReg",
    marker_name: "1",
    ldThresh: "0.8",
    ldPop: "AFR",
    epi: "vanilla",
    cons: "both",
    genetypes: "gencode",
  };

  const formik = useFormik<UserFormData>({
    initialValues: formValues || initialValues,
    enableReinitialize: true,

    validationSchema: Yup.object({
      job_name: Yup.string().required("Job name is required"),
      ...(!user?.username && {
        email: Yup.string().email().required("Email field is required"),
      }),
      analysisType: Yup.string().required("Please select a value"),
      ...(analysisTypeState === "Regulome" && {
        snpID: Yup.string().required("This input is required"),
        genomeAssembly: Yup.string().required("This input is required"),
      }),
      ...(analysisTypeState === "HaploReg" && {
        filename: Yup.string().required("Please upload a file"),
        marker_name: Yup.number()
          .required("Marker name column number is required")
          .min(1, "The minimum is one")
          .max(15, "the max is fifteen"),
        ldThresh: Yup.number().required(
          "This value is required and must be a number value"
        ),
        ldPop: Yup.string().required("Please select a value"),
        epi: Yup.string().required("Please select a value"),
        cons: Yup.string().required("Please select a value"),
        genetypes: Yup.string().required("Please select a value"),
      }),
    }),
    onSubmit: (values: FormikValues) => {
      // console.log(values);
      let results: Partial<{
        job_name: string;
        useTest: boolean;
        email?: string;
        analysisType: string;
        filename?: string;
        marker_name?: string;
        ldThresh?: string;
        ldPop?: string;
        epi?: string;
        cons?: string;
        genetypes?: string;
        snpID?: string;
        genomeAssembly?: string;
      }> = {};
      if (values.analysisType === "Regulome") {
        results = {
          job_name: values.job_name,
          useTest: values.useTest,
          analysisType: values.analysisType,
          snpID: values.snpID,
          genomeAssembly: values.genomeAssembly,
        };
      } else if (values.analysisType === "HaploReg") {
        results = {
          job_name: values.job_name,
          useTest: values.useTest,
          analysisType: values.analysisType,
          filename: values.filename,
          marker_name: values.marker_name,
          ldThresh: values.ldThresh,
          ldPop: values.ldPop,
          epi: values.epi,
          cons: values.cons,
          genetypes: values.genetypes,
        };
      }

      if (user?.username) {
        submitToServer(
          results,
          uploadFile,
          setLoading,
          "haplor",
          "regulationhaplor",
          user.username,
          props
        );
      } else {
        results.email = values.email;
        submitToServer(
          results,
          uploadFile,
          setLoading,
          "haplor/noauth",
          "regulationhaplor",
          undefined,
          props
        );
      }

      // console.log(results);
    },
  });

  const handleUseTest = (event: any) => {
    formik.resetForm();
    setUseTest(true);
    setAnalysisTypeState("HaploReg");
    setFormValues(testValues);
    fileInput.current.querySelector("input").disabled = true;
  };

  const handleRemoveUseTest = (event: any) => {
    setUseTest(false);
    setFormValues(undefined);
    setAnalysisTypeState("HaploReg");
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

  const handleAnalysisChange = (event: any) => {
    const { onChange } = formik.getFieldProps("analysisType");
    onChange(event);
    setAnalysisTypeState(event.target.value);
  };

  const populations = [
    { variable: "AFR", name: "AFR" },
    { variable: "EUR", name: "EUR" },
    { variable: "AMR", name: "AMR" },
    { variable: "EAS", name: "EAS" },
    { variable: "SAS", name: "SAS" },
  ];

  const epiOptions = [
    { variable: "vanilla", name: "VANILLA" },
    { variable: "imputed", name: "IMPUTED" },
    { variable: "methyl", name: "METHYL" },
  ];

  const AnalysisOptions = [
    { variable: "HaploReg", name: "HAPLOREG" },
    { variable: "Regulome", name: "REGULOME" },
  ];

  const consOptions = [
    { variable: "gerp", name: "GERP" },
    { variable: "siphy", name: "SIPHY" },
    { variable: "both", name: "BOTH" },
  ];

  const genetypesOptions = [
    { variable: "gencode", name: "GENCODE" },
    { variable: "refseq", name: "REFSEQ" },
  ];

  const assemblyOptions = [
    { variable: "37", name: "GRCh37" },
    { variable: "38", name: "GRCh38" },
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
          <div className={classes.header_div}>
            <h2>Enter a Job Name</h2>
          </div>
          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"Job Name"}
            textVariable={"job_name"}
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
              />
            </>
          )}
          <div className={classes.header_div}>
            <h2>Tool Parameters</h2>
          </div>
          <Grid className={classes.grid} item xs={12} sm={4}>
            <Paper variant="outlined" className={classes.paper}>
              <FormControl
                className={classes.formControl}
                error={selectIsError(formik, "analysisType")}
              >
                <InputLabel htmlFor={"analysisType"}>
                  Select type of analysis
                </InputLabel>
                <NativeSelect
                  id={"analysisType"}
                  name={"analysisType"}
                  onBlur={formik.handleBlur}
                  onChange={handleAnalysisChange}
                  value={formik.values.analysisType}
                >
                  <option aria-label="None" value="" />
                  {AnalysisOptions.map((db, i) => (
                    <option key={i} value={db.variable}>
                      {db.name}
                    </option>
                  ))}
                </NativeSelect>
                {selectErrorHelper(formik, "analysisType")}
              </FormControl>
            </Paper>
          </Grid>
          <div className={classes.header_div}>
            <h2>Other Tool Parameters</h2>
          </div>
          {analysisTypeState === "Regulome" && (
            <>
              <CommonTextElement
                classes={classes}
                formik={formik}
                label={"SNP ID"}
                textVariable={"snpID"}
              />

              <SelectFieldsElement
                classes={classes}
                formik={formik}
                selectElement={assemblyOptions}
                selectVariable={"genomeAssembly"}
                selectName={"Genome Assembly"}
              />
            </>
          )}
          {analysisTypeState === "HaploReg" && (
            <>
              {/*<div className={classes.header_div}>*/}
              {/*  <h2>Upload a file</h2>*/}
              {/*</div>*/}
              <CommonFileElement
                classes={classes}
                formik={formik}
                fileInput={fileInput}
                handleFileUploadChange={handleFileUploadChange}
                handleFileBlur={handleFileBlur}
                handleRemove={handleRemove}
              />
              <div className={mainClasses.info_text}>
                Maximum number of SNPs is 5000
              </div>
              <div className={classes.header_div}>
                <h2>Summary statistics column positions</h2>
              </div>
              {generalFileForm(classes, formik, [
                {
                  title: "marker_name",
                  text:
                    "the column number of the marker name in the summary statistic file. It can be marker_name, rsid, snpid etc",
                },
              ])}
              <div className={classes.header_div}>
                <h2>More Parameters</h2>
              </div>
              <CommonTextElement
                classes={classes}
                formik={formik}
                label={"LD Threshold"}
                textVariable={"ldThresh"}
                tooltip={"Linkage disequilibrium threshold"}
              />
              <SelectFieldsElement
                classes={classes}
                formik={formik}
                selectElement={populations}
                selectVariable={"ldPop"}
                selectName={"Population"}
                tooltip={
                  "The population from which the variants were obtained to be used for LD calculation."
                }
              />
              <SelectFieldsElement
                classes={classes}
                formik={formik}
                selectElement={epiOptions}
                selectVariable={"epi"}
                selectName={"EPI Options"}
                tooltip={
                  "Source of the epigenome. There four possible values for this parameter which are vanilla for querying ChromHMM (Core 15-state model), imputed for querying ChromHMM (25-state model using 12 imputed marks), amd methyl for querying H3K4me1/H3K4me3 peaks and acetyl for querying H3K27ac/H3K9ac peaks."
                }
              />
              <SelectFieldsElement
                classes={classes}
                formik={formik}
                selectElement={consOptions}
                selectVariable={"cons"}
                selectName={"CONS Options"}
                tooltip={
                  "Mammalian conservation algorithm to be used. There are three possible values for this parameter which are: gerp for GERP algorithm, siphy for SiPhy-omega algorithm, and both to use both algorithms."
                }
              />
              <SelectFieldsElement
                classes={classes}
                formik={formik}
                selectElement={genetypesOptions}
                selectVariable={"genetypes"}
                selectName={"Genetype Options"}
                tooltip={
                  "The genomic coordinates for querying. There are possible values for this parameter, which are gencode for using Gencode genes coordinates and refseq for using RefSeq genes coordinates."
                }
              />
            </>
          )}
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
            >
              Execute <Hidden xsDown> Analysis</Hidden>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegHaploRForm;
