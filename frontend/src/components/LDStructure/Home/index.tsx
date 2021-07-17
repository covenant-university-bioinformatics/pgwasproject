import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const LDStructureHome: React.FC<Props> = (props) => {
  return (
    <div>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          In population genetics, linkage disequilibrium (LD) is the non-random
          association of alleles at different loci in a given population. Loci
          are said to be in linkage disequilibrium when the frequency of
          association of their different alleles is higher or lower than what
          would be expected if the loci were independent and associated randomly
        </p>
        <p>
          Linkage disequilibrium is influenced by many factors, including
          selection, the rate of genetic recombination, mutation rate, genetic
          drift, the system of mating, population structure, and genetic
          linkage. As a result, the pattern of linkage disequilibrium in a
          genome is a powerful signal of the population genetic processes that
          are structuring it.
        </p>
        <p>
          In spite of its name, linkage disequilibrium may exist between alleles
          at different loci without any genetic linkage between them and
          independently of whether or not allele frequencies are in equilibrium
          (not changing with time).[1] Furthermore, linkage disequilibrium is
          sometimes referred to as gametic phase disequilibrium;[2] however, the
          concept also applies to asexual organisms and therefore does not
          depend on the presence of gametes.
        </p>
      </Paper>
    </div>
  );
};

export default LDStructureHome;
