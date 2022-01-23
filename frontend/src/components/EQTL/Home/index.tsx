import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const EqtlHome: React.FC<Props> = (props) => {
  return (
    <div className={classes.eqtl}>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          This tool performs Expression quantitative trait locus (eQTL) analysis
          using GWAS summary statistics. We use the SMR tool
          (https://yanglab.westlake.edu.cn/software/smr/) to perform eqtl
          analysis based on two methods SMR or HEIDI analysis. SMR analysis is
          always performed however, users can choose to perform HEIDI analysis.
          There are three types of analysis, which are:
        </p>
        <ol>
          <li>
            <p>
              <strong>SMR</strong>
            </p>
            <p>
              This helps to identify cis and trans eqtls in the summary
              staticstics. It mainly helps to identify genes whose expression
              levels are associated with the phenotype due to pleiotropy. The
              SMR p-value denotes this. The significance level is 8.4 * 10^-6 In
              the output file “.smr” we have the probe_id, probe_chr, gene name,
              gene base position, and the top eqtl SNP close to the position.
              The HEIDI p-value shows if the association is due to linkage or
              pleiotropy. A p-value less than 0.05 shows association is due to
              pleiotropy.
            </p>
          </li>
          <li>
            <p>
              <strong>Trans SMR</strong>
            </p>
            <p>
              Trans SMR identifies regulated genes that are far from the SNPs.
              The regulated genes might be in another chromosome. By default
              regulating genes in distance more than 5Mb away from the probe is
              considered as a trans regulation.
            </p>
          </li>
          <li>
            <p>
              <strong>Multi SMR</strong>
            </p>
            <p>
              Multi SMR method tests the association of all SNPs in a given
              region that have passed the p-value cutoff and are not in very
              high LD.
            </p>
          </li>
        </ol>
        <p>
          <strong>
            Note that based on the GWAS summary and eqtl Summary, the results of
            trans and multi SMR might be empty.
          </strong>
        </p>
        <h3>Input file</h3>
        <p>
          The input file is a gwas summary file consist of the following column
          headers:
        </p>
        <ol>
          <li>
            <strong>SNP</strong>: containing SNPs rsids
          </li>
          <li>
            <strong>A1</strong>: refers to the effect allele i.e. the reference
            allele
          </li>
          <li>
            <strong>A2</strong>: refers to the alternate allele
          </li>
          <li>
            <strong>freq</strong>: frequency of the effect allele (A1). This
            column will be used for quality control assessment to remove SNPs
            that are with discrepant allele frequencies between data sets.
          </li>
          <li>
            <strong>b</strong>: beta which refers to GWAS effect size. If GWAS
            data came from case-control study and reported the odd ratio (OR),
            users need to provide the log of OR.
          </li>
          <li>
            <strong>se</strong>: as standard error
          </li>
          <li>
            <strong>p</strong>: as SNPs p-value.
          </li>
          <li>
            <strong>n</strong>: sample size, as the tool does not use the sample
            size for SMR or HEIDI analysis. Therefore, users can replace this
            column by "NA" if it is not available.
          </li>
        </ol>
        <h3>Parameters</h3>
        <p>
          Users can set a value for several parameters. These parameters are
          into four categories, which are: general parameters, Heidi method
          parameters, trans SMR test parameters, and for multi-SNP-based SMR
          test.
        </p>
        <h3>General parameters</h3>
        <ol>
          <li>
            Population, here users can choose the population from which the GWAS
            summary has been generated. This parameter is crucial as using a
            different population group can result in misleading results.{" "}
          </li>
          <li>
            The minor allele frequency (maf) cutoff value. The default value of
            this parameter is 0.05
          </li>
          <li>
            A threshold value for allele frequency quality control (diff_freq).
            The default value is 0.2.
          </li>
          <li>
            A threshold value for the maximum proportion of variants
            (diff_freq_prop) that can vary in the population. The default value
            is 0.05.
          </li>
          <li>
            A value of a window arround cis-eQTLs signal (cis_wind). The default
            value is 2000 Kb.
          </li>
          <li>
            A cutoff for SMR test pvalue (peqtl_smr). The default value is
            5.0e-8.
          </li>
          <li>
            The upper limit value for R-square value to prune SNPs
            (ld_upper_limit). The default value is 0.9
          </li>
          <li>
            The lower limit value for R-square value to prune SNPs
            (ld_lower_limit). The default value is 0.05.
          </li>
          <li>
            eQTL file where users can choose Westra or CAGE eqtl. Also users can
            shoes a tissue for for Gtex v.8
          </li>
        </ol>
        <h3>Heidi Parameters</h3>
        <p>
          If users choose to run Heidi test besides SMR, they set the below
          parameters
        </p>
        <ol>
          <li>
            A cutoff for Heidi test pvalue (peqtl_heidi). The default value is
            1.57e-3.
          </li>
          <li>
            HEIDI test method (heidi_mtd) where 0 indicates the original HEIDI
            method and the value of 1 indicates the new HEIDI method.The default
            value is 1.
          </li>
          <li>
            The minimum of f cis-SNPs to perfom Heidi test (heidi_min_m). The
            default value is 3
          </li>
          <li>
            The maximum number of eQTLs to be used for Heidi test (heidi_max_m).
            The default value is 20.
          </li>
        </ol>
        <h3>Parameters for trans SMR analysis (SMR test for trans regions)</h3>
        <p>
          If users chose to run a trans SMR test then users can specify a value
          for trans window size (trans_wind). The default value is 1000 Kb.
        </p>
        <h3>Parameters for Multi-SNP-based SMR test</h3>
        <p>
          If users chose to run a Multi-SNPs SMR test then users can specify the
          following parameters:
        </p>
        <ol>
          <li>
            A value for a window size in Kb to select SNPs in the cis-region
            (set_wind). The defulat value is -9 which resulting in selecting
            SNPs in the whole cis-region.
          </li>
          <li>
            A cutoff value for R-square value to prune SNPs (ld_multi_snp). The
            default value is 0.1.
          </li>
        </ol>
        <h3>Output File</h3>
        <ol>
          <li>
            <p>The output files are name using the pattern below</p>
            <p>
              <strong>pattern1.pattern2.pattern3</strong>
            </p>
            <ul>
              <li>
                <strong>Pattern1</strong> refers to an eQTL file, i.e, Westra,
                CAGE or a tissue for Gtex.
              </li>
              <li>
                <strong>Pattern2</strong> would be either null for SMR and Heidi
                test, ‘_trans’ for trans SMR, or ‘_muiti’ for multi-SNPs SMR
                test.
              </li>
              <li>
                <strong>Pattern3</strong> would be ‘.smr’ for both SMR/Heidi
                test and trans SMR test or ‘.msmr’ for r multi-SNPs SMR test.
              </li>
            </ul>
          </li>
          <li>
            <p>
              The contents of the output files will contain all the information
              in the input GWAS summary files besides the following fields:
            </p>
            <ul>
              <li>ProbeID</li>
              <li>Probe_Chr</li>
              <li>Gene</li>
              <li>b_eQTL (beta value from eQTL)</li>
              <li>se_eQTL (standard error value from eQTL)</li>
              <li> p_eQTL (pvalue from eQTL)</li>
              <li>b_SMR (beta value from SMR)</li>
              <li>se_SMR (standard error value from SMR)</li>
              <li>p_SMR (pvalue from SMR)</li>
              <li>p_HEIDI (pvalue from Heidi)</li>
              <li>nsnp_HEIDI (number of SNPs used in Heidi)</li>
            </ul>
          </li>
          <li>
            We also provide QQ plots and Manhattan plots. For more information
            refer to SMR manual at
            <a
              target={"_blank"}
              rel="noreferrer"
              href="https://yanglab.westlake.edu.cn/software/smr/#SMR"
            >
              https://yanglab.westlake.edu.cn/software/smr/#SMR
            </a>
          </li>
        </ol>
      </Paper>
    </div>
  );
};

export default EqtlHome;
