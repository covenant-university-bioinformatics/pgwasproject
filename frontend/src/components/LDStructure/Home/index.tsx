import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const LDStructureHome: React.FC<Props> = (props) => {
  return (
    <div className={classes.ldstructure}>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          This tool aims to Linkage Disequilibrium (LD) information between
          particular SNPs and to perform clumping of GWAS summary files. Users
          can perform their analysis based on three options:
        </p>
        <ol>
          <li>
            Perform pairwise LD calculation of two SNPs based on a particular
            population.{" "}
          </li>
          <li>
            Perform LD calculation of a given SNPs and all other SNPs based on a
            particular population.{" "}
          </li>
          <li>Perform SNPs clumping based on a particular population.</li>
        </ol>
        <h3>Pairwise LD calculation of two SNPs</h3>
        <h3>Input options</h3>
        <ol>
          <li>
            Population users should specify the population to calculate LD.
            Users can choose one of five 1000 genomes super populations, which
            are African (afr), American (amr), European (eur), East Asian (eas),
            and South Asian (sas).{" "}
          </li>
          <li>Users should specify a pair of SNPs to calculate their LD.</li>
        </ol>
        <h3>Output</h3>
        <p>
          The output is a plain text file containing LD information for SNPs as
          the square of the correlation coefficient between these two SNPs (r
          square) and the scaled coefficient of linkage disequilibrium between
          these two SNPs (D prime).
        </p>
        <h3>LD calculation of a given SNPs and all other SNPs</h3>
        <h3>Input options</h3>
        <ol>
          <li>
            Population users should specify the population to calculate LD.
            Users can choose one of five 1000 genomes super populations, which
            are African (afr), American (amr), European (eur), East Asian (eas),
            and South Asian (sas).
          </li>
          <li>
            Users should specify a SNPs to calculate its LD with other SNPs
          </li>
          <li>
            Maximum kilobase distance between reported SNP which specifies the
            window in which to compare snps(ld_window_kb)
          </li>
          <li>
            Maximum site count between reported variant pairs (ld_window). We
            recommend a value higher than 999.
          </li>
          <li>A threshold value for r-squared (ld_window_r2).</li>
        </ol>
        <h3>Output</h3>
        <p>
          The output is a plain text file containing LD information for SNPs as
          the square of the correlation coefficient (r square) and the scaled
          coefficient of linkage disequilibrium (D prime).
        </p>
        <h3>SNPs clumping</h3>
        <p>
          SNPs clumping is performed to remove correlated SNPs in each LD block
          and keep the most significant SNPs.
        </p>
        <h3>Input file</h3>
        <p>
          Users should provide a GWAS summary file with two compulsory field
          which are:
        </p>
        <ul>
          <li>SNPs ids and it name is SNPs</li>
          <li>P Values and its name p.</li>
        </ul>
        <h3>Input options</h3>
        <ol>
          <li>
            Population users should specify the population to calculate LD.
            Users can choose one of five 1000 genomes super populations, which
            are African (afr), American (amr), European (eur), East Asian (eas),
            and South Asian (sas).{" "}
          </li>
          <li>
            A pvalue threshold for a SNP to be included as an index (SNP.
            clump_p1) and its value should be less than or equal to 0.0001. The
            method indexes all SNPs that are significant at threshold of
            clump_p1 then clumps of all other SNPs that are within a certain kb
            distance from the indexed SNPs.
          </li>
          <li>Secondary significance threshold for clumped SNPs (clump_p2)</li>
          <li>LD threshold for clumping (clump_r2)</li>
          <li>Physical distance threshold for clumping (clump_kb)</li>
          <li>
            Users should specify if overlapping will be allowed (allow_overlap)
          </li>
          <li>
            Users can specify to use annotated genes range
            (use_gene_region_file)
          </li>
          <li>
            Users can specify gene ranges (clump_range) as glist-hg19 or
            glist-hg38.
          </li>
          <li>
            A window around gene bounds (clump_range_border) in kilobases. The
            default value is 0
          </li>
        </ol>
        <h3>Output</h3>
        <p>
          The output is plain text file contains with 11 fields with following
          header
        </p>
        <ol>
          <li>CHR: indicating SNPs chromosome.</li>
          <li>
            F: This field will contain 1 indicating that there was one fileset.
            If users run the tool offline and use several GWAS summary then this
            field is used as a code for filesets.
          </li>
          <li>SNP: indicating SNP identifier.</li>
          <li>BP: indicating SNPs physical position.</li>
          <li>TOTAL: indicating total number of clumped SNPs</li>
          <li>
            NSIG: indicating number of non significant clumped SNPs (p &gt;
            0.05)
          </li>
          <li>
            S05: indicating the number of clumped SNPs 0.01 &lt; p &lt; 0.05{" "}
          </li>
          <li>
            S01: indicating the number of clumped SNPs 0.001 &lt; p &lt; 0.01
          </li>
          <li>
            S001: indicating the number of clumped SNPs 0.0001 &lt; p &lt; 0.001
          </li>
          <li>S0001: indicating the number of clumped SNPs p &lt; 0.0001</li>
          <li>
            SP2: field will contain SNPs names of the significant clumped SNPs.
          </li>
        </ol>
      </Paper>
    </div>
  );
};

export default LDStructureHome;
