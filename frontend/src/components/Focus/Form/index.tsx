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
  marker_name: string;
  chr: string;
  position: string;
  effect_allele: string;
  alternate_allele: string;
  freq: string;
  beta: string;
  se: string;
  p_value: string;
  sample_size: string;
  locations: string;
  population: string;
  chromosome: string;
  all_gwas_sig: string;
  p_threshold: string;
  ridge_term: string;
  intercept: string;
  max_genes: string;
  prior_prob: string;
  credible_level: string;
  min_r2pred: string;
  max_impute: string;
  plot: string;
  tissue: string;
  start: string;
  stop: string;
};

const FocusForm: React.FC<Props & RouteComponentProps> = (props) => {
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
    chr: "",
    position: "",
    effect_allele: "",
    alternate_allele: "",
    freq: "",
    beta: "",
    se: "",
    p_value: "",
    sample_size: "",
    locations: "",
    population: "",
    chromosome: "",
    all_gwas_sig: "",
    p_threshold: "",
    ridge_term: "",
    intercept: "",
    max_genes: "",
    prior_prob: "",
    credible_level: "",
    min_r2pred: "",
    max_impute: "",
    plot: "",
    tissue: "",
    start: "",
    stop: "",
  };

  const testValues = {
    filename: "test.txt",
    job_name: "Test Focus",
    ...(!user?.username && { email: "" }),
    useTest: true,
    marker_name: "1",
    chr: "2",
    position: "3",
    effect_allele: "4",
    alternate_allele: "5",
    freq: "6",
    beta: "7",
    se: "8",
    p_value: "9",
    sample_size: "10",
    locations: "37:EUR",
    population: "eur",
    chromosome: "2",
    all_gwas_sig: "false",
    p_threshold: "0.5",
    ridge_term: "0.1",
    intercept: "false",
    max_genes: "3",
    prior_prob: "0.001",
    credible_level: "0.9",
    min_r2pred: "0.7",
    max_impute: "0.5",
    plot: "true",
    tissue: "Adipose_Subcutaneous",
    start: "10583",
    stop: "1892607",
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
        .required("Marker name column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      chr: Yup.number()
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
        .required("Alternate allele column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      freq: Yup.number()
        .required("MAF column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      beta: Yup.number()
        .required("BETA column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      se: Yup.number()
        .required("Standard Error column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      p_value: Yup.number()
        .required("p-value column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      sample_size: Yup.number()
        .required("Sample Size column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      locations: Yup.string().required("Please select a value"),
      population: Yup.string().required("Please select a closest population"),
      chromosome: Yup.string().required("Please select a chromosome"),
      all_gwas_sig: Yup.string().required("Please select a value"),
      p_threshold: Yup.string().required("This input is required"),
      ridge_term: Yup.string().required("This input is required"),
      intercept: Yup.string().required("This input is required"),
      max_genes: Yup.string().required("This input is required"),
      prior_prob: Yup.string().required("This input is required"),
      credible_level: Yup.string().required("This input is required"),
      min_r2pred: Yup.string().required("This input is required"),
      max_impute: Yup.string().required("This input is required"),
      plot: Yup.string().required("This input is required"),
      tissue: Yup.string().required("This input is required"),
      start: Yup.string().required("This input is required"),
      stop: Yup.string().required("This input is required"),
    }),

    onSubmit: (values: FormikValues) => {
      // console.log(values);
      if (user?.username) {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "focus",
          "focus_fmap",
          user.username,
          props
        );
      } else {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "focus/noauth",
          "focus_fmap",
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

  const trueFalseOptions = [
    { variable: "true", name: "TRUE" },
    { variable: "false", name: "FALSE" },
  ];

  const locationsObj = [
    { variable: "37:EUR", name: "37:EUR" },
    { variable: "37:AFR", name: "37:AFR" },
    { variable: "37:EAS", name: "37:EAS" },
    { variable: "37:EUR-AFR", name: "37:EUR-AFR" },
    { variable: "37:EUR-EAS", name: "37:EUR-EAS" },
    { variable: "37:EAS-AFR", name: "37:EAS-AFR" },
    { variable: "37:EUR-EAS-AFR", name: "37:EUR-EAS-AFR" },
    { variable: "38:EUR", name: "38:EUR" },
    { variable: "38:AFR", name: "38:AFR" },
    { variable: "38:EAS", name: "38:EAS" },
    { variable: "38:EUR-EAS", name: "38:EUR-EAS" },
    { variable: "38:EUR-EAS-AFR", name: "38:EUR-EAS-AFR" },
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

  const tissues = [
    { variable: "none", name: "None" },
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
              "https://drive.google.com/file/d/1L5bGs-G6fNxz9xO6z_fer-sb4nMfP7lI/view?usp=sharing"
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
              title: "chr",
              text:
                "the column number of the chromosome in the summary statistic file. It can be also be chr",
            },
            {
              title: "position",
              text:
                "the column number of the base pair positions in the summary statistic file. It can be bp",
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
            {
              title: "freq",
              text:
                "the column number of the minor allele frequency in the summary statistic file. It can be also be maf, freq etc.",
            },
            {
              title: "beta",
              text:
                "the column number of the beta in the summary statistic file. It can be beta, slope etc.",
            },
            {
              title: "se",
              text:
                "the column number of the standard error in the summary statistic file. It can be se, standard_error etc.",
            },
            {
              title: "p_value",
              text:
                "the column number of the pvalue in the summary statistic file. It can be p, pvalue, pval_nominal etc.",
            },
            {
              title: "sample_size",
              text:
                "the column number of the sample size in the summary statistic file. It can be also be n.",
            },
          ])}

          <div className={classes.header_div}>
            <h2>Tool Parameters</h2>
          </div>

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={locationsObj}
            selectVariable={"locations"}
            selectName={"Locations"}
            tooltip={"Locations"}
          />

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={populations}
            selectVariable={"population"}
            selectName={"Populations"}
            tooltip={
              "The closest population from which the GWAS summary file has been generated. We supported the five super populations of 1000 genomes."
            }
          />

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={chromosomes}
            selectVariable={"chromosome"}
            selectName={"Chromosome"}
            tooltip={"The specific chromosome to perform imputation."}
          />

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={trueFalseOptions}
            selectVariable={"all_gwas_sig"}
            selectName={"All_gwas_sig"}
            tooltip={
              "Boolean indicator for whether fine-mapping regions that contains GWAS signal for all population; False means GWAS signal for at least one population"
            }
          />

          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"P_Threshold"}
            textVariable={"p_threshold"}
            tooltip={
              "Minimum GWAS p-value required to perform TWAS fine-mapping."
            }
          />

          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"Ridge Term"}
            textVariable={"ridge_term"}
            tooltip={
              "Diagonal adjustment for linkage-disequilibrium (LD) estimate."
            }
          />

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={trueFalseOptions}
            selectVariable={"intercept"}
            selectName={"Intercept"}
            tooltip={
              "Indicates whether to include an intercept term in the model."
            }
          />

          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"Max Genes"}
            textVariable={"max_genes"}
            tooltip={"Maximum number of genes that can be causal."}
          />

          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"Prior Prob"}
            textVariable={"prior_prob"}
            tooltip={"..."}
          />

          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"Credible Level"}
            textVariable={"credible_level"}
            tooltip={"Probability value to determine the credible gene set."}
          />

          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"min_r2pred"}
            textVariable={"min_r2pred"}
            tooltip={
              "Minimum average LD-based imputation accuracy allowed for expression weight SNP Z-scores."
            }
          />

          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"Max Impute"}
            textVariable={"max_impute"}
            tooltip={
              "Maximum fraction of SNPs allowed to be missing per gene, and will be imputed using LD."
            }
          />

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={trueFalseOptions}
            selectVariable={"plot"}
            selectName={"Plot"}
            tooltip={
              "Generate fine-mapping plots (Plots are not yet available)"
            }
          />

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={tissues}
            selectVariable={"tissue"}
            selectName={"Tissue"}
            tooltip={
              "Name of tissue for tissue-prioritized fine-mapping. Relaxed matching."
            }
          />

          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"Start"}
            textVariable={"start"}
            tooltip={
              "Perform imputation starting at specific location (in base pairs). Accepts kb/mb modifiers. Requires --chr to be specified."
            }
          />

          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"Stop"}
            textVariable={"stop"}
            tooltip={
              "Perform imputation until at specific location (in base pairs). Accepts kb/mb modifiers. Requires --chr to be specified."
            }
          />
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

export default FocusForm;
