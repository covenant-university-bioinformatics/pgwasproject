import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const DeleteriousnessHome: React.FC<Props> = (props) => {
  return (
    <div>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          Genome Deleteriousness is the process of identifying non synonymous
          SNPS that can cause amino acid changes.
        </p>
        <p>
          Deleterious single nucleotide variants (SNVs) may lead to loss of
          structure or function of a protein. Deleteriousness is a measure of
          SNVs that reduce organismal fitness and it is usually obtained under
          purifying selection.
        </p>
        <p>
          This tool will measure the deleteriousness of variants from the Genome
          wide association studies (GWAS) by prediction. Cumulative
          deleteriousness across a genome assembly gives robust data on variant
          impact on the organism.
        </p>
        <p>
          This analysis uses Annovar tool and the dbNSFP database that includes
          secereal scores that have been predicted for several SNPs using
          diverse machine learning algorithms.
        </p>
      </Paper>
    </div>
  );
};

export default DeleteriousnessHome;
