import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const ImputationHome: React.FC<Props> = (props) => {
  return (
    <div className={classes.impute}>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          The aim of this pipeline is to impute the unmeasured SNPs in the GWAS
          summary statistics by using DISTMIX (v1) tool. DISTMIX uses 1000
          Genomes data as the reference panel to impute the unmeasured SNPs and
          their summary statistics (two-tailed Z-scores). The main algorithm
          underlying DISTMIX is based on the DIST tool.{" "}
        </p>
        <h3>Input</h3>
        <p>
          The input file is a gwas summary file consisting of at least 6
          compulsory columns and one optional column.
        </p>
        <h3>The compulsory columns</h3>
        <p>
          The 6 compulsory columns should be named as following names (all are
          in small case letters):
        </p>
        <ol>
          <li>rsid, this field contains SNPs rsids.</li>
          <li>
            chr, this field contains numerical for chromosome number, i,e, 1-22.
          </li>
          <li>bp, this field contains the genomic position of the SNPs.</li>
          <li>ref, this field contains the value of the reference allele.</li>
          <li>alt, this field contains the value of the alternative allele.</li>
          <li>z, this field containing the GWAS Z-scores.</li>
        </ol>
        <h3>Optional Column</h3>
        <p>
          There is one optional column that should be named as af1 (in upper
          case letters) to contain the information of allele frequency.
        </p>
        <h3>Input options:</h3>
        <p>Users should specify the below input options</p>
        <ol>
          <li>
            Indicating where the allele frequency information column (af1) is
            available in the GWAS summary file or not. In case, The GWAS summary
            file does not contain an AF column, users should provide the
            ancestry weight of the population from which the GWAS summary has
            been generated. This verion of the toool support the following
            populations of 1000 genomes data:
            <ol type={"a"}>
              <li>ASW, African Ancestry in Southwest US (AFR)</li>
              <li>
                CEU, Utah residents (CEPH) with Northern and Western European
                ancestry (EUR)
              </li>
              <li>CHB, Han Chinese in Beijing, China (ASN)</li>
              <li>CHS, Southern Han Chinese (ASN)</li>
              <li>CLM, Colombian in Medellin, Colombia (AMR)</li>
              <li>FIN, Finnish in Finland (EUR)</li>
              <li>GBR, British in England and Scotlant (EUR)</li>
              <li>IBS, Iberian populations in Spain (EUR)</li>
              <li>JPT, Japanese in Tokyo, Japan (ASN)</li>
              <li>LWK, Luhya in Wenbuye, Kenya (AFR)</li>
              <li>MXL, Mexican Ancestry from Los Angeles, USA (AMR)</li>
              <li>PUR, Puerto Rican in Puerto Rico (AMR)</li>
              <li>TSI, Toscani in Italia (EUR)</li>
              <li>YRI, Yoruba in Ibadan, Nigeria (AFR)</li>
            </ol>
            <p>
              Obs: AFR (African), AMR (American), EAS (East Asian), EUR
              (European) and SAS (South Asian).
            </p>
          </li>
          <li>
            Indicating the chromosome for the imputation. Users can provide
            chromosome number, e.g 11, chromosome number and p arm, e.g 11p,
            chromosome number and q arm, , e.g 11q. If the user left this option
            blank the program will impute the SNPs for all chromomoses (This
            option is time-consuming).
          </li>
          <li>
            Indicating The size of the prediction window in Mb. The default
            value is .{" "}
          </li>
          <li>
            Indicating the size of the wing padded around the prediction window
            in Mb. The default value is 0.5.
          </li>
        </ol>
        <h3>Output File</h3>
        <p>The output file is a plain text file with following nine columns</p>
        <ol>
          <li>rsid, containing SNPs rsids</li>
          <li>chr, containing chromosome number.</li>
          <li>bp, containing the genomic position of SNPs.</li>
          <li>a1, for the reference allele</li>
          <li>a2, for the alternative allele.</li>
          <li>waf1 (estimated/observed cohort study RAF)</li>
          <li>af1 (the reference panel RAF),</li>
          <li>z (Z-score), , containing the estimated z-scores.</li>
          <li>
            info (DISTMIX imputation information score), containing the
            estimated information(information of the imputed SNPs).{" "}
          </li>
          <li>pval (p-value; containing the estimated pvalues.</li>
          <li>
            type (SNP type). The value in this field can be either 0,1, or 2.
            The value of 0 indicates the corresponding SNP is unmeasured (thus,
            imputed) one but has been genotyped in the reference panel while the
            value of 1 indicates the corresponding SNP is measured one and has
            been genotyped in the reference panel. On the other hand, the value
            of 2 indicates the corresponding SNP is measured; however, it has
            not been genotyped in the reference panel.
          </li>
        </ol>
        <p>
          We also provide QQ plots and Manhattan plots using the estimated
          pvalues. For more details about DISTMIX (v1) refer to this{" "}
          <a
            href="https://github.com/dleelab/distmix"
            rel="noreferrer"
            target={"_blank"}
          >
            link
          </a>
        </p>
      </Paper>
    </div>
  );
};

export default ImputationHome;
