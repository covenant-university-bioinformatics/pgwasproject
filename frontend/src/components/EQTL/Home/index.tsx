import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const EQTLHome: React.FC<Props> = (props) => {
  return (
    <div>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          Gene expression variation is influenced by strong underlying genetic
          factors. Expression quantitative trait loci (eQTL) analysis is used to
          identify variants that influence the expression of some genes. eQTL
          correlates single nucleotide polymorphisms (SNPs) with associated
          genes.
        </p>
        <p>
          This analysis integrates SNP-gene associations from an eQTL reference
          dataset with GWAS summary statistics. Annotation files will be
          generated where SNPs are assigned to genes based on their association
          with gene expression. The SNP-gene associations are tissue specific;
          hence we will estimate what genes are more highly associated with a
          trait at the tissue level. The SNP-gene associations are tissue
          specific; hence genes will be estimated as more highly associated with
          a trait at the tissue level.
        </p>
      </Paper>
    </div>
  );
};

export default EQTLHome;
