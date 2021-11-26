import React, { useRef, useState } from "react";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import classes from "./index.module.scss";
import { Button, CircularProgress, Grid, Hidden } from "@material-ui/core";
import { generalFileForm } from "../../utility/general";
import { PlayArrow } from "@material-ui/icons";
import { RouteComponentProps } from "react-router-dom";
import {
  handleFileUploadChangedCommon,
  submitToServer,
} from "../../utility/form_common";
import {
  selectFieldsElement,
  commonTextElement,
  commonFileElement,
} from "../../utility/form_common_fields";

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
  const [uploadFile, setUploadFile] = useState<any>(null);
  const fileInput = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik<UserFormData>({
    initialValues: {
      filename: "",
      job_name: "",
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
    },

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
      console.log("Values", values);
      submitToServer(values, uploadFile, setLoading, "pathwaybased", props);
    },
  });

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
    <div className={classes.pathwaybased_form}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <div className={classes.header_div}>
            <h2>Job Name</h2>
          </div>
          {commonTextElement(classes, formik, "Job Name", "job_name")}
          <div className={classes.header_div}>
            <h2>Upload a file</h2>
          </div>
          {commonFileElement(
            classes,
            formik,
            fileInput,
            handleFileUploadChange,
            handleFileBlur,
            handleRemove
          )}
          <div className={classes.header_div}>
            <h2>Summary statistics column positions</h2>
          </div>
          {generalFileForm(classes, formik, ["marker_name", "p_value"])}
          <div className={classes.header_div}>
            <h2>Tool Parameters</h2>
          </div>
          {selectFieldsElement(
            classes,
            formik,
            populations,
            "population",
            "Population"
          )}

          {selectFieldsElement(
            classes,
            formik,
            run_pathways,
            "run_pathway",
            "Run Pathway Option"
          )}
          {selectFieldsElement(
            classes,
            formik,
            chromosomes,
            "chr",
            "Chromosome"
          )}
          {selectFieldsElement(
            classes,
            formik,
            geneSetFileOptions,
            "gene_set_file",
            "Gene set file"
          )}
          {commonTextElement(
            classes,
            formik,
            "Pvalue Cut off",
            "pvalue_cutoff"
          )}
          {commonTextElement(
            classes,
            formik,
            "Up Window Size(bp)",
            "up_window"
          )}
          {commonTextElement(
            classes,
            formik,
            "Down Window Size(bp)",
            "down_window"
          )}
          {commonTextElement(classes, formik, "Max SNPs", "max_snp")}
          {selectFieldsElement(
            classes,
            formik,
            geneScoringOptions,
            "gene_scoring",
            "Gene Scoring Option"
          )}
          {commonTextElement(
            classes,
            formik,
            "Merge Distance",
            "merge_distance"
          )}
          {commonTextElement(classes, formik, "MAF Cut off", "maf_cutoff")}
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

export default GeneBasedForm;
