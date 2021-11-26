import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const PathwayBasedHome: React.FC<Props> = (props) => {
  return (
    <div className={classes.pathway_based}>
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

export default PathwayBasedHome;
