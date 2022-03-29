import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const EqtlColocHome: React.FC<Props> = (props) => {
  return (
    <div className={classes.eqtlcoloc}>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          The aim of this pipeline is to perform Bayesian genetic colocalization
          analysis of a GWAS study and tissue-specific eQTL significant variants
          using coloc R package. The result of the test reports whether they s
          arem common genetic causal variant(s) between the trait of the GWAS
          study and tissue-specific eQTL significant variants. GWAS study and
          tissue-specific eQTL should contain the same snps in the same order,
          or should contain snp names through which the common snps can be
          identified.
        </p>
        <h3>Input</h3>
        <p>
          The input file is a gwas summary file consisting of at least 2
          compulsory fields, which are: and one optional column.
        </p>
        <ol>
          <li>rsid, this field contains SNPs rsids.</li>
          <li>pval_nominal, this field contains SNPs’ p values.</li>
        </ol>
        <p>
          Besides the above 2 field users can provide more optional information
          to get more accurate results, the optional fields are:
        </p>
        <ol>
          <li>slope, this field contains beta values.</li>
          <li>
            slope_se, this field contains the values of SNPs standard error.
          </li>
        </ol>
        <h3>Parameters</h3>
        <p>Users should specify the following parameters:</p>
        <ol>
          <li>
            eqtl_file, to specify the name of a tissue to perform colocalization
            analysis. In this version we use eqtl version 8.
          </li>
          <li>
            p1, this parameter specifies the prior probability a SNP is
            associated with trait 1, i.e, the GWAS summary
          </li>
          <li>
            p2, this parameter specifies the prior probability a SNP is
            associated with trait 2, i.e, the eqtl tissue.
          </li>
          <li>
            p12, this parameter specifies the prior probability a SNP is
            associated with both traits, i.e, the GWAS summary and the eqtl
            tissue.
          </li>
          <li>
            type, this parameter specifies the type of trait in the GWAS summary
            such as case-control or quantitative.
          </li>
          <li>
            s, this parameter is required for a case-control GWAS summary
            dataset and it indicates the proportion of samples in the GWAS
            summary that are cases.
          </li>
        </ol>
        <h3>Output</h3>
        <p>The output is reported in two files:</p>
        <ol>
          <li>
            <p>
              Summary. This file reports the five probabilities considering all
              overlapped varaintants, these probabilities are:
            </p>
            <ol type={"a"}>
              <li>
                H0: the posterior probability no causal variant in both traits,
              </li>
              <li>
                H1: the posterior probability that the causal variants are
                associated with the GWAS summary only.
              </li>
              <li>
                H2: the posterior probability that the causal variants are
                associated with the eqtl tissue only
              </li>
              <li>
                H3: the posterior probability that there are distinct causal
                variants for each trait, i.e each trait is associated with
                distinct causal variants.
              </li>
              <li>
                H4: the posterior probability that there are common causal
                variants.
              </li>
            </ol>
            <li>
              <p>
                Results. This file reports annotation for the overlapped varains
                in the GWAS summary and eqtl tissue. This file contains the
                following fields
              </p>
              <ol type={"a"}>
                <li>snp; SNPs rsids</li>
                <li>Pvalues.df1; SNP p value for GWAS Summary.</li>
                <li>
                  MAF.df1; SNP Minor allele frequency for GWAS Summary, same as
                  for eqtl tissue.
                </li>
                <li>N.df1; Number of SNPs in the GWAS Summary.</li>
                <li>V.df1; Standard error of SNPs in the GWAS Summary.</li>
                <li>Z.df1; z score for GWAS Summary.</li>
                <li>R.df1; Regression coefficients for GWAS summary.</li>
                <li>
                  lABF.df1; logABFs (log Approximate Bayes Factors) for GWAS
                  Summary.
                </li>
                <li>Pvalues.df2</li>
                <li>MAF.df2; SNP Minor allele frequency for eqtl tissue.</li>
                <li>N.df2; Number of SNPs in eqtl.</li>
                <li>V.df2; Standard error of SNPs in eqtl tissue.</li>
                <li>Z.df2; z score for eqtl.</li>
                <li>R.df2; Regression coefficients for eqtl tissue.</li>
                <li>
                  lABF.df2, logABFs (log Approximate Bayes Factors) for eqtl.
                </li>
                <li>internal.sum.lABF</li>
                <li>
                  SNP.PP.H4; The posterior probability of the SNP being causal.
                </li>
              </ol>
            </li>
          </li>
        </ol>
      </Paper>
    </div>
  );
};

export default EqtlColocHome;
