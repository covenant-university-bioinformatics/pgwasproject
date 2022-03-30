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
import { GetAppRounded, PlayArrow } from "@material-ui/icons";
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
  marker_name: string;
  chr: string;
  pos: string;
  ref: string;
  alt: string;
  zscore: string;
  af: string;
  af_available: string;
  ASW?: string;
  CEU?: string;
  CHB?: string;
  CHS?: string;
  CLM?: string;
  FIN?: string;
  GBR?: string;
  IBS?: string;
  JPT?: string;
  LWK?: string;
  MXL?: string;
  PUR?: string;
  TSI?: string;
  YRI?: string;
  chromosome: string;
  windowSize: string;
  wingSize: string;
};

const ImputationForm: React.FC<Props> = (props) => {
  const { user } = useTypedSelector((state) => state.auth);
  const [uploadFile, setUploadFile] = useState<any>(null);
  const [useTest, setUseTest] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<UserFormData>();
  const fileInput = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [afAvailable, setAfAvailable] = useState<boolean>(true);

  const initialValues = {
    filename: "",
    job_name: "",
    ...(!user?.username && { email: "" }),
    useTest: false,
    marker_name: "",
    chr: "",
    pos: "",
    ref: "",
    alt: "",
    zscore: "",
    af: "",
    af_available: "true",
    ASW: "",
    CEU: "",
    CHB: "",
    CHS: "",
    CLM: "",
    FIN: "",
    GBR: "",
    IBS: "",
    JPT: "",
    LWK: "",
    MXL: "",
    PUR: "",
    TSI: "",
    YRI: "",
    chromosome: "",
    windowSize: "",
    wingSize: "",
  };

  const testValues = {
    filename: "test.txt",
    job_name: "Test Impute",
    ...(!user?.username && { email: "" }),
    useTest: true,
    marker_name: "1",
    chr: "2",
    pos: "3",
    ref: "4",
    alt: "5",
    zscore: "6",
    af: "7",
    af_available: "true",
    chromosome: "22",
    windowSize: "1",
    wingSize: "0.5",
  };

  const formik = useFormik<UserFormData>({
    initialValues: formValues || initialValues,
    enableReinitialize: true,

    validationSchema: Yup.object({
      job_name: Yup.string().required("Job name is required"),
      ...(!user?.username && {
        email: Yup.string().email().required("Email field is required"),
      }),
      filename: Yup.string().required("Please upload a file"),
      marker_name: Yup.number()
        .required("Marker name column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      chr: Yup.number()
        .required("Chromosome column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      pos: Yup.number()
        .required("Position column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      ref: Yup.number()
        .required("Ref Allele column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      alt: Yup.number()
        .required("Alternate allele column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      zscore: Yup.number()
        .required("Zscore column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      af_available: Yup.string().required("Please select a value"),
      chromosome: Yup.string().required("Please select a value"),
      windowSize: Yup.string().required("This input is required"),
      wingSize: Yup.string().required("This input is required"),
      ...(afAvailable && {
        af: Yup.number()
          .required("Allele frequency column number is required")
          .min(1, "The minimum is one")
          .max(15, "the max is fifteen"),
      }),
      ...(!afAvailable && {
        ASW: Yup.number().required(
          "This value is required and must be a number value"
        ),
        CEU: Yup.number().required(
          "This value is required and must be a number value"
        ),
        CHB: Yup.number().required(
          "This value is required and must be a number value"
        ),
        CHS: Yup.number().required(
          "This value is required and must be a number value"
        ),
        CLM: Yup.number().required(
          "This value is required and must be a number value"
        ),
        FIN: Yup.number().required(
          "This value is required and must be a number value"
        ),
        GBR: Yup.number().required(
          "This value is required and must be a number value"
        ),
        IBS: Yup.number().required(
          "This value is required and must be a number value"
        ),
        JPT: Yup.number().required(
          "This value is required and must be a number value"
        ),
        LWK: Yup.number().required(
          "This value is required and must be a number value"
        ),
        MXL: Yup.number().required(
          "This value is required and must be a number value"
        ),
        PUR: Yup.number().required(
          "This value is required and must be a number value"
        ),
        TSI: Yup.number().required(
          "This value is required and must be a number value"
        ),
        YRI: Yup.number().required(
          "This value is required and must be a number value"
        ),
      }),
    }),
    onSubmit: (values: FormikValues) => {
      // console.log(values);
      let results: Partial<UserFormData>;

      results = {
        filename: values.filename,
        job_name: values.job_name,
        useTest: values.useTest,
        marker_name: values.marker_name,
        chr: values.chr,
        pos: values.pos,
        ref: values.ref,
        alt: values.alt,
        zscore: values.zscore,
        af_available: values.af_available,
        chromosome: values.chromosome,
        windowSize: values.windowSize,
        wingSize: values.wingSize,
      };

      if (values.af_available === "true") {
        results.af = values.af;
      }

      if (values.af_available === "false") {
        results.ASW = values.ASW;
        results.CEU = values.CEU;
        results.CHB = values.CHB;
        results.CHS = values.CHS;
        results.CLM = values.CLM;
        results.FIN = values.FIN;
        results.GBR = values.GBR;
        results.IBS = values.IBS;
        results.JPT = values.JPT;
        results.LWK = values.LWK;
        results.MXL = values.MXL;
        results.PUR = values.PUR;
        results.TSI = values.TSI;
        results.YRI = values.YRI;
      }

      if (user?.username) {
        submitToServer(
          results,
          uploadFile,
          setLoading,
          "imputation",
          "imputation",
          user.username,
          props
        );
      } else {
        results.email = values.email;
        submitToServer(
          results,
          uploadFile,
          setLoading,
          "imputation/noauth",
          "imputation",
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
    setAfAvailable(true);
    setFormValues(testValues);
    fileInput.current.querySelector("input").disabled = true;
  };

  const handleRemoveUseTest = (event: any) => {
    setUseTest(false);
    setFormValues(undefined);
    setAfAvailable(true);
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

  const handleAFAvailableChange = (event: any) => {
    const { onChange } = formik.getFieldProps("af_available");
    onChange(event);
    const value = event.target.value === "true";
    setAfAvailable(value);
  };

  // console.log(formik);

  const populations = [
    { variable: "ASW", name: "ASW" },
    { variable: "CEU", name: "CEU" },
    { variable: "CHB", name: "CHB" },
    { variable: "CHS", name: "CHS" },
    { variable: "CLM", name: "CLM" },
    { variable: "FIN", name: "FIN" },
    { variable: "GBR", name: "GBR" },
    { variable: "IBS", name: "IBS" },
    { variable: "JPT", name: "JPT" },
    { variable: "LWK", name: "LWK" },
    { variable: "MXL", name: "MXL" },
    { variable: "PUR", name: "PUR" },
    { variable: "TSI", name: "TSI" },
    { variable: "YRI", name: "YRI" },
  ];

  const trueFalseOptions = [
    { variable: "true", name: "TRUE" },
    { variable: "false", name: "FALSE" },
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
              "https://drive.google.com/file/d/1uPFzNvdrIa3Ll8w3Znd69MGeaBE9Mmhg/view?usp=sharing"
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
            <h2>Allele Frequency Available in Summary Statistics</h2>
          </div>
          <Grid className={classes.grid} item xs={12} sm={4}>
            <Paper variant="outlined" className={classes.paper}>
              <FormControl
                className={classes.formControl}
                error={selectIsError(formik, "af_available")}
              >
                <InputLabel htmlFor={"af_available"}>Select value</InputLabel>
                <NativeSelect
                  id={"af_available"}
                  name={"af_available"}
                  onBlur={formik.handleBlur}
                  onChange={handleAFAvailableChange}
                  value={formik.values.af_available}
                >
                  <option aria-label="None" value="" />
                  {trueFalseOptions.map((db, i) => (
                    <option key={i} value={db.variable}>
                      {db.name}
                    </option>
                  ))}
                </NativeSelect>
                {selectErrorHelper(formik, "af_available")}
              </FormControl>
            </Paper>
          </Grid>
          <div className={classes.header_div}>
            <h2>Summary statistics column positions</h2>
          </div>
          {generalFileForm(classes, formik, [
            "marker_name",
            "chr",
            "pos",
            "ref",
            "alt",
            "zscore",
          ])}
          {afAvailable && (
            <CommonTextElement
              classes={classes}
              formik={formik}
              label={"Allele Frequency column number"}
              textVariable={"af"}
            />
          )}
          <div className={classes.header_div}>
            <h2>Tool Parameters</h2>
          </div>

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={chromosomes}
            selectVariable={"chromosome"}
            selectName={"Chromosome"}
          />

          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"Window Size"}
            textVariable={"windowSize"}
          />
          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"Wing Size"}
            textVariable={"wingSize"}
          />

          {!afAvailable && (
            <>
              <div className={classes.header_div}>
                <h2>Population Proportions</h2>
              </div>
              {populations.map((element) => (
                <CommonTextElement
                  key={element.name}
                  classes={classes}
                  formik={formik}
                  label={element.name}
                  textVariable={element.variable}
                />
              ))}
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

export default ImputationForm;
