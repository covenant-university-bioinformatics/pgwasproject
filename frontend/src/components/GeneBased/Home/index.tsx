import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const GeneBasedHome: React.FC<Props> = (props) => {
  return (
    <div className={classes.genebased}>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          The gene-based approach aggregates all SNPs within a candidate gene
          and its regulatory region to report gene-level pvalue. This approach
          is used to identify genes associated with a particular
          trait/phenotype. Also, this method is used to identify
          tissue-correlated genes based on tissue-specific annotation files,
          i.e., tissue-specific gene set files. The name of the main output file
          terminates with 'genes.out and contains 12 columns. The header of
          'genes.out' files consist of the following column names:
        </p>
        <h3>User Options</h3>
        <ol>
          <li>
            The population from which the GWAS summary file has been generated.
            We supported the five super populations of 1000 genomes.
          </li>
          <li>
            The option that indicates how to deal with synonymous SNP IDs
            (synonym). The values for this option are:{" "}
            <ol type={"a"}>
              <li>
                No, to suppress automatically loading data for synonymous SNP ID
                this option will speed up the process
              </li>
              <li>
                Drop, SNPs that have multiple synonyms in the data will be
                removed from the analysis
              </li>
              <li>
                Drop-dup, for each synonym entry only the first listed in the
                synonym file is retained;
              </li>
              <li>
                Skip, the SNPs are left in the data and the synonym entry in the
                synonym file is skipped.
              </li>
              <li>
                Skip-dup, the genotype data for all synonymous SNPs is retained.
              </li>
            </ol>
          </li>
          <li>
            A value upstream annotation window around genes in kb. The default
            value is 0.
          </li>
          <li>
            A value downstream annotation window around genes in kb. The default
            value is 0.
          </li>
          <li>The tissue to calculate tissue-specific gene set analysis.</li>
        </ol>

        <h3>Output File</h3>
        <p>
          The name of the main output file terminates with 'genes.out and
          contains 12 columns. The header of 'genes.out' files consist of the
          following column names:
        </p>
        <ul>
          <li>GENE: NCBI gene ID</li>
          <li>CHR: Chromosome ID</li>
          <li>START: Start position of the gene</li>
          <li>STOP: Stop position of the gene</li>
          <li>NSNPS: The number of SNPs mapped to the gene</li>
          <li>
            NPARAM: The number of relevant parameters used in the model (this is
            an approximate value)
          </li>
          <li>N : The sample size</li>
          <li>ZSTAT: The Z-value for the gene</li>
          <li>P: Gene level pvalue of the permutation</li>
          <li>PERMP: pvalue of the permutation</li>
          <li>NPERM: The number of permutations</li>
          <li>GENE_Name: Gene name</li>
        </ul>
        <p>Besides this main file we provide QQ plot and Manhattan plot.</p>
        <p>
          This analysis is facilitated by the usage of{" "}
          <a
            rel="noreferrer"
            target="_blank"
            href="https://ctg.cncr.nl/software/magma"
          >
            MAGMA
          </a>{" "}
          and{" "}
          <a
            rel="noreferrer"
            target="_blank"
            href="https://github.com/eskederks/eMAGMA-tutorial"
          >
            eMAGMA
          </a>
        </p>
      </Paper>
    </div>
  );
};

export default GeneBasedHome;
