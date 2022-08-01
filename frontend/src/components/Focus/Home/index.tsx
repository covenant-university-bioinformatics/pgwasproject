import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";

type Props = {};

const FocusHome: React.FC<Props> = (props) => {
  return (
    <div className={classes.focus}>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          The aim of this pipeline is to perform Bayesian fine camping using
          FOCUS (Fine-mapping Of CaUsal gene Sets) fine mapping software
          (https://github.com/bogdanlab/focus). This pipeline uses 1000 Genomes
          data as the reference panel to compute casal genes in a GWAS summary
          statistics. The main algorithm underlying FOCUS iis based on the
          finmap method for fine mapping.
        </p>
        <h3>Input</h3>
        <p>
          The input file is a gwas summary file consisting of at least 7
          compulsory columns, which are:{" "}
        </p>
        <h3>The compulsory columns</h3>
        <p>
          The 6 compulsory columns should be named as following names (all are
          in small case letters):
        </p>
        <ol>
          <li>rsid, this field contains SNPs rsids.</li>
          <li>
            CHR, this field contains numerical for chromosome number, i,e, 1-22.
          </li>
          <li>BP, this field contains the genomic position of the SNPs.</li>
          <li>
            A1, this field contains the value of the reference allele (effect
            allele).
          </li>
          <li>A2, this field contains the value of the alternative allele.</li>
          <li>
            BETA (or OR), this field containing the GWAS beta score of SNPs, i.e
            the linear/logistic regression coefficient. For the case control
            studies, users can use Log odds ratio (OR). In this filed, the value
            of 0 indicates no effect and any value above 0 indicates that A1 is
            trait/risk increasing (effect allele).
          </li>
          <li>P, this field contains SNPs pvalue.</li>
        </ol>
        <p>Notes: The zcore column is optional and its name should be Z</p>

        <h3>Input Options</h3>
        <p>Users should specify the below input options</p>
        <ol>
          <li>
            Indicating the the reference panel for the fine mapping.This verion
            of the tool support the the five supper populations of 1000 genomes
            data, which are: African (afr), American (amr), East Asian (eas),
            European (eur), and South Asian (sas).
          </li>
          <li>
            Indicating the chromosome number to perform fine mapping for
            specific chromosome.
          </li>
          <li>
            Specifying the genomic region for fine mapping as a start and stop
            location (in base pairs). To perfume fine mapping for the whole
            chromosome, Users can set a value of ‘none’ for both start and stop
            position.
          </li>
          <li>
            Indicates where the fine mapping region should contain GWAS signal
            for all populations. The default value is false.
          </li>
          <li>
            Indicating name of tissue for tissue-prioritized fine-mapping. In
            this verion we use a list of tissues from Gtex v7.
          </li>
          <li>
            A p value threshold for GWAS data to perform fine-mapping. The
            default is 5e-8
          </li>
          <li>
            A value for diagonal adjustment for linkage-disequilibrium (LD)
            estimate, ie, ridge-term. The value of this parameter is in the
            range of 0-1 and the default value is 0.1.
          </li>
          <li>
            Setting the maximum number of genes that can be considered as
            causal. The default value is 3.
          </li>
          <li>
            The prior probability for gene causality the default value is 1e-3.
          </li>
          <li>
            Setting the probability to determine the credible gene set. The
            default value is 0.9.
          </li>
          <li>
            Indicating the minimum average LD-based imputation accuracy allowed
            for expression weight SNP Z-score. The value of this parameter is in
            the range of 0-1 and default value is 0.7.
          </li>
          <li>
            Indicating a cutoff value of the maximum fraction of SNPs allowed to
            be missing per gene, and will be imputed using LD. The value of this
            parameter is in the range of 0-1 and default value is 0.5.
          </li>
          <li>Indicating where to generate fine-mapping plots or not.</li>
        </ol>
        <h3>Output File</h3>
        <p>
          The main output file is a plain text file with following 16 columns
        </p>
        <ol>
          <li>A value of the ensembl gene ID and its name is ens_gene_id</li>
          <li>
            A value of the ensembl transcript ID and its name is ens_tx_id
          </li>
          <li>Name of the gene/linc/pseudogene and its name is mol_name</li>
          <li>
            The name of the tissue that the original expression was measured in
            and its name is tissue
          </li>
          <li>
            The name of the QTL reference panel and its name i values of this
            column includes gene, lncRNA, lincRNA, and pseudogene.
          </li>
          <li>The chromosome number and its name is chrom</li>
          <li>Transcription start site and its name is tx_start</li>
          <li>Transcription stop site and its name is tx_stop</li>
          <li>
            Inference procedure for model (e.g., LASSO, BSLMM) and its name is
            inference
          </li>
          <li>
            The value of Rsquared that predicted in the cross-validation process
            and its name is cv.R2
          </li>
          <li>P-value of the Cross-validation and its name is cv.R2.pval</li>
          <li>Marginal TWAS Z score and its name is twas_z</li>
          <li>Marginal posterior inclusion probability and its name is pip</li>
          <li>
            Indicating whether or not model is included in the credible set and
            its name is in_cred_set
          </li>
          <li>Identifier for the genomic region and its name is region</li>
        </ol>
        <p>
          We also provide QQ plots and Manhattan plots using pvalues in the
          original input file. Also, fine-mapping plots will be generated based
          on the users option.
        </p>
      </Paper>
    </div>
  );
};

export default FocusHome;
