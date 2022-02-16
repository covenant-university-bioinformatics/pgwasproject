import React, { useRef, useState } from "react";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import classes from "../../utility/form_styles.module.scss";
// import mainClasses from "./index.module.scss";
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
  email?: string;
  useTest: boolean;
  marker_name?: string;
  p_value?: string;
  population: string;
  ld_analysis: string;
  pairwise_snp1?: string;
  pairwise_snp2?: string;
  allLDValues_snp1?: string;
  allLDValues_ld_window_kb?: string;
  allLDValues_ld_window?: string;
  allLDValues_ld_window_r2?: string;
  clumping_clump_p1?: string;
  clumping_clump_p2?: string;
  clumping_clump_r2?: string;
  clumping_clump_kb?: string;
  clumping_allow_overlap?: string;
  clumping_use_gene_region_file?: string;
  clumping_clump_range?: string;
  clumping_range_border?: string;
};

type LDAnalysis = "pairwise" | "all_LD_values" | "clumping";

const LdStructureForm: React.FC<Props> = (props) => {
  const { user } = useTypedSelector((state) => state.auth);
  const [uploadFile, setUploadFile] = useState<any>(null);
  const [useTest, setUseTest] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<UserFormData>();
  const fileInput = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [ldAnalysisType, setLDAnalysisType] = useState<LDAnalysis>("pairwise");

  const initialValues = {
    filename: "",
    job_name: "",
    ...(!user?.username && { email: "" }),
    // email: undefined,
    useTest: false,
    marker_name: "",
    p_value: "",
    population: "",
    ld_analysis: "pairwise",
    pairwise_snp1: "",
    pairwise_snp2: "",
    allLDValues_snp1: "",
    allLDValues_ld_window_kb: "",
    allLDValues_ld_window: "",
    allLDValues_ld_window_r2: "",
    clumping_clump_p1: "",
    clumping_clump_p2: "",
    clumping_clump_r2: "",
    clumping_clump_kb: "",
    clumping_allow_overlap: "",
    clumping_use_gene_region_file: "",
    clumping_clump_range: "",
    clumping_range_border: "",
  };

  const testValues = {
    filename: "test.txt",
    job_name: "LD Values",
    ...(!user?.username && { email: "" }),
    useTest: true,
    // marker_name: "1",
    // p_value: "2",
    population: "afr",
    ld_analysis: "all_LD_values",
    // pairwise_snp1: "rs2840528",
    // pairwise_snp2: "rs123",
    allLDValues_snp1: "rs2840528",
    allLDValues_ld_window_kb: "50",
    allLDValues_ld_window: "1000",
    allLDValues_ld_window_r2: "0.5",
    // clumping_clump_p1: "0.1",
    // clumping_clump_p2: "0.05",
    // clumping_clump_r2: "0.8",
    // clumping_clump_kb: "50",
    // clumping_allow_overlap: "No",
    // clumping_use_gene_region_file: "Yes",
    // clumping_clump_range: "glist-hg19",
    // clumping_range_border: "0",
  };

  const formik = useFormik<UserFormData>({
    initialValues: formValues || initialValues,
    enableReinitialize: true,

    validationSchema: Yup.object({
      job_name: Yup.string().required("Job name is required"),
      ...(!user?.username && {
        email: Yup.string().email().required("Email field is required"),
      }),
      population: Yup.string().required("This input is required"),
      ld_analysis: Yup.string().required("Please select a value"),
      ...(ldAnalysisType === "pairwise" && {
        pairwise_snp1: Yup.string().required("This input is required"),
        pairwise_snp2: Yup.string().required("This input is required"),
      }),
      ...(ldAnalysisType === "all_LD_values" && {
        allLDValues_snp1: Yup.string().required("This input is required"),
        allLDValues_ld_window_kb: Yup.number().required(
          "This value is required and must be a number value"
        ),
        allLDValues_ld_window: Yup.number().required(
          "This value is required and must be a number value"
        ),
        allLDValues_ld_window_r2: Yup.number().required(
          "This value is required and must be a number value"
        ),
      }),
      ...(ldAnalysisType === "clumping" && {
        filename: Yup.string().required("Please upload a file"),
        marker_name: Yup.number()
          .required("Marker name column number is required")
          .min(1, "The minimum is one")
          .max(15, "the max is fifteen"),
        p_value: Yup.number()
          .required("P-Value column number is required")
          .min(1, "The minimum is one")
          .max(15, "the max is fifteen"),
        clumping_clump_p1: Yup.number().required(
          "This value is required and must be a number value"
        ),
        clumping_clump_p2: Yup.number().required(
          "This value is required and must be a number value"
        ),
        clumping_clump_r2: Yup.number().required(
          "This value is required and must be a number value"
        ),
        clumping_clump_kb: Yup.number().required(
          "This value is required and must be a number value"
        ),
        clumping_allow_overlap: Yup.string().required("Please select a value"),
        clumping_use_gene_region_file: Yup.string().required(
          "Please select a value"
        ),
        clumping_clump_range: Yup.string().required("This input is required"),
        clumping_range_border: Yup.string().required("This input is required"),
      }),
    }),
    onSubmit: (values: FormikValues) => {
      // console.log(values);
      let results: Partial<{
        job_name: string;
        useTest: boolean;
        population: string;
        ld_analysis: string;
        pairwise_snp1: string;
        pairwise_snp2: string;
        allLDValues_snp1: string;
        allLDValues_ld_window_kb: string;
        allLDValues_ld_window: string;
        allLDValues_ld_window_r2: string;
        filename: string;
        marker_name: string;
        p_value: string;
        clumping_clump_p1: string;
        clumping_clump_p2: string;
        clumping_clump_r2: string;
        clumping_clump_kb: string;
        clumping_allow_overlap: string;
        clumping_use_gene_region_file: string;
        clumping_clump_range: string;
        clumping_range_border: string;
        email?: string;
      }> = {};
      if (values.ld_analysis === "pairwise") {
        results = {
          job_name: values.job_name,
          useTest: values.useTest,
          population: values.population,
          ld_analysis: values.ld_analysis,
          pairwise_snp1: values.pairwise_snp1,
          pairwise_snp2: values.pairwise_snp2,
        };
      } else if (values.ld_analysis === "all_LD_values") {
        results = {
          job_name: values.job_name,
          useTest: values.useTest,
          population: values.population,
          ld_analysis: values.ld_analysis,
          allLDValues_snp1: values.allLDValues_snp1,
          allLDValues_ld_window_kb: values.allLDValues_ld_window_kb,
          allLDValues_ld_window: values.allLDValues_ld_window,
          allLDValues_ld_window_r2: values.allLDValues_ld_window_r2,
        };
      } else if (values.ld_analysis === "clumping") {
        results = {
          job_name: values.job_name,
          useTest: values.useTest,
          population: values.population,
          ld_analysis: values.ld_analysis,
          filename: values.filename,
          marker_name: values.marker_name,
          p_value: values.p_value,
          clumping_clump_p1: values.clumping_clump_p1,
          clumping_clump_p2: values.clumping_clump_p2,
          clumping_clump_r2: values.clumping_clump_r2,
          clumping_clump_kb: values.clumping_clump_kb,
          clumping_allow_overlap: values.clumping_allow_overlap,
          clumping_use_gene_region_file: values.clumping_use_gene_region_file,
          clumping_clump_range: values.clumping_clump_range,
          clumping_range_border: values.clumping_range_border,
        };
      }

      if (user?.username) {
        submitToServer(
          results,
          uploadFile,
          setLoading,
          "ldstructure",
          "ldstructure",
          user.username,
          props
        );
      } else {
        results.email = values.email;
        submitToServer(
          results,
          uploadFile,
          setLoading,
          "ldstructure/noauth",
          "ldstructure",
          undefined,
          props
        );
      }

      console.log(results);
    },
  });

  const handleUseTest = (event: any) => {
    formik.resetForm();
    setUseTest(true);
    setLDAnalysisType("all_LD_values");
    setFormValues(testValues);
    // fileInput.current.querySelector("input").disabled = true;
  };

  const handleRemoveUseTest = (event: any) => {
    setUseTest(false);
    setFormValues(undefined);
    setLDAnalysisType("pairwise");
    formik.setFieldValue("filename", "");
    // fileInput.current.querySelector("input").value = "";
    // fileInput.current.querySelector("input").disabled = false;
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

  const handleLDAnalysisChange = (event: any) => {
    const { onChange } = formik.getFieldProps("ld_analysis");
    onChange(event);
    setLDAnalysisType(event.target.value);
  };

  const populations = [
    { variable: "afr", name: "AFR" },
    { variable: "eur", name: "EUR" },
    { variable: "amr", name: "AMR" },
    { variable: "eas", name: "EAS" },
    { variable: "sas", name: "SAS" },
  ];

  const yesNoOptions = [
    { variable: "Yes", name: "YES" },
    { variable: "No", name: "NO" },
  ];

  const LDAnalysisOptions = [
    { variable: "pairwise", name: "Pairwise" },
    { variable: "all_LD_values", name: "ALL LD Values" },
    { variable: "clumping", name: "Clumping" },
  ];

  const clumpRangeOptions = [
    { variable: "glist-hg19", name: "glist-hg19" },
    { variable: "glist-hg38", name: "glist-hg38" },
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
          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={populations}
            selectVariable={"population"}
            selectName={"Population"}
          />
          <Grid className={classes.grid} item xs={12} sm={4}>
            <Paper variant="outlined" className={classes.paper}>
              <FormControl
                className={classes.formControl}
                error={selectIsError(formik, "ld_analysis")}
              >
                <InputLabel htmlFor={"ld_analysis"}>
                  Select type of LD analysis
                </InputLabel>
                <NativeSelect
                  id={"ld_analysis"}
                  name={"ld_analysis"}
                  onBlur={formik.handleBlur}
                  onChange={handleLDAnalysisChange}
                  value={formik.values.ld_analysis}
                >
                  <option aria-label="None" value="" />
                  {LDAnalysisOptions.map((db, i) => (
                    <option key={i} value={db.variable}>
                      {db.name}
                    </option>
                  ))}
                </NativeSelect>
                {selectErrorHelper(formik, "ld_analysis")}
              </FormControl>
            </Paper>
          </Grid>
          <div className={classes.header_div}>
            <h2>Other Tool Parameters</h2>
          </div>
          {ldAnalysisType === "pairwise" && (
            <>
              <CommonTextElement
                classes={classes}
                formik={formik}
                label={"SNP One"}
                textVariable={"pairwise_snp1"}
              />

              <CommonTextElement
                classes={classes}
                formik={formik}
                label={"SNP Two"}
                textVariable={"pairwise_snp2"}
              />
            </>
          )}
          {ldAnalysisType === "all_LD_values" && (
            <>
              <CommonTextElement
                classes={classes}
                formik={formik}
                label={"SNP ID"}
                textVariable={"allLDValues_snp1"}
              />
              <CommonTextElement
                classes={classes}
                formik={formik}
                label={"LD Window(KB)"}
                textVariable={"allLDValues_ld_window_kb"}
              />
              <CommonTextElement
                classes={classes}
                formik={formik}
                label={"LD Window"}
                textVariable={"allLDValues_ld_window"}
              />
              <CommonTextElement
                classes={classes}
                formik={formik}
                label={"R-squared threshold"}
                textVariable={"allLDValues_ld_window_r2"}
              />
            </>
          )}
          {ldAnalysisType === "clumping" && (
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
              <div className={classes.header_div}>
                <h2>Summary statistics column positions</h2>
              </div>
              {generalFileForm(classes, formik, ["marker_name", "p_value"])}
              <div className={classes.header_div}>
                <h2>More Parameters</h2>
              </div>
              <CommonTextElement
                classes={classes}
                formik={formik}
                label={"Clump P1"}
                textVariable={"clumping_clump_p1"}
              />
              <CommonTextElement
                classes={classes}
                formik={formik}
                label={"Clump P2"}
                textVariable={"clumping_clump_p2"}
              />
              <CommonTextElement
                classes={classes}
                formik={formik}
                label={"Clump R squared"}
                textVariable={"clumping_clump_r2"}
              />
              <CommonTextElement
                classes={classes}
                formik={formik}
                label={"Clump KB"}
                textVariable={"clumping_clump_kb"}
              />
              <SelectFieldsElement
                classes={classes}
                formik={formik}
                selectElement={yesNoOptions}
                selectVariable={"clumping_allow_overlap"}
                selectName={"Clump Allow Overlap"}
              />
              <SelectFieldsElement
                classes={classes}
                formik={formik}
                selectElement={yesNoOptions}
                selectVariable={"clumping_use_gene_region_file"}
                selectName={"Clump Use Gene Region File"}
              />
              <SelectFieldsElement
                classes={classes}
                formik={formik}
                selectElement={clumpRangeOptions}
                selectVariable={"clumping_clump_range"}
                selectName={"Clump Range"}
              />
              <CommonTextElement
                classes={classes}
                formik={formik}
                label={"Clump Range Border"}
                textVariable={"clumping_range_border"}
              />
            </>
          )}
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
            >
              Execute <Hidden xsDown> Analysis</Hidden>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LdStructureForm;
