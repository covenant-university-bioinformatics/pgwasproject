import React, { useRef, useState } from "react";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
// import classes from "./index.module.scss";
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

type Props = {};

enum Populations {
  AFR = "afr",
  AMR = "amr",
  EUR = "eur",
  EAS = "eas",
  SAS = "sas",
}

type UserFormData = {
  filename: string;
  job_name: string;
  email?: string;
  useTest: boolean;
  marker_name: string | undefined;
  effect_allele: string | undefined;
  alternate_allele: string | undefined;
  effect_allele_freq: string | undefined;
  beta: string | undefined;
  se: string | undefined;
  p_value: string | undefined;
  sample_size: string | undefined;
  population: string;
  eqtl_summary: string;
  probe: string;
  probe_wind: string;
  gene_list: string;
  maf: string;
  diff_freq: string;
  diff_freq_prop: string;
  cis_wind: string;
  peqtl_smr: string;
  ld_upper_limit: string;
  ld_lower_limit: string;
  peqtl_heidi: string;
  heidi_mtd: string;
  heidi_min_m: string;
  heidi_max_m: string;
  smr_thresh: string;
  heidi_thresh: string;
  plotWindow: string;
  max_anno_probe: string;
  [key: string]: any;
};

const EQTLPlotForm: React.FC<Props & RouteComponentProps> = (props) => {
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
    effect_allele: "",
    alternate_allele: "",
    effect_allele_freq: "",
    beta: "",
    se: "",
    p_value: "",
    sample_size: "",
    population: "",
    eqtl_summary: "",
    probe: "",
    probe_wind: "500",
    gene_list: "glist-hg19",
    maf: "0.05",
    diff_freq: "0.2",
    diff_freq_prop: "0.05",
    cis_wind: "2000",
    peqtl_smr: "0.000000050",
    ld_upper_limit: "0.9",
    ld_lower_limit: "0.05",
    peqtl_heidi: "0.00157",
    heidi_mtd: "1",
    heidi_min_m: "3",
    heidi_max_m: "20",
    smr_thresh: "0.0000084",
    heidi_thresh: "0.05",
    plotWindow: "1000",
    max_anno_probe: "16",
  };

  const testValues = {
    filename: "test.txt",
    job_name: "EQTL Plot",
    ...(!user?.username && { email: "" }),
    useTest: true,
    marker_name: "1",
    effect_allele: "2",
    alternate_allele: "3",
    effect_allele_freq: "4",
    beta: "5",
    se: "6",
    p_value: "7",
    sample_size: "8",
    population: Populations.EUR,
    eqtl_summary: "CAGE_eqtl",
    probe: "ILMN_2349633",
    probe_wind: "500",
    gene_list: "glist-hg19",
    maf: "0.05",
    diff_freq: "0.2",
    diff_freq_prop: "0.05",
    cis_wind: "2000",
    peqtl_smr: "0.000000050",
    ld_upper_limit: "0.9",
    ld_lower_limit: "0.05",
    peqtl_heidi: "0.00157",
    heidi_mtd: "1",
    heidi_min_m: "3",
    heidi_max_m: "20",
    smr_thresh: "0.0000084",
    heidi_thresh: "0.05",
    plotWindow: "1000",
    max_anno_probe: "16",
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
      effect_allele: Yup.number()
        .required("Effect Allele column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      alternate_allele: Yup.number()
        .required("Alternate Allele column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      effect_allele_freq: Yup.number()
        .required("Effect Allele frequency column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      beta: Yup.number()
        .required("Beta column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      se: Yup.number()
        .required("Standard error column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      p_value: Yup.number()
        .required("P-Value column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      sample_size: Yup.number()
        .required("Sample size column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      population: Yup.string().required("Please select a closest population"),
      eqtl_summary: Yup.string().required("Please select a data to use"),
      probe: Yup.string().required("Please enter in a probe"),
      probe_wind: Yup.number().required(
        "This value is required and must be a number value"
      ),
      gene_list: Yup.string().required("Please select a gene list"),
      maf: Yup.number().required(
        "This value is required and must be a number value"
      ),
      diff_freq: Yup.number().required(
        "This value is required and must be a number value"
      ),
      diff_freq_prop: Yup.number().required(
        "This value is required and must be a number value"
      ),
      cis_wind: Yup.number().required(
        "This value is required and must be a number value"
      ),
      peqtl_smr: Yup.number().required(
        "This value is required and must be a number value"
      ),
      ld_upper_limit: Yup.number().required(
        "This value is required and must be a number value"
      ),
      ld_lower_limit: Yup.number().required(
        "This value is required and must be a number value"
      ),
      peqtl_heidi: Yup.number().required(
        "This value is required and must be a number value"
      ),
      heidi_mtd: Yup.number().required(
        "This value is required and must be a number value"
      ),
      heidi_min_m: Yup.number().required(
        "This value is required and must be a number value"
      ),
      heidi_max_m: Yup.number().required(
        "This value is required and must be a number value"
      ),
      smr_thresh: Yup.number().required(
        "This value is required and must be a number value"
      ),
      heidi_thresh: Yup.number().required(
        "This value is required and must be a number value"
      ),
      plotWindow: Yup.number().required(
        "This value is required and must be a number value"
      ),
      max_anno_probe: Yup.number().required(
        "This value is required and must be a number value"
      ),
    }),

    onSubmit: (values: FormikValues) => {
      if (user?.username) {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "eqtlplot",
          "eqtlplot",
          user.username,
          props
        );
      } else {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "eqtlplot/noauth",
          "eqtlplot",
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

  const EQTLOptions = [
    { variable: "Westra_eqtl", name: "WESTRA" },
    { variable: "CAGE_eqtl", name: "CAGE" },
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
      variable: "Cells_Cultured_fibroblasts",
      name: "Cells_Cultured_fibroblasts",
    },
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
    { variable: "Kidney_Cortex", name: "Kidney_Cortex" },
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

  const GeneListOptions = [
    { variable: "glist-hg19", name: "HG19" },
    { variable: "glist-hg38", name: "HG38" },
  ];

  const eqtlVariables = [
    { variable: "maf", name: "MAF" },
    { variable: "diff_freq", name: "diff freq" },
    { variable: "diff_freq_prop", name: "diff freq prop" },
    { variable: "cis_wind", name: "cis wind" },
    { variable: "peqtl_smr", name: "peqtl smr" },
    { variable: "ld_upper_limit", name: "ld upper limit" },
    { variable: "ld_lower_limit", name: "ld lower limit" },
    { variable: "peqtl_heidi", name: "peqtl heidi" },
    { variable: "heidi_mtd", name: "heidi mtd" },
    { variable: "heidi_min_m", name: "heidi min m" },
    { variable: "heidi_max_m", name: "heidi max m" },
    { variable: "probe_wind", name: "probe wind" },
    { variable: "smr_thresh", name: "smr thresh" },
    { variable: "heidi_thresh", name: "heidi thresh" },
    { variable: "plotWindow", name: "plotWindow" },
    { variable: "max_anno_probe", name: "max anno probe" },
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
              "https://drive.google.com/file/d/18AlfECT6eVVikKR8C9XQ4Wgmdm4Tpg4l/view?usp=sharing"
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
            <h2>Summary statistics column positions</h2>
          </div>

          {generalFileForm(classes, formik, [
            {
              title: "marker_name",
              text:
                "the column number of the marker name in the summary statistic file. It can be marker_name, rsid, snpid etc",
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
              title: "effect_allele_freq",
              text:
                "the column number of the reference or effect allele frequency in the summary statistic file",
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
            selectElement={populations}
            selectVariable={"population"}
            selectName={"Populations"}
          />

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={EQTLOptions}
            selectVariable={"eqtl_summary"}
            selectName={"EQTL Dataset"}
          />

          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={GeneListOptions}
            selectVariable={"gene_list"}
            selectName={"Gene List"}
          />

          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"Probe ID"}
            textVariable={"probe"}
          />

          {eqtlVariables.map((element) => (
            <CommonTextElement
              key={element.name}
              classes={classes}
              formik={formik}
              label={element.name}
              textVariable={element.variable}
            />
          ))}
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

export default EQTLPlotForm;
