import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";

type Props = {};

const Loci2PathHome: React.FC<Props> = (props) => {
  return (
    <div className={classes.loci2path}>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          The aim of this pipeline is to perform regulatory annotation of
          genomic intervals based on tissue-specific expression QTLs. We use the
          loci2path bioconductor R package in this pipeline
          (https://bioconductor.org/packages/devel/bioc/html/loci2path.html).
          The QTL data are generated for 45 different diseases/traits using
          Genotype-Tissue Expression (GTEx) data set version 6p (GTEx v6p).
        </p>
        <h3>Input</h3>
        <p>
          This tool accepts input files in bed format with three columns: "chr",
          "start", and "end". An example of the contents of such input file
          format is given below
        </p>
        <ul>
          <li>chr start end</li>
          <li>chr1 8200690 8306031</li>
          <li>chr1 152536784 152785813</li>
          <li>chr1 24461438 24527816</li>
          <li>chr1 67594559 67767993</li>
          <li>chr1 25224957 25308276</li>
          <li>chr2 62483421 62648023</li>
          <li>chr2 162993491 163392761</li>
          <li>chr2 60921168 61798829</li>
          <li>chr5 131783213 132135372</li>
          <li>chr5 150415338 150490124</li>
        </ul>
        <h3>Input options</h3>
        <p>
          The only one parameters that sers should specify in this pipeline is
          to choose from the list below
        </p>
        <ol>
          <li>Adipose_Subcutaneous</li>
          <li>Adipose_Visceral_Omentum</li>
          <li>Adrenal_Gland</li>
          <li>Artery_Aorta</li>
          <li>Artery_Coronary</li>
          <li>Artery_Tibial</li>
          <li>Brain_Anterior_cingulate_cortex_BA24</li>
          <li>Brain_Caudate_basal_ganglia</li>
          <li>Brain_Cerebellar_Hemisphere</li>
          <li>Brain_Cerebellum</li>
          <li>Brain_Cortex</li>
          <li>Brain_Frontal_Cortex_BA9</li>
          <li>Brain_Hippocampus</li>
          <li>Brain_Hypothalamus</li>
          <li>Brain_Nucleus_accumbens_basal_ganglia</li>
          <li>Brain_Putamen_basal_ganglia</li>
          <li>Breast_Mammary_Tissue</li>
          <li>Cells_EBV-transformed_lymphocytes</li>
          <li>Cells_Transformed_fibroblasts</li>
          <li>Colon_Sigmoid</li>
          <li>Colon_Transverse</li>
          <li>Esophagus_Gastroesophageal_Junction</li>
          <li>Esophagus_Mucosa</li>
          <li>Esophagus_Muscularis</li>
          <li>Heart_Atrial_Appendage</li>
          <li>Heart_Left_Ventricle</li>
          <li>Liver</li>
          <li>Lung</li>
          <li>Muscle_Skeletal</li>
          <li>Nerve_Tibial</li>
          <li>Ovary</li>
          <li>Pancreas</li>
          <li>Pituitary</li>
          <li>Prostate</li>
          <li>Skin_Not_Sun_Exposed_Suprapubic</li>
          <li>Skin_Sun_Exposed_Lower_leg</li>
          <li>Small_Intestine_Terminal_Ileum</li>
          <li>Spleen</li>
          <li>Stomach</li>
          <li>Testis</li>
          <li>Thyroid</li>
          <li>Uterus</li>
          <li>Vagina</li>
          <li>Whole_Blood</li>
        </ol>
        <h3>Output File</h3>
        <p>
          Loci2Path reports the output is a plain text file. The output
          contentains 14 fields with the following header name:
        </p>
        <ol>
          <li>name_pthw; contains name of the pathway</li>
          <li>
            eQTL_pthw; contains number of eQTLs that are associated with a
            member gene from this pathway
          </li>
          <li>
            eQTL_total; contains number of total eQTL SNPs (associated with any
            gene) in this tissue
          </li>
          <li>
            eQTL_query; contains number of eQTL SNPs covered by the query
            regions
          </li>
          <li>
            eQTL_pthw_query; contains number of eQTL SNps covered by the query
            regions, and associated with a member gene from this pathway
          </li>
          <li>
            log_ratio; contains Log of the ratio between pathway SNPs and
            background SNPs; only used as a reference to compare with enrichment
            test statistics
          </li>
          <li>pval_lr; contains p-value of likelihood ratio</li>
          <li>
            pval_fisher; contains p-value of fisher exact test, based on number
            of SNPs; only used as a reference to compare with gene-based
            statistics
          </li>
          <li>num_gene_set; contains number of genes in the current pathway</li>
          <li>
            num_gene_query; contains number of genes associated with SNPs
            covered by the query regions
          </li>
          <li>
            num_gene_hit; contains number of genes associated with SNPs covered
            by the query regions AND is a member gene of the current pathway
          </li>
          <li>
            gene_hit; contains Identifier(s) of the hit gene(s), separated by
            “;”
          </li>
          <li>
            log_ratio_gene; contains Log of the ratio between pathway genes and
            background genes; only used as a reference to compare with
            enrichment test statistics
          </li>
          <li>
            pval_fisher_gene; contains p-value of fisher exact test, based on
            number of genes
          </li>
        </ol>
        <p>
          For more information, refer to the original article that introducing
          this tool in this link
          https://academic.oup.com/bioinformatics/article/36/3/690/5555289?login=false
        </p>
      </Paper>
    </div>
  );
};

export default Loci2PathHome;
