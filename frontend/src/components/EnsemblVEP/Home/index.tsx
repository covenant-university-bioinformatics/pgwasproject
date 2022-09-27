import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";

type Props = {};

const EnsemblVEPHome: React.FC<Props> = (props) => {
  return (
    <div className={classes.ensemmblvep}>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          The aim of this pipeline is to perform functional prediction of
          variants using the Combined Annotation Dependent Depletion score
          (CADD). We implented this pipeline using CADD plugin in Ensembl Variant
          Effect Predictor (VEP) version 107(API 107) and the source of
          annotation is based on GRCh37 (hg19).
        </p>
        <h3>Input</h3>
        <p>
          The default format is a simple whitespace-separated format (columns
          may be separated by space or tab characters). This input file is
          without a header line. The input must contains five compulsory columns
          plus one optional identifier column.
        </p>
        <p>The compulsory columns are:</p>
        <ol>
          <li>chromosome - just the name or number, with no 'chr' prefix</li>
          <li>Start</li>
          <li>End</li>
          <li>
            allele - pair of alleles separated by a '/', with the reference
            allele first
          </li>
          <li>strand - defined as + (forward) or - (reverse)</li>
        </ol>
        <p>
          The optional identifier column will be used in VEP's output. If no
          identifier column has been provided, VEP will construct an identifier from
          the given coordinates and alleles.
        </p>
        <h3>Input options</h3>
        <p>No parameter is required by users to run this pipeline.</p>
        <h3>Output file</h3>
        <p>This pipeline reports the output into a plain text files containing the following  19 columns:</p>
        <ol>
          <li>Uploaded_variation : Identifier of uploaded variant</li>
          <li>Location : Location of variant in standard coordinate format (chr:start or chr:start-end)</li>
          <li>Allele : The variant allele used to calculate the consequence</li>
          <li>Gene : Stable ID of affected gene</li>
          <li>Feature : Stable ID of feature</li>
          <li>Feature_type : Type of feature - Transcript, RegulatoryFeature or MotifFeature</li>
          <li>Consequence : Consequence type</li>
          <li>cDNA_position : Relative position of base pair in cDNA sequence</li>
          <li>CDS_position : Relative position of base pair in coding sequence</li>
          <li>Protein_position : Relative position of amino acid in protein</li>
          <li>Amino_acids : Reference and variant amino acids</li>
          <li>Codons : Reference and variant codon sequence</li>
          <li>Existing_variation : Identifier(s) of co-located known variants</li>
          <li>IMPACT : Subjective impact classification of consequence type</li>
          <li>DISTANCE : Shortest distance from variant to transcript</li>
          <li>STRAND : Strand of the feature (1/-1)</li>
          <li>FLAGS : Transcript quality flags</li>
          <li>CADD_PHRED : PHRED-like scaled CADD score</li>
          <li>CADD_RAW : Raw CADD score</li>
        </ol>
      </Paper>
    </div>
  );
};

export default EnsemblVEPHome;
