import React, { useRef, useState } from "react";
import Accordion from "@mui/material/Accordion";
import Grid from "@mui/material/Grid";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LinearProgress } from "@material-ui/core";
import classes from "./index.module.scss";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import { handleFileUploadChangedCommon } from "../utility/form_common";
import pgwasAxios from "../../axios-fetches";
import {
  getErrorMessage,
  showToastError,
  showToastMessage,
} from "../utility/general_utils";
import { RouteComponentProps } from "react-router-dom";
import {
  CommonFileElement,
  CommonTextElement,
  LoadTestData,
  SelectFieldsElement,
} from "../utility/form_common_fields";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Hidden,
  Paper,
} from "@material-ui/core";
import { GetAppRounded, PlayArrow } from "@material-ui/icons";
import { generalFileForm } from "../utility/general";

type Props = {};

type UserFormData = {
  filename: string;
  job_name: string;
  email?: string;
  useTest: boolean;
  marker_name: string;
  chr: string;
  position: string;
  effect_allele: string;
  alternate_allele: string;
  maf: string;
  beta: string;
  standard_error: string;
  pvalue: string;
  sample_size: string;
  population: string;
  clump_p1: string;
  clump_p2: string;
  clump_r2: string;
  clump_kb: string;
  clump_allow_overlap: string;
  clump_use_gene_region_file: string;
  clump_range: string;
  clump_range_border: string;
  coloc_type: string;
  coloc_s: string;
  coloc_p1: string;
  pascal_runpathway: string;
  pascal_chr: string;
  pascal_genesetfile: string;
  pascal_pvalue_cutoff: string;
  pascal_up: string;
  pascal_down: string;
  pascal_maxsnp: string;
  pascal_genescoring: string;
  pascal_mergedistance: string;
  pascal_mafcutoff: string;
  emagma_synonym: string;
  emagma_up_window: string;
  emagma_down_window: string;
  emagma_tissues: string;
  smr_heidi: string;
  smr_trans: string;
  smr_smr_multi: string;
  smr_maf: string;
  smr_diff_freq: string;
  smr_diff_freq_prop: string;
  smr_cis_wind: string;
  smr_peqtl_smr: string;
  smr_ld_upper_limit: string;
  smr_ld_lower_limit: string;
  smr_peqtl_heidi: string;
  smr_heidi_mtd: string;
  smr_heidi_min_m: string;
  smr_heidi_max_m: string;
  smr_trans_wind: string;
  smr_set_wind: string;
  smr_ld_multi_snp: string;
  smr_westra_eqtl: string;
  smr_cage_eqtl: string;
  smr_gtex_tissue: string;
  annot_gene_db: string;
  annot_cytoband: boolean;
  annot_all: boolean;
  annot_afr: boolean;
  annot_amr: boolean;
  annot_eas: boolean;
  annot_eur: boolean;
  annot_sas: boolean;
  annot_exac: boolean;
  annot_disgenet: boolean;
  annot_clinvar: boolean;
  annot_intervar: boolean;
  haplor_ld_threshold: string;
  haplor_epi: string;
  haplor_cons: string;
  haplor_genetypes: string;
  [key: string]: any;
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

const clumpRangeOptions = [
  { variable: "glist-hg19", name: "glist-hg19" },
  { variable: "glist-hg38", name: "glist-hg38" },
];

const analysisType = [
  { variable: "quant", name: "QUANTIFICATION" },
  { variable: "cc", name: "CASE-CONTROL" },
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

const synonyms = [
  { variable: "No", name: "NO" },
  { variable: "drop", name: "DROP" },
  { variable: "drop-dup", name: "DROP_DUP" },
  { variable: "skip", name: "SKIP" },
  { variable: "skip_dup", name: "SKIP_DUP" },
];

const tissues = [
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

const eqtlVariables = [
  {
    variable: "smr_maf",
    name: "MAF",
    text: "The minor allele frequency (maf) cutoff value. The default value of this parameter is 0.05",
  },
  {
    variable: "smr_diff_freq",
    name: "diff freq",
    text: "A threshold value for allele frequency quality control. The default value is 0.2.",
  },
  {
    variable: "smr_diff_freq_prop",
    name: "diff freq prop",
    text: "A threshold value for the maximum proportion of variants that can vary in the population. The default value is 0.05.",
  },
  {
    variable: "smr_cis_wind",
    name: "cis wind",
    text: "A value of a window arround cis-eQTLs signal (cis_wind). The default value is 2000 Kb.",
  },
  {
    variable: "smr_peqtl_smr",
    name: "peqtl smr",
    text: "A cutoff for SMR test pvalue. The default value is 5.0e-8.",
  },
  {
    variable: "smr_ld_upper_limit",
    name: "ld upper limit",
    text: "The upper limit value for R-square value to prune SNPs. The default value is 0.9",
  },
  {
    variable: "smr_ld_lower_limit",
    name: "ld lower limit",
    text: "The lower limit value for R-square value to prune SNPs. The default value is 0.05.",
  },
  {
    variable: "smr_peqtl_heidi",
    name: "peqtl heidi",
    text: "A cutoff for Heidi test pvalue. The default value is 1.57e-3.",
  },
  {
    variable: "smr_heidi_mtd",
    name: "heidi mtd",
    text: "HEIDI test method where 0 indicates the original HEIDI method and the value of 1 indicates the new HEIDI method.The default value is 1.",
  },
  {
    variable: "smr_heidi_min_m",
    name: "heidi min m",
    text: "The minimum of f cis-SNPs to perfom Heidi test. The default value is 3",
  },
  {
    variable: "smr_heidi_max_m",
    name: "heidi max m",
    text: "The maximum number of eQTLs to be used for Heidi test. The default value is 20.",
  },
  {
    variable: "smr_trans_wind",
    name: "trans wind",
    text: "trans window size (trans_wind). The default value is 1000 Kb.",
  },
  {
    variable: "smr_set_wind",
    name: "set wind",
    text: "A value for a window size in Kb to select SNPs in the cis-region. The defulat value is -9 which resulting in selecting SNPs in the whole cis-region.",
  },
  {
    variable: "smr_ld_multi_snp",
    name: "ld multi snp",
    text: "A cutoff value for R-square value to prune SNPs. The default value is 0.1.",
  },
];

const onOffOptions = [
  { variable: "on", name: "ON" },
  { variable: "off", name: "OFF" },
];

const trueFalseOptions = [
  { variable: "true", name: "TRUE" },
  { variable: "false", name: "FALSE" },
];

const gene_dbs = [
  { variable: "refseq", name: "RefSeq" },
  { variable: "ucsc", name: "UCSC" },
  { variable: "ensembl", name: "Ensembl" },
];

const databases = [
  { variable: "annot_cytoband", name: "Cytoband" },
  { variable: "annot_all", name: "Frequency in 1KGP (ALL)" },
  { variable: "annot_afr", name: "Frequency in 1KGP (AFR)" },
  { variable: "annot_amr", name: "Frequency in 1KGP (AMR)" },
  { variable: "annot_eur", name: "Frequency in 1KGP (EUR)" },
  { variable: "annot_eas", name: "Frequency in 1KGP (EAS)" },
  { variable: "annot_sas", name: "Frequency in 1KGP (SAS)" },
  { variable: "annot_exac", name: "Exome Frequencies" },
  { variable: "annot_disgenet", name: "DISGENET" },
  { variable: "annot_clinvar", name: "CLINVAR" },
  { variable: "annot_intervar", name: "INTERVAR" },
];

const dbs = [
  "whole-exome SIFT",
  "PolyPhen2 HDIV",
  "PolyPhen2 HVAR",
  "LRT",
  "MutationTaster",
  "MutationAssessor",
  "FATHMM",
  "PROVEAN",
  "MetaSVM",
  "MetaLR",
  "VEST",
  "M-CAP",
  "CADD",
  "GERP++",
  "DANN",
  "fathmm-MKL",
  "Eigen",
  "GenoCanyon",
  "fitCons",
  "PhyloP",
  "SiPhy",
];

const epiOptions = [
  { variable: "vanilla", name: "VANILLA" },
  { variable: "imputed", name: "IMPUTED" },
  { variable: "methyl", name: "METHYL" },
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

const WorkflowForm: React.FC<Props & RouteComponentProps> = (props) => {
  const [expanded, setExpanded] = React.useState<string | false>(false);
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
    chr: "",
    position: "",
    effect_allele: "",
    alternate_allele: "",
    maf: "",
    beta: "",
    standard_error: "",
    pvalue: "",
    sample_size: "",
    population: "eur",
    clump_p1: "0.1",
    clump_p2: "0.05",
    clump_r2: "0.8",
    clump_kb: "1",
    clump_allow_overlap: "No",
    clump_use_gene_region_file: "Yes",
    clump_range: "glist-hg19",
    clump_range_border: "0",
    coloc_type: "cc",
    coloc_s: "0.3",
    coloc_p1: "0.00001",
    pascal_runpathway: "on",
    pascal_chr: "22",
    pascal_genesetfile: "msigBIOCARTA_KEGG_REACTOME",
    pascal_pvalue_cutoff: "0.05",
    pascal_up: "50000",
    pascal_down: "50000",
    pascal_maxsnp: "3000",
    pascal_genescoring: "sum",
    pascal_mergedistance: "1",
    pascal_mafcutoff: "0.05",
    emagma_synonym: "No",
    emagma_up_window: "0",
    emagma_down_window: "0",
    emagma_tissues: "Liver",
    smr_heidi: "on",
    smr_trans: "on",
    smr_smr_multi: "on",
    smr_maf: "0.05",
    smr_diff_freq: "0.2",
    smr_diff_freq_prop: "0.05",
    smr_cis_wind: "2000",
    smr_peqtl_smr: "0.000000050",
    smr_ld_upper_limit: "0.9",
    smr_ld_lower_limit: "0.05",
    smr_peqtl_heidi: "0.00157",
    smr_heidi_mtd: "1",
    smr_heidi_min_m: "3",
    smr_heidi_max_m: "20",
    smr_trans_wind: "1000",
    smr_set_wind: "-9",
    smr_ld_multi_snp: "0.1",
    smr_westra_eqtl: "true",
    smr_cage_eqtl: "true",
    smr_gtex_tissue: "Lung",
    annot_gene_db: "refseq",
    annot_cytoband: true,
    annot_all: true,
    annot_afr: true,
    annot_amr: true,
    annot_eas: true,
    annot_eur: true,
    annot_sas: true,
    annot_exac: true,
    annot_disgenet: true,
    annot_clinvar: true,
    annot_intervar: false,
    haplor_ld_threshold: "0.8",
    haplor_epi: "vanilla",
    haplor_cons: "both",
    haplor_genetypes: "refseq",
  };

  const testValues = {
    filename: "test.txt",
    job_name: "Test Custom",
    ...(!user?.username && { email: "" }),
    useTest: true,
    marker_name: "1",
    chr: "2",
    position: "3",
    effect_allele: "4",
    alternate_allele: "5",
    maf: "6",
    beta: "7",
    standard_error: "8",
    pvalue: "9",
    sample_size: "10",
    population: "eur",
    clump_p1: "0.1",
    clump_p2: "0.05",
    clump_r2: "0.8",
    clump_kb: "1",
    clump_allow_overlap: "No",
    clump_use_gene_region_file: "Yes",
    clump_range: "glist-hg19",
    clump_range_border: "0",
    coloc_type: "cc",
    coloc_s: "0.3",
    coloc_p1: "0.00001",
    pascal_runpathway: "on",
    pascal_chr: "22",
    pascal_genesetfile: "msigBIOCARTA_KEGG_REACTOME",
    pascal_pvalue_cutoff: "0.05",
    pascal_up: "50000",
    pascal_down: "50000",
    pascal_maxsnp: "3000",
    pascal_genescoring: "sum",
    pascal_mergedistance: "1",
    pascal_mafcutoff: "0.05",
    emagma_synonym: "No",
    emagma_up_window: "0",
    emagma_down_window: "0",
    emagma_tissues: "Liver",
    smr_heidi: "on",
    smr_trans: "on",
    smr_smr_multi: "on",
    smr_maf: "0.05",
    smr_diff_freq: "0.2",
    smr_diff_freq_prop: "0.05",
    smr_cis_wind: "2000",
    smr_peqtl_smr: "0.000000050",
    smr_ld_upper_limit: "0.9",
    smr_ld_lower_limit: "0.05",
    smr_peqtl_heidi: "0.00157",
    smr_heidi_mtd: "1",
    smr_heidi_min_m: "3",
    smr_heidi_max_m: "20",
    smr_trans_wind: "1000",
    smr_set_wind: "-9",
    smr_ld_multi_snp: "0.1",
    smr_westra_eqtl: "true",
    smr_cage_eqtl: "true",
    smr_gtex_tissue: "Lung",
    annot_gene_db: "refseq",
    annot_cytoband: true,
    annot_all: true,
    annot_afr: true,
    annot_amr: true,
    annot_eas: true,
    annot_eur: true,
    annot_sas: true,
    annot_exac: true,
    annot_disgenet: true,
    annot_clinvar: true,
    annot_intervar: false,
    haplor_ld_threshold: "0.8",
    haplor_epi: "vanilla",
    haplor_cons: "both",
    haplor_genetypes: "refseq",
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
        .max(20, "the max is twenty"),
      chr: Yup.number()
        .required("Chromosome column number is required")
        .min(1, "The minimum is one")
        .max(20, "the max is twenty"),
      position: Yup.number()
        .required("Position column number is required")
        .min(1, "The minimum is one")
        .max(20, "the max is twenty"),
      effect_allele: Yup.number()
        .required("Effect Allele column number is required")
        .min(1, "The minimum is one")
        .max(20, "the max is twenty"),
      alternate_allele: Yup.number()
        .required("Alternate Allele column number is required")
        .min(1, "The minimum is one")
        .max(20, "the max is twenty"),
      maf: Yup.number()
        .required("Minor Allele Frequency column number is required")
        .min(1, "The minimum is one")
        .max(20, "the max is twenty"),
      beta: Yup.number()
        .required("Beta column number is required")
        .min(1, "The minimum is one")
        .max(20, "the max is twenty"),
      standard_error: Yup.number()
        .required("Standard error column number is required")
        .min(1, "The minimum is one")
        .max(20, "the max is twenty"),
      pvalue: Yup.number()
        .required("Pvalue column number is required")
        .min(1, "The minimum is one")
        .max(20, "the max is twenty"),
      sample_size: Yup.number()
        .required("Sample size column number is required")
        .min(1, "The minimum is one")
        .max(20, "the max is twenty"),
      population: Yup.string().required("Please select a closest population"),
      clump_p1: Yup.number().required(
        "This value is required and must be a number value"
      ),
      clump_p2: Yup.number().required(
        "This value is required and must be a number value"
      ),
      clump_r2: Yup.number().required(
        "This value is required and must be a number value"
      ),
      clump_kb: Yup.number().required(
        "This value is required and must be a number value"
      ),
      clump_allow_overlap: Yup.string().required("Please select a value"),
      clump_use_gene_region_file: Yup.string().required(
        "Please select a value"
      ),
      clump_range: Yup.string().required("This input is required"),
      clump_range_border: Yup.number().required("This input is required"),
      coloc_type: Yup.string().required("Please select a value"),
      coloc_s: Yup.number().required(
        "This value is required and must be a number value"
      ),
      coloc_p1: Yup.number().required(
        "This value is required and must be a number value"
      ),
      pascal_runpathway: Yup.string().required(
        "Please select value for running pathway analysis"
      ),
      pascal_chr: Yup.string().required("Please select a chromosome number"),
      pascal_genesetfile: Yup.string().required(
        "Please select a gene set file"
      ),
      pascal_pvalue_cutoff: Yup.number().required(
        "Please choose a pvalue_cutoff"
      ),
      pascal_up: Yup.number().required("Please enter in a number value"),
      pascal_down: Yup.number().required("Please enter in a number value"),
      pascal_maxsnp: Yup.number().required("Please enter in a number value"),
      pascal_genescoring: Yup.string().required(
        "Please choose a gene scoring option"
      ),
      pascal_mergedistance: Yup.number().required(
        "Please enter in a number value"
      ),
      pascal_mafcutoff: Yup.number().required("Please enter in a number value"),
      emagma_synonym: Yup.string().required(
        "Please select how to handle similar SNPs"
      ),
      emagma_up_window: Yup.number().required("Please enter in a number value"),
      emagma_down_window: Yup.number().required(
        "Please enter in a number value"
      ),
      emagma_tissues: Yup.string().required("Please select a tissue"),
      smr_heidi: Yup.string().required("Please select a value"),
      smr_trans: Yup.string().required("Please select a value"),
      smr_smr_multi: Yup.string().required("Please select a value"),
      smr_maf: Yup.number().required(
        "This value is required and must be a number value"
      ),
      smr_diff_freq: Yup.number().required(
        "This value is required and must be a number value"
      ),
      smr_diff_freq_prop: Yup.number().required(
        "This value is required and must be a number value"
      ),
      smr_cis_wind: Yup.number().required(
        "This value is required and must be a number value"
      ),
      smr_peqtl_smr: Yup.number().required(
        "This value is required and must be a number value"
      ),
      smr_ld_upper_limit: Yup.number().required(
        "This value is required and must be a number value"
      ),
      smr_ld_lower_limit: Yup.number().required(
        "This value is required and must be a number value"
      ),
      smr_peqtl_heidi: Yup.number().required(
        "This value is required and must be a number value"
      ),
      smr_heidi_mtd: Yup.number().required(
        "This value is required and must be a number value"
      ),
      smr_heidi_min_m: Yup.number().required(
        "This value is required and must be a number value"
      ),
      smr_heidi_max_m: Yup.number().required(
        "This value is required and must be a number value"
      ),
      smr_trans_wind: Yup.number().required(
        "This value is required and must be a number value"
      ),
      smr_set_wind: Yup.number().required(
        "This value is required and must be a number value"
      ),
      smr_ld_multi_snp: Yup.number().required(
        "This value is required and must be a number value"
      ),
      smr_westra_eqtl: Yup.string().required(
        "Please select a value for Westra eQTL"
      ),
      smr_cage_eqtl: Yup.string().required(
        "Please select a value for CAGE eQTL"
      ),
      smr_gtex_tissue: Yup.string().required("Please select a value"),
      annot_gene_db: Yup.string().required("Please select a database"),
      haplor_ld_threshold: Yup.number().required(
        "This value is required and must be a number value"
      ),
      haplor_epi: Yup.string().required("Please select a value"),
      haplor_cons: Yup.string().required("Please select a value"),
      haplor_genetypes: Yup.string().required("Please select a value"),
    }),
    onSubmit: (values: FormikValues) => {
      console.log(values);
      const apiPath = user.username ? "/spgwas/jobs" : "/spgwas/noauth/jobs";

      const data = new FormData();

      data.append("file", uploadFile);

      for (const element in values) {
        if (values.hasOwnProperty(element)) {
          data.append(element, values[element]);
        }
      }

      setLoading(true);

      pgwasAxios
        .post(apiPath, data, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        })
        .then((res) => {
          // then print response status
          showToastMessage("Job submitted successfully");
          setLoading(false);
          const baseURL = props.match.url.split("/")[1];
          if (user.username) {
            props.history.push(`/${baseURL}/all_results`);
          } else {
            props.history.push(`/${baseURL}/result_view/${res.data.jobId}`);
          }
        })
        .catch((error) => {
          setLoading(false);
          showToastError(getErrorMessage(error));
        });
    },
  });

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
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

  return (
    <div className={classes.workflow_form}>
      <div className={classes.form_container}>
        <h1 className={classes.main_header}>Create A New Job</h1>
        <div className={classes.buttons}>
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
              "https://drive.google.com/file/d/1Sw_iseHNFG7gLVd3Fvt0yvFNEXChn6Qk/view?usp=sharing"
            }
            target="_blank"
          >
            Download Test File
          </Button>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className={classes.accordian_container}>
            <Accordion
              defaultExpanded={true}
              // expanded={expanded === "panel1"}
              expanded={true}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                className={classes.accordian_summary}
              >
                <Typography
                  className={classes.main_text}
                  sx={{
                    width: "33%",
                    flexShrink: 0,
                    // fontWeight: "bold",
                    // fontSize: "1.2rem",
                  }}
                >
                  General Job Parameters
                </Typography>
                <Typography
                  className={classes.sub_text}
                  sx={{
                    color: "text.secondary",
                    // fontWeight: "bold",
                    // fontSize: "1rem",
                  }}
                >
                  Basic information about the job
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={classes.container}>
                  <Grid container spacing={3}>
                    <div className={classes.header_div}>
                      <h2>Enter a Job Name</h2>
                    </div>
                    <CommonTextElement
                      classes={classes}
                      formik={formik}
                      label={"Job Name"}
                      textVariable={"job_name"}
                      tooltip={"Enter a name for the job"}
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
                          tooltip={"This will be used to send you job details"}
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
                        title: "chr",
                        text: "the column number of the chromosome in the summary statistic file. It can be also be chr",
                      },
                      {
                        title: "position",
                        text: "the column number of the base pair positions in the summary statistic file. It can be bp",
                      },
                      {
                        title: "effect_allele",
                        text: "the column number of the reference or effect allele in the summary statistic file",
                      },
                      {
                        title: "alternate_allele",
                        text: "the column number of the alternate allele in the summary statistic file",
                      },
                      {
                        title: "maf",
                        text: "the column number of the minor allele frequency in the summary statistic file. It can be also be maf, freq etc.",
                      },
                      {
                        title: "beta",
                        text: "the column number of the beta in the summary statistic file. It can be beta, slope etc.",
                      },
                      {
                        title: "standard_error",
                        text: "the column number of the standard error in the summary statistic file. It can be se, standard_error etc.",
                      },
                      {
                        title: "pvalue",
                        text: "the column number of the pvalue in the summary statistic file. It can be p, pvalue, pval_nominal etc.",
                      },
                      {
                        title: "sample_size",
                        text: "the column number of the sample size in the summary statistic file. It can be also be n.",
                      },
                    ])}
                    <div className={classes.header_div}>
                      <h2>Select closest population</h2>
                    </div>
                    <SelectFieldsElement
                      classes={classes}
                      formik={formik}
                      selectElement={populations}
                      selectVariable={"population"}
                      selectName={"Population"}
                      tooltip={
                        "the closest population from which the GWAS summary has been generated. This parameter is crucial as using a different population group can result in misleading results."
                      }
                    />
                  </Grid>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
                className={classes.accordian_summary}
              >
                <Typography
                  className={classes.main_text}
                  sx={{
                    width: "33%",
                    flexShrink: 0,
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  Linkage Disequilibrium
                </Typography>
                <Typography
                  className={classes.sub_text}
                  sx={{
                    color: "text.secondary",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  Finding independent SNPs
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={classes.container}>
                  <Grid container spacing={3}>
                    <div className={classes.header_div}>
                      <h2>Parameters</h2>
                    </div>
                    <CommonTextElement
                      classes={classes}
                      formik={formik}
                      label={"Clump P1"}
                      textVariable={"clump_p1"}
                      tooltip={
                        "A pvalue threshold for a SNP to be included as an index and its value should be less than or equal to 0.0001. "
                      }
                    />
                    <CommonTextElement
                      classes={classes}
                      formik={formik}
                      label={"Clump P2"}
                      textVariable={"clump_p2"}
                      tooltip={
                        "Secondary significance threshold for clumped SNPs"
                      }
                    />
                    <CommonTextElement
                      classes={classes}
                      formik={formik}
                      label={"Clump R squared"}
                      textVariable={"clump_r2"}
                      tooltip={"LD threshold for clumping"}
                    />
                    <CommonTextElement
                      classes={classes}
                      formik={formik}
                      label={"Clump KB"}
                      textVariable={"clump_kb"}
                      tooltip={"Physical distance threshold for clumping"}
                    />
                    <SelectFieldsElement
                      classes={classes}
                      formik={formik}
                      selectElement={yesNoOptions}
                      selectVariable={"clump_allow_overlap"}
                      selectName={"Clump Allow Overlap"}
                    />
                    <SelectFieldsElement
                      classes={classes}
                      formik={formik}
                      selectElement={yesNoOptions}
                      selectVariable={"clump_use_gene_region_file"}
                      selectName={"Clump Use Gene Region File"}
                    />
                    <SelectFieldsElement
                      classes={classes}
                      formik={formik}
                      selectElement={clumpRangeOptions}
                      selectVariable={"clump_range"}
                      selectName={"Clump Range"}
                    />
                    <CommonTextElement
                      classes={classes}
                      formik={formik}
                      label={"Clump Range Border"}
                      textVariable={"clump_range_border"}
                      tooltip={
                        "A window around gene bounds in kilobases. The default value is 0"
                      }
                    />
                  </Grid>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
                className={classes.accordian_summary}
              >
                <Typography
                  className={classes.main_text}
                  sx={{
                    width: "33%",
                    flexShrink: 0,
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  Colocalization
                </Typography>
                <Typography
                  className={classes.sub_text}
                  sx={{
                    color: "text.secondary",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  Bayesian genetic colocalization analysis
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={classes.container}>
                  <Grid container spacing={3}>
                    <div className={classes.header_div}>
                      <h2>Parameters</h2>
                    </div>

                    <SelectFieldsElement
                      classes={classes}
                      formik={formik}
                      selectElement={analysisType}
                      selectVariable={"coloc_type"}
                      selectName={"Coloc Analysis Type"}
                    />

                    <CommonTextElement
                      classes={classes}
                      formik={formik}
                      label={"Sample proportion"}
                      textVariable={"coloc_s"}
                      tooltip={
                        "this parameter is required for a case-control GWAS summary dataset and it indicates the proportion of samples in the GWAS summary that are cases."
                      }
                    />

                    <CommonTextElement
                      classes={classes}
                      formik={formik}
                      label={"Probability One"}
                      textVariable={"coloc_p1"}
                      tooltip={
                        "this parameter specifies the prior probability a SNP is associated with trait 1, i.e, the GWAS summary"
                      }
                    />
                  </Grid>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel4"}
              onChange={handleChange("panel4")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4bh-content"
                id="panel4bh-header"
                className={classes.accordian_summary}
              >
                <Typography
                  className={classes.main_text}
                  sx={{
                    width: "33%",
                    flexShrink: 0,
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  Pathway Based Analysis
                </Typography>
                <Typography
                  className={classes.sub_text}
                  sx={{
                    color: "text.secondary",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  Perform gene scoring and pathway analysis using GWAS summary
                  statistics
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={classes.container}>
                  <Grid container spacing={3}>
                    <div className={classes.header_div}>
                      <h2>Parameters</h2>
                    </div>
                    <SelectFieldsElement
                      classes={classes}
                      formik={formik}
                      selectElement={run_pathways}
                      selectVariable={"pascal_runpathway"}
                      selectName={"Run Pathway Option"}
                    />

                    <SelectFieldsElement
                      classes={classes}
                      formik={formik}
                      selectElement={chromosomes}
                      selectVariable={"pascal_chr"}
                      selectName={"Chromosome"}
                    />

                    <SelectFieldsElement
                      classes={classes}
                      formik={formik}
                      selectElement={geneSetFileOptions}
                      selectVariable={"pascal_genesetfile"}
                      selectName={"Gene Set File"}
                      tooltip={
                        "Geneset file where users can choose the database for the pathway analysis either as msigdb.v4.0.entrez or msigBIOCARTA_KEGG_REACTOME data set"
                      }
                    />

                    <CommonTextElement
                      classes={classes}
                      formik={formik}
                      label={"Pvalue Cut off"}
                      textVariable={"pascal_pvalue_cutoff"}
                      tooltip={
                        "p-value cutoff to report the statistically significant genes and pathways. The default value is 0.05."
                      }
                    />

                    <CommonTextElement
                      classes={classes}
                      formik={formik}
                      label={"Up Window Size(bp)"}
                      textVariable={"pascal_up"}
                      tooltip={
                        "Upstream window size around genes. The default values are 50000 base-pairs upstream of transcription start site and 50000 base-pairs downstream of transcription termination site."
                      }
                    />

                    <CommonTextElement
                      classes={classes}
                      formik={formik}
                      label={"Down Window Size(bp)"}
                      textVariable={"pascal_down"}
                      tooltip={
                        "downstream window size around genes. The default values are 50000 base-pairs upstream of transcription start site and 50000 base-pairs downstream of transcription termination site."
                      }
                    />

                    <CommonTextElement
                      classes={classes}
                      formik={formik}
                      label={"Max SNPs"}
                      textVariable={"pascal_maxsnp"}
                      tooltip={
                        "Maximum number of SNPs per gene. The default value is 3000 SNPs."
                      }
                    />
                    <SelectFieldsElement
                      classes={classes}
                      formik={formik}
                      selectElement={geneScoringOptions}
                      selectVariable={"pascal_genescoring"}
                      selectName={"Gene Scoring Option"}
                      tooltip={
                        "ene scoring method as either max or sum. The max gene scoring method is based on the maximum-of-chi-squares algorithm (MOCS), while the sum method is based on the sum-of-chi-squares (SOCS) algorithm."
                      }
                    />
                    <CommonTextElement
                      classes={classes}
                      formik={formik}
                      label={"Merge Distance"}
                      textVariable={"pascal_mergedistance"}
                      tooltip={"merge distance"}
                    />

                    <CommonTextElement
                      classes={classes}
                      formik={formik}
                      label={"MAF Cut off"}
                      textVariable={"pascal_mafcutoff"}
                      tooltip={
                        "The minor allele frequency cutoff value (between 0 and 1). The default value is 0.05"
                      }
                    />
                  </Grid>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel5"}
              onChange={handleChange("panel5")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel5bh-content"
                id="panel5bh-header"
                className={classes.accordian_summary}
              >
                <Typography
                  className={classes.main_text}
                  sx={{
                    width: "33%",
                    flexShrink: 0,
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  Gene Based Analysis
                </Typography>
                <Typography
                  className={classes.sub_text}
                  sx={{
                    color: "text.secondary",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  Identify genes associated with a particular trait/phenotype
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={classes.container}>
                  <Grid container spacing={3}>
                    <div className={classes.header_div}>
                      <h2>Parameters</h2>
                    </div>
                    <SelectFieldsElement
                      classes={classes}
                      formik={formik}
                      selectElement={synonyms}
                      selectVariable={"emagma_synonym"}
                      selectName={"Synonyms"}
                      tooltip={
                        "The option that indicates how to deal with synonymous SNP IDs."
                      }
                    />

                    <SelectFieldsElement
                      classes={classes}
                      formik={formik}
                      selectElement={tissues}
                      selectVariable={"emagma_tissues"}
                      selectName={"Tissue"}
                      tooltip={
                        "The tissue to calculate tissue-specific gene set analysis"
                      }
                    />

                    <CommonTextElement
                      classes={classes}
                      formik={formik}
                      label={"Up Window Size(KB)"}
                      textVariable={"emagma_up_window"}
                      tooltip={
                        "A value upstream annotation window around genes in kb. The default value is 0"
                      }
                    />

                    <CommonTextElement
                      classes={classes}
                      formik={formik}
                      label={"Down Window Size(KB)"}
                      textVariable={"emagma_down_window"}
                      tooltip={
                        "A value downstream annotation window around genes in kb. The default value is 0."
                      }
                    />
                  </Grid>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel6"}
              onChange={handleChange("panel6")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel6bh-content"
                id="panel6bh-header"
                className={classes.accordian_summary}
              >
                <Typography
                  className={classes.main_text}
                  sx={{
                    width: "33%",
                    flexShrink: 0,
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  EQTL SMR/HEIDI
                </Typography>
                <Typography
                  className={classes.sub_text}
                  sx={{
                    color: "text.secondary",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  Expression quantitative trait locus (eQTL) analysis
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={classes.container}>
                  <Grid container spacing={3}>
                    <div className={classes.header_div}>
                      <h2>Parameters</h2>
                    </div>
                    <SelectFieldsElement
                      classes={classes}
                      formik={formik}
                      selectElement={onOffOptions}
                      selectVariable={"smr_heidi"}
                      selectName={"Option (Heidi)"}
                    />

                    <SelectFieldsElement
                      classes={classes}
                      formik={formik}
                      selectElement={onOffOptions}
                      selectVariable={"smr_trans"}
                      selectName={"option (Trans)"}
                    />

                    <SelectFieldsElement
                      classes={classes}
                      formik={formik}
                      selectElement={onOffOptions}
                      selectVariable={"smr_smr_multi"}
                      selectName={"option (SMR Multi)"}
                    />

                    {eqtlVariables.map((element) => (
                      <CommonTextElement
                        key={element.name}
                        classes={classes}
                        formik={formik}
                        label={element.name}
                        textVariable={element.variable}
                        tooltip={element.text}
                      />
                    ))}

                    <SelectFieldsElement
                      classes={classes}
                      formik={formik}
                      selectElement={trueFalseOptions}
                      selectVariable={"smr_westra_eqtl"}
                      selectName={"option (Westra)"}
                      tooltip={"Use Westra dataset for eQTL analysis"}
                    />

                    <SelectFieldsElement
                      classes={classes}
                      formik={formik}
                      selectElement={trueFalseOptions}
                      selectVariable={"smr_cage_eqtl"}
                      selectName={"option (CAGE)"}
                      tooltip={"Use CAGE dataset for eQTL analysis"}
                    />

                    <SelectFieldsElement
                      classes={classes}
                      formik={formik}
                      selectElement={tissues}
                      selectVariable={"smr_gtex_tissue"}
                      selectName={"GTEX V8 Tissue"}
                      tooltip={"Select GTEX v8 tissue"}
                    />
                  </Grid>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expanded === "panel7"}
              onChange={handleChange("panel7")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel7bh-content"
                id="panel7bh-header"
                className={classes.accordian_summary}
              >
                <Typography
                  className={classes.main_text}
                  sx={{
                    width: "33%",
                    flexShrink: 0,
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  Annotation and Deleteriousness
                </Typography>
                <Typography
                  className={classes.sub_text}
                  sx={{
                    color: "text.secondary",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  Perform annotation and deleteriousness analysis
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className={classes.container}>
                  <Grid container spacing={3}>
                    <div className={classes.header_div}>
                      <h2>Gene Annotation Database</h2>
                    </div>
                    <SelectFieldsElement
                      classes={classes}
                      formik={formik}
                      selectElement={gene_dbs}
                      selectVariable={"annot_gene_db"}
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
                    <div className={classes.header_div}>
                      <h2>Deleteriousness Databases</h2>
                    </div>
                    <Grid className={classes.grid} item xs={12} sm={12}>
                      <Paper variant="outlined" className={classes.paper}>
                        <ul className={classes.db_list}>
                          {dbs.map((db, i) => (
                            <li key={i}>{db}</li>
                          ))}
                        </ul>
                      </Paper>
                    </Grid>
                  </Grid>
                </div>
              </AccordionDetails>
            </Accordion>
            {/*<Accordion*/}
            {/*  expanded={expanded === "panel8"}*/}
            {/*  onChange={handleChange("panel8")}*/}
            {/*>*/}
            {/*  <AccordionSummary*/}
            {/*    expandIcon={<ExpandMoreIcon />}*/}
            {/*    aria-controls="panel8bh-content"*/}
            {/*    id="panel8bh-header"*/}
            {/*    className={classes.accordian_summary}*/}
            {/*  >*/}
            {/*    <Typography*/}
            {/*      className={classes.main_text}*/}
            {/*      sx={{*/}
            {/*        width: "33%",*/}
            {/*        flexShrink: 0,*/}
            {/*        fontWeight: "bold",*/}
            {/*        fontSize: "1.2rem",*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      Regulation*/}
            {/*    </Typography>*/}
            {/*    <Typography*/}
            {/*      className={classes.sub_text}*/}
            {/*      sx={{*/}
            {/*        color: "text.secondary",*/}
            {/*        fontWeight: "bold",*/}
            {/*        fontSize: "1rem",*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      Annotate variants based on HaploReg and RegulomeDB*/}
            {/*    </Typography>*/}
            {/*  </AccordionSummary>*/}
            {/*  <AccordionDetails>*/}
            {/*    <div className={classes.container}>*/}
            {/*      <Grid container spacing={3}>*/}
            {/*        <div className={classes.header_div}>*/}
            {/*          <h2>Parameters</h2>*/}
            {/*        </div>*/}
            {/*        <CommonTextElement*/}
            {/*          classes={classes}*/}
            {/*          formik={formik}*/}
            {/*          label={"LD Threshold"}*/}
            {/*          textVariable={"haplor_ld_threshold"}*/}
            {/*          tooltip={"Linkage disequilibrium threshold"}*/}
            {/*        />*/}
            {/*        <SelectFieldsElement*/}
            {/*          classes={classes}*/}
            {/*          formik={formik}*/}
            {/*          selectElement={epiOptions}*/}
            {/*          selectVariable={"haplor_epi"}*/}
            {/*          selectName={"EPI Options"}*/}
            {/*          tooltip={*/}
            {/*            "Source of the epigenome. There four possible values for this parameter which are vanilla for querying ChromHMM (Core 15-state model), imputed for querying ChromHMM (25-state model using 12 imputed marks), amd methyl for querying H3K4me1/H3K4me3 peaks and acetyl for querying H3K27ac/H3K9ac peaks."*/}
            {/*          }*/}
            {/*        />*/}
            {/*        <SelectFieldsElement*/}
            {/*          classes={classes}*/}
            {/*          formik={formik}*/}
            {/*          selectElement={consOptions}*/}
            {/*          selectVariable={"haplor_cons"}*/}
            {/*          selectName={"CONS Options"}*/}
            {/*          tooltip={*/}
            {/*            "Mammalian conservation algorithm to be used. There are three possible values for this parameter which are: gerp for GERP algorithm, siphy for SiPhy-omega algorithm, and both to use both algorithms."*/}
            {/*          }*/}
            {/*        />*/}
            {/*        <SelectFieldsElement*/}
            {/*          classes={classes}*/}
            {/*          formik={formik}*/}
            {/*          selectElement={genetypesOptions}*/}
            {/*          selectVariable={"haplor_genetypes"}*/}
            {/*          selectName={"Genetype Options"}*/}
            {/*          tooltip={*/}
            {/*            "The genomic coordinates for querying. There are possible values for this parameter, which are gencode for using Gencode genes coordinates and refseq for using RefSeq genes coordinates."*/}
            {/*          }*/}
            {/*        />*/}
            {/*      </Grid>*/}
            {/*    </div>*/}
            {/*  </AccordionDetails>*/}
            {/*</Accordion>*/}
          </div>
          <p className={classes.text_info}>
            * Please note this job will take at least two hours
          </p>
          <div className={classes.button_container}>
            {loading ? (
              <div>
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
    </div>
  );
};

export default WorkflowForm;
