import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";

type Props = {};

const FocusHome: React.FC<Props> = (props) => {
  return (
    <div className={classes.tseadb}>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          The aim of this pipeline is to perform Disease-specific enrichment
          analysis annotation of genes that are associated with variants. We run
          the analysis using deTS: Tissue-Specific Enrichment Analysis is an R
          package (https://cran.r-project.org/web/packages/deTS/index.html).
          deTS provides enrichment analysis for 47 different tissues, which are:
        </p>
        <ol>
          <li>Adipose_Subcutaneous</li>
          <li>Adipose_Visceral_Omentum</li>
          <li>Adrenal_Gland</li>
          <li>Artery_Aorta</li>
          <li>Artery_Coronary</li>
          <li>Artery_Tibial</li>
          <li>Brain - Amygdala</li>
          <li>Brain_Anterior_cingulate_cortex_BA24</li>
          <li>Brain_Caudate_basal_ganglia</li>
          <li>Brain_Cerebellar_Hemisphere</li>
          <li>Brain_Cerebellum</li>
          <li>Brain_Cortex</li>
          <li>Brain_Frontal_Cortex_BA9</li>
          <li>Brain_Hippocampus</li>
          <li>Brain_Hypothalamus</li>
          <li>Brain_Nucleus_accumbens_basal_ganglia</li>
          <li>Brain_Putamen_basal_ganglia</li>
          <li>Breast_Mammary_Tissue</li>
          <li>Cells_EBV-transformed_lymphocytes</li>
          <li>Cells_Transformed_fibroblasts</li>
          <li>Colon_Sigmoid</li>
          <li>Colon_Transverse</li>
          <li>Esophagus_Gastroesophageal_Junction</li>
          <li>Esophagus_Mucosa</li>
          <li>Esophagus_Muscularis</li>
          <li>Heart_Atrial_Appendage</li>
          <li>Heart_Left_Ventricle</li>
          <li>Liver</li>
          <li>Lung</li>
          <li>Muscle_Skeletal</li>
          <li>Nerve_Tibial</li>
          <li>Ovary</li>
          <li>Pancreas</li>
          <li>Pituitary</li>
          <li>Prostate</li>
          <li>Skin_Not_Sun_Exposed_Suprapubic</li>
          <li>Skin_Sun_Exposed_Lower_leg</li>
          <li>Small_Intestine_Terminal_Ileum</li>
          <li>Spleen</li>
          <li>Stomach</li>
          <li>Testis</li>
          <li>Thyroid</li>
          <li>Uterus</li>
          <li>Vagina</li>
          <li>Whole_Blood</li>
        </ol>
        <h3>Input</h3>
        <p>
          deTS accepts plain text input files with a list of gene names. An
          example of an input file contains 10 genes is given below
        </p>
        <ul>
          <li>genes</li>
          <li>A1BG</li>
          <li>A1BG-AS1</li>
          <li>A1CF</li>
          <li>A2M</li>
          <li>A2M-AS1</li>
          <li>A2ML1</li>
          <li>A2MP1</li>
          <li>A3GALT2</li>
          <li>A4GALT</li>
          <li>A4GNT</li>
        </ul>
        <h3>Input options</h3>
        <p>Users should specify the below input options</p>
        <ol>
          <li>
            The reference panel which can be either GTex score (GTEx_t_scor) or
            Encode score ,ENCODE_z_score).
          </li>
          <li>
            Ratio: The threshold to define tissue-specific genes (with top
            t-score or z-score), the default value is 0.05.
          </li>
          <li>
            <p>
              Pvalue adjustment method (p_adjust_method). There 8 direferent
              values for pvalue adjustment method, which are
            </p>
            <ol type={"a"}>
              <li>"holm": Holm pvalue adjustment method</li>
              <li>"hochberg": Hochberg pvalue adjustment method</li>
              <li>"hommel":Hommel pvalue adjustment method</li>
              <li>"bonferroni": Bonferroni pvalue adjustment method</li>
              <li>"BH": Benjamini-Hochberg pvalue adjustment method</li>
              <li>
                "BY": Benjamini & Yekutieli (2001) pvalue adjustment method
              </li>
              <li>"fdr": false discovery rate pvalue adjustment method</li>
              <li>"none": no pvalue adjustment method will be applied</li>
            </ol>
          </li>
        </ol>
        <h3>Output File</h3>
        <p>
          deTS reports the output is a plain text file containing the pvalue of
          tissue-specific enrichment result. Rows stand for tissue names and
          columns stand for sample names
        </p>
      </Paper>
    </div>
  );
};

export default FocusHome;
