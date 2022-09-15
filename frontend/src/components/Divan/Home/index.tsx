import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";

type Props = {};

const DivanHome: React.FC<Props> = (props) => {
  return (
    <div className={classes.divan}>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          The aim of this pipeline is to perform Disease-specific annotation
          using DIVAN (Disease-specific Variant ANnotation) tool
          (https://sites.google.com/site/emorydivan/software) to score a
          variant’s impact in a given disease-specific. DIVAN can score both
          known variants and arbitrary genomic regions for 45 different
          diseases/traits. The pre-computed annotation used by DIVAN tool is
          based on hg19 genome build. The underline algorithm of DIVAN is based
          on feature selection, ensemble-learning framework for disease-specific
          noncoding variant annotation and variant prioritization.
        </p>
        <h3>Input</h3>
        <p>DIVAN accepts two types of files as input formats:</p>
        <ol>
          <li>
            <p>
              A list of Known SNPs this type of file. This file consist of one
              field containing variants rsids and can be used to annotate known
              variants. An example of the contents of such input file format is
              given below
            </p>
            <ul>
              <li>rs1495966</li>
              <li>rs7572482</li>
              <li>rs12487660</li>
              <li>rs563624</li>
              <li>rs3131863</li>
              <li>rs1971773</li>
              <li>rs2285515</li>
              <li>rs913678</li>
              <li>rs2187961</li>
            </ul>
          </li>
          <li>
            <p>
              A tab separated bed format containing the genomic position of
              variants, i.e, chr start end. This type of files can be used to
              annotate both known variants and arbitrary genomic regions. An
              example of the contents of such input file format is given below
            </p>
            <ul>
              <li>chr19	35660450	35660500</li>
              <li>chr20	48955400	48955500</li>
              <li>chr22	35581200	35581400</li>
            </ul>
          </li>
        </ol>
        <h3>Input Options</h3>
        <p>Users should specify the below input options</p>
        <ol>
          <li>Indicating whether the variants are known or not (variant_type).</li>
          <li>Disease name where users can choose a trait out of the given 45 diseases.</li>
          <li>In case of  the known variants,  users can specify the  variant database such as 1000 genomes, cosmic, or  Ensembl.</li>
        </ol>
        <h3>Output File</h3>
        <p>DIVAN reports the output is a plain text file. The contents of this depend on the input file format and  whether the variants are known or unknown. The most important fields that are reported in the output files are: the field containing the score  and the percentile. The score informs  the association  between the given disease and variants while  the percentile value indicates percentile of the score. </p>
        <p>The output format using a list of known SNPs as input file:</p>
        <ol type={"A"}>
          <li>
            <p>When users provide a list of known variants, the output will consists of 5 fields, which are:</p>
            <ol>
              <li>variant </li>
              <li>score </li>
              <li>chr (chromosome) </li>
              <li>pos (variant position) </li>
              <li>percentile </li>
            </ol>
          </li>
          <li>
            <p>When users provide a file containing a genomic regions of known variants, the output will consists of 7 fields, which are:</p>
            <ol>
              <li>chr (chromosome)</li>
              <li>start</li>
              <li>start</li>
              <li>end</li>
              <li>variantID</li>
              <li>pos (variant position)</li>
              <li>score</li>
              <li>percentile</li>
            </ol>
          </li>
          <li>
            <p>When users provide  a file containing a genomic regions of unknown variants, the output will consists of 6 fields, which are:</p>
            <ol>
              <li>chr (chromosome)</li>
              <li>start</li>
              <li>start</li>
              <li>end</li>
              <li>score.mean</li>
              <li>score.sd</li>
              <li>percentile</li>
            </ol>
          </li>
        </ol>
      </Paper>
    </div>
  );
};

export default DivanHome;
