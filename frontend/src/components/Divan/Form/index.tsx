import React, { useRef, useState } from "react";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import classes from "../../utility/form_styles.module.scss";
import {Button, CircularProgress, FormControl, Grid, Hidden, InputLabel, NativeSelect, Paper} from "@material-ui/core";
import {generalFileForm, selectErrorHelper} from "../../utility/general";
import { GetAppRounded, PlayArrow } from "@material-ui/icons";
import {toast} from "react-toastify";
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
import {selectIsError} from "../../utility/general_utils";
// import classes from "./index.module.scss";

type Props = {};

type UserFormData = {
  filename: string;
  job_name: string;
  useTest: boolean;
  email?: string;
  marker_name?: string;
  chr?: string;
  start_position?: string;
  stop_position?: string;
  variant_type: string;
  disease: string;
  variant_db?: string;
  input_type: string;
};

const DivanForm: React.FC<Props & RouteComponentProps> = (props) => {
  const { user } = useTypedSelector((state) => state.auth);
  const [uploadFile, setUploadFile] = useState<any>(null);
  const [useTest, setUseTest] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<UserFormData>();
  const fileInput = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState("variant_based");
  const [variantType, setVariantType] = useState("known")

  const initialValues = {
    filename: "",
    job_name: "",
    ...(!user?.username && { email: "" }),
    useTest: false,
    marker_name: "",
    chr: "",
    start_position: "",
    stop_position: "",
    variant_type: "known",
    disease: "",
    variant_db: "",
    input_type: "variant_based",
  };

  const testValues = {
    filename: "test.txt",
    job_name: "Test Divan",
    ...(!user?.username && { email: "" }),
    useTest: true,
    chr: "1",
    start_position: "2",
    stop_position: "3",
    variant_type: "known",
    disease: "BehcetSyndrome",
    variant_db: "1KG",
    input_type: "region_based",
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
      ...(inputType === "variant_based" &&
          {
            marker_name: Yup.number()
                .required("Marker name column number is required")
                .min(1, "The minimum is one")
                .max(15, "the max is fifteen")
          }
      ),
      ...(inputType === "region_based" &&
          {
            chr: Yup.number()
                .required("Chromosome column number is required")
                .min(1, "The minimum is one")
                .max(15, "the max is fifteen")
          }
      ),
      ...(inputType === "region_based" &&
          {
            start_position: Yup.number()
                .required("Start position column number is required")
                .min(1, "The minimum is one")
                .max(15, "the max is fifteen")
          }
      ),
      ...(inputType === "region_based" &&
          {
            stop_position: Yup.number()
                .required("Stop position column number is required")
                .min(1, "The minimum is one")
                .max(15, "the max is fifteen")
          }
      ),
      variant_type: Yup.string().required("Please select a value"),
      disease: Yup.string().required("Please select a disease"),
      input_type: Yup.string().required("Please select an input type"),
      ...(
          variantType === "known" && {
            variant_db: Yup.string().required("Please select a variant database")
          }
      ),
    }),

    onSubmit: (values: FormikValues) => {
      // console.log(values);
      if(values.variant_type === "unknown" && values.input_type === "variant_based"){
        toast.info("Your input type must be a region based file when using unknown variant type")
        return;
      }
      let results: Partial<UserFormData>;
      results = {
        filename: values.filename,
        job_name: values.job_name,
        useTest: values.useTest,
        variant_type: values.variant_type,
        disease: values.disease,
        input_type: values.input_type
      }

      if(values.input_type === "variant_based"){
        results.marker_name = values.marker_name
      }

      if(values.input_type === "region_based"){
        results.chr = values.chr
        results.start_position = values.start_position
        results.stop_position = values.stop_position
      }

      if(values.variant_type === "known"){
        results.variant_db = values.variant_db
      }

      if (user?.username) {
        submitToServer(
          results,
          uploadFile,
          setLoading,
          "divan",
          "divan",
          user.username,
          props
        );
      } else {
        results.email = values.email;
        submitToServer(
          results,
          uploadFile,
          setLoading,
          "divan/noauth",
          "divan",
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
    setInputType("region_based");
    fileInput.current.querySelector("input").disabled = true;
  };

  const handleRemoveUseTest = (event: any) => {
    formik.resetForm();
    setUseTest(false);
    setFormValues(initialValues);
    setInputType("variant_based");
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

  const handleInputTypeChange = (event: any) => {
    const { onChange } = formik.getFieldProps("input_type");
    onChange(event);
    setInputType(event.target.value);
  };

  const handleVariantTypeChange = (event: any) => {
    const { onChange } = formik.getFieldProps("variant_type");
    onChange(event);
    setVariantType(event.target.value);
  };

  const VariantTypeOptions = [
    { variable: "known", name: "KNOWN" },
    { variable: "unknown", name: "UNKNOWN" },
  ];

  const InputTypeOptions = [
    { variable: "variant_based", name: "VARIANT BASED" },
    { variable: "region_based", name: "REGION BASED" },
  ];

  const VariantDBOptions = [
    { variable: "1KG", name: "KGP" },
    { variable: "cosmic", name: "COSMIC" },
    { variable: "Ensembl", name: "ENSEMBL" },
  ];

  const DiseaseOptions = [
    {variable: "Albuminuria", name: "Albuminuria"},
    {variable: "Alcoholism", name: "Alcoholism"},
    {variable: "AlzheimerDisease", name: "AlzheimerDisease"},
    {variable: "AmyotrophicLateralSclerosis", name: "AmyotrophicLateralSclerosis"},
    {variable: "Arthritis_Rheumatoid", name: "Arthritis_Rheumatoid"},
    {variable: "Asthma", name: "Asthma"},
    {variable: "AttentionDeficitDisorderwithHyperactivity", name: "AttentionDeficitDisorderwithHyperactivity"},
    {variable: "BehcetSyndrome", name: "BehcetSyndrome"},
    {variable: "BipolarDisorder", name: "BipolarDisorder"},
    {variable: "BodyWeightChanges", name: "BodyWeightChanges"},
    {variable: "BodyWeight", name: "BodyWeight"},
    {variable: "BreastNeoplasms", name: "BreastNeoplasms"},
    {variable: "CardiovascularDiseases", name: "CardiovascularDiseases"},
    {variable: "CarotidArteryDiseases", name: "CarotidArteryDiseases"},
    {variable: "Colitis_Ulcerative", name: "Colitis_Ulcerative"},
    {variable: "CoronaryArteryDisease", name: "CoronaryArteryDisease"},
    {variable: "CoronaryDisease", name: "CoronaryDisease"},
    {variable: "CrohnDisease", name: "CrohnDisease"},
    {variable: "Death_Sudden_Cardiac", name: "Death_Sudden_Cardiac"},
    {variable: "DepressiveDisorder_Major", name: "DepressiveDisorder_Major"},
    {variable: "DiabetesMellitus_Type1", name: "DiabetesMellitus_Type1"},
    {variable: "DiabetesMellitus_Type2", name: "DiabetesMellitus_Type2"},
    {variable: "DiabeticNephropathies", name: "DiabeticNephropathies"},
    {variable: "HeartFailure", name: "HeartFailure"},
    {variable: "Hypertension", name: "Hypertension"},
    {variable: "Hypertrophy_LeftVentricular", name: "Hypertrophy_LeftVentricular"},
    {variable: "Inflammation", name: "Inflammation"},
    {variable: "InflammatoryBowelDiseases", name: "InflammatoryBowelDiseases"},
    {variable: "InsulinResistance", name: "InsulinResistance"},
    {variable: "LupusErythematosus_Systemic", name: "LupusErythematosus_Systemic"},
    {variable: "MacularDegeneration", name: "MacularDegeneration"},
    {variable: "MentalCompetency", name: "MentalCompetency"},
    {variable: "MetabolicSyndromeX", name: "MetabolicSyndromeX"},
    {variable: "MultipleSclerosis", name: "MultipleSclerosis"},
    {variable: "MyocardialInfarction", name: "MyocardialInfarction"},
    {variable: "Neuroblastoma", name: "Neuroblastoma"},
    {variable: "Obesity", name: "Obesity"},
    {variable: "Osteoporosis", name: "Osteoporosis"},
    {variable: "PancreaticNeoplasms", name: "PancreaticNeoplasms"},
    {variable: "ParkinsonDisease", name: "ParkinsonDisease"},
    {variable: "ProstaticNeoplasms", name: "ProstaticNeoplasms"},
    {variable: "Psoriasis", name: "Psoriasis"},
    {variable: "Schizophrenia", name: "Schizophrenia"},
    {variable: "Sleep", name: "Sleep"},
  ]

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
              "https://drive.google.com/file/d/1DQHq1M6-TjzlWOKMhoOBM0tSWpEdS1Ko/view?usp=sharing"
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
            <h2>Input Type</h2>
          </div>

          <Grid className={classes.grid} item xs={12} sm={4}>
            <Paper variant="outlined" className={classes.paper}>
              <FormControl
                  className={classes.formControl}
                  error={selectIsError(formik, "input_type")}
              >
                <InputLabel htmlFor={"input_type"}>Select Input Type</InputLabel>
                <NativeSelect
                    id={"input_type"}
                    name={"input_type"}
                    onBlur={formik.handleBlur}
                    onChange={handleInputTypeChange}
                    value={formik.values.input_type}
                >
                  <option aria-label="None" value="" />
                  {InputTypeOptions.map((db, i) => (
                      <option key={i} value={db.variable}>
                        {db.name}
                      </option>
                  ))}
                </NativeSelect>
                {selectErrorHelper(formik, "input_type")}
              </FormControl>
            </Paper>
          </Grid>

          <div className={classes.header_div}>
            <h2>Summary statistics column positions</h2>
          </div>

          {
            inputType === "variant_based"
              ? generalFileForm(classes, formik, [
                  {
                    title: "marker_name",
                    text:
                        "the column number of the marker name in the summary statistic file. It can be marker_name, rsid, snpid etc",
                  }])
                : generalFileForm(classes, formik, [
                  {
                    title: "chr",
                    text:
                        "the column number of the chromosome in the summary statistic file. It can be also be chr",
                  },
                  {
                    title: "start_position",
                    text:
                        "the column number of the base pair positions in the summary statistic file. It can be bp",
                  },
                  {
                    title: "stop_position",
                    text:
                        "the column number of the base pair positions in the summary statistic file.",
                  }
                ])
          }

          <div className={classes.header_div}>
            <h2>Tool Parameters</h2>
          </div>

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={DiseaseOptions}
            selectVariable={"disease"}
            selectName={"Disease"}
            tooltip={
              "Disease name where users can choose a trait out of the given 45 diseases."
            }
          />

          <Grid className={classes.grid} item xs={12} sm={4}>
            <Paper variant="outlined" className={classes.paper}>
              <FormControl
                  className={classes.formControl}
                  error={selectIsError(formik, "variant_type")}
              >
                <InputLabel htmlFor={"variant_type"}>Select Variant Type</InputLabel>
                <NativeSelect
                    id={"variant_type"}
                    name={"variant_type"}
                    onBlur={formik.handleBlur}
                    onChange={handleVariantTypeChange}
                    value={formik.values.variant_type}
                >
                  <option aria-label="None" value="" />
                  {VariantTypeOptions.map((db, i) => (
                      <option key={i} value={db.variable}>
                        {db.name}
                      </option>
                  ))}
                </NativeSelect>
                {selectErrorHelper(formik, "variant_type")}
              </FormControl>
            </Paper>
          </Grid>

          {
            variantType === "known" ?
                <SelectFieldsElement
                    classes={classes}
                    formik={formik}
                    selectElement={VariantDBOptions}
                    selectVariable={"variant_db"}
                    selectName={"Variant Database"}
                    tooltip={"In case of  the known variants,  users can specify the  variant database such as 1000 genomes, cosmic, or  Ensembl."}
                />
                : null
          }

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

export default DivanForm;
