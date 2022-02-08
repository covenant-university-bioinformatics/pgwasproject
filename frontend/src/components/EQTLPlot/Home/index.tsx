import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const EQTLPlot: React.FC<Props> = (props) => {
  return (
    <div className={classes.eqtlplot}>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          SMR can visualize SMR/Heidi results and generate two plots for a given
          particular probe. These two plots are probes' locus plot and effect
          sizes plot. Probe’s locus plot demonstrates regional information of
          SNPs relative to genomic position. Probe’s locus plot also displays p
          values from eQTL and SMR p values in the y-axis. The effect sizes plot
          is used to visualize the effect sizes from GWAS summary file against
          those from eQTL study.
        </p>
        <h3>Input</h3>
        <p>
          SMR can visualize SMR/Heidi results and generate two plots for a given
          particular probe. These two plots are probes' locus plot and effect
          sizes plot. Probe’s locus plot demonstrates regional information of
          SNPs relative to genomic position. Probe’s locus plot also displays p
          values from eQTL and SMR p values in the y-axis. The effect sizes plot
          is used to visualize the effect sizes from GWAS summary file against
          those from eQTL study.
        </p>
        <ol>
          <li>
            <strong>SNP</strong> containing SNPs rsids
          </li>
          <li>
            <strong>A1</strong> refers to the effect allele, i.e. the reference
            allele.
          </li>
          <li>
            <strong>A2</strong> refers to the alternative allele.
          </li>
          <li>
            <strong>freq</strong> frequency of the effect allele (A1). This
            column will be used for quality control assessment to remove SNPs
            that are with discrepant allele frequencies between data sets.
          </li>
          <li>
            <strong>b</strong> beta which refers to GWAS effect size. If GWAS
            data came from case-control study and reported the odd ratio (OR),
            users need to provide the log of OR.
          </li>
          <li>
            <strong>se</strong> as standard error
          </li>
          <li>
            <strong>p</strong> as SNPs p-value.{" "}
          </li>
          <li>
            <strong>n</strong> sample size, as the tool does not use the sample
            size for SMR or HEIDI analysis. Therefore, users can replace this
            column by "NA" if it is not available.
          </li>
        </ol>
        <h3>Plot Options</h3>
        <p>
          Options for generating plots are similar to the options of the
          SMR/Heidi test. However, users should specify the probe id that should
          be used. Users can set a value for several parameters. These
          parameters are into three categories, which are: general parameters,
          Heidi method parameters, and plot parameters.
        </p>
        <h3>General parameters</h3>
        <ol>
          <li>
            Population, here users can choose the population from which the GWAS
            summary has been generated. This parameter is crucial as using a
            different population group can result in misleading results.
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
            default value is 3.
          </li>
          <li>
            The maximum number of eQTLs to be used for Heidi test (heidi_max_m).
            The default value is 20.
          </li>
        </ol>
        <h3>Plot Parameters</h3>
        <ol>
          <li>
            Specify probe to plot (probe). Users should choose a particular
            probe to plot and should be careful with this option, as using the
            wrong plot will result in error. We recommend that users first run
            SMR analysis then choose probe id.
          </li>
          <li>
            Specify a window size to plot probe (probe_wind). The default value
            is 500 kb.{" "}
          </li>
          <li>
            Gene range list (gene_list). This is used to specify the genomic
            coordinates for genes. Users can choose either glist-hg19 or
            glist-hg38. The default value is glist-hg19
          </li>
        </ol>
        <h3>Output</h3>
        <p>The two plots will be reported in .jpeg format.</p>
      </Paper>
    </div>
  );
};

export default EQTLPlot;
