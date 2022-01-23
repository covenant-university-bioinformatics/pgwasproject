import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const PathwayBasedHome: React.FC<Props> = (props) => {
  return (
    <div className={classes.pathway_based}>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          Pascal (Pathway scoring algorithm) can be used to perform gene scoring
          and pathway analysis using GWAS summary statistics. The gene score
          analysis aggregates SNP-level p-values to gene-level p-values by
          combining SNPs' physical distance and linkage disequilibrium (LD)
          information. LD is calculated using 1000 genomes phase 3. Furthermore,
          the results obtained from gene score analysis can be used to report
          statically significant biological pathways.
        </p>
        <h3>Input file</h3>
        <p>
          The input file is a plain text file with columns without a header
          line. The first column consists of reference SNP cluster IDs (Rsids),
          while the second column consists of the SNPs p-values.
        </p>
        <h3>Parameters</h3>
        <p>
          There are several tuning parameters and options to run Pascal. These
          parameters and options include:
        </p>
        <ol>
          <li>
            p-value cutoff to report the statistically significant genes and
            pathways. The default value is 0.05.
          </li>
          <li>
            The underlying population to calculate LD. Users can choose one of
            five 1000 genomes super populations, which are African (afr),
            American (amr), European (eur), East Asian (eas), and South Asian
            (sas).
          </li>
          <li>
            Upstream and downstream window size around genes. The default values
            are 50000 base-pairs upstream of transcription start site and 50000
            base-pairs downstream of transcription termination site.
          </li>
          <li>
            Maximum number of SNPs per gene. The default value is 3000 SNPs.
          </li>
          <li>
            Gene scoring method as either max or sum. The max gene scoring
            method is based on the maximum-of-chi-squares algorithm (MOCS),
            while the sum method is based on the sum-of-chi-squares (SOCS)
            algorithm.
          </li>
          <li>
            The minor allele frequency cutoff value (between 0 and 1). The
            default value is 0.05
          </li>
          <li>
            Geneset file where users can choose the database for the pathway
            analysis either as msigdb.v4.0.entrez or msigBIOCARTA_KEGG_REACTOME
            data set
          </li>
        </ol>
        <h3>Results</h3>
        <p>The results consist of the following files</p>
        <ul>
          <li>A file of gene score results.</li>
          <li>
            In case the users choose to run pathways analysis, there will be
            more two files, which are:
            <ul>
              <li>The pathway score results.</li>
              <li>Fusion gene scores results.</li>
            </ul>
          </li>
        </ul>
        <h3>Filtering Results</h3>
        <p>
          Besides filtering results based on p-values, we recommend further
          filtering based on the status of the genes scoring algorithm by
          removing all records with 'DAVIES_FAIL_FAREBROTHER_FAIL' or 'NOT_RUN'.
        </p>
        <p>
          This analysis is facilitated by the usage of{" "}
          <a
            rel="noreferrer"
            target="_blank"
            href="https://ctg.cncr.nl/software/magma"
          >
            PASCAL
          </a>
        </p>
      </Paper>
    </div>
  );
};

export default PathwayBasedHome;
