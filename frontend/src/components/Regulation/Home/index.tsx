import React from "react";
import { Paper } from "@material-ui/core";
import classes from "./index.module.scss";
type Props = {};

const RegHaploRHome: React.FC<Props> = (props) => {
  return (
    <div className={classes.haplor}>
      <Paper variant={"outlined"} elevation={3} className={classes.paper}>
        <p>
          This pipeline aims to annotate variants based on HaploReg and
          RegulomeDB using the HaploR R package. HaploReg
          (https://pubs.broadinstitute.org/mammals/haploreg/haploreg.php) is
          used mainly to annotate variants on noncoding regions on the genome,
          while RegulomeDB (https://regulomedb.org/regulome-help/) to annotate
          variants that are located on the intergenic regions on the genome with
          known or predicted regulatory function.
        </p>
        <h3>Input Format</h3>
        <ol>
          <li>
            To query HaploReg database users should provide a file containing
            variants’ information as rsids on its first field.
          </li>
          <li>
            To query RegulomeDB database users should provide a single rsid of a
            variant.
          </li>
        </ol>
        <h3>User options</h3>
        <p>
          There are several options users need to specify to successfully query
          these HaploReg and RegulomeDB. To query HaploReg database users should
          set the following parameters:
        </p>
        <ol>
          <li>LD threshold (ldThresh)</li>
          <li>
            The population from which the variants were obtained (ldPop) to be
            used for LD calculation. These populations are based on 1000G Phase
            1 populations. There are four options for this parameter, which are:
            AFR for Africans ancestries, AMR for Americans ancestries, ASN for
            Asians ancestries, and EUR for European ancestries.
          </li>
          <li>
            Source of the epigenome (epi). There four possible values for this
            parameter which are vanilla for querying ChromHMM (Core 15-state
            model), imputed for querying ChromHMM (25-state model using 12
            imputed marks), amd methyl for querying H3K4me1/H3K4me3 peaks and
            acetyl for querying H3K27ac/H3K9ac peaks.
          </li>
          <li>
            Mammalian conservation algorithm to be used (cons). There are three
            possible values for this parameter which are: gerp for GERP
            algorithm, siphy for SiPhy-omega algorithm, and both to use both
            algorithms.
          </li>
          <li>
            The genomic coordinates for querying (genetypes). There are possible
            values for this parameter, which are gencode for using Gencode genes
            coordinates and refseq for using RefSeq genes coordinates.{" "}
          </li>
          <li>
            To query RegulomeDB database users should set only one parameter
            which is genomeAssembly that has two possible values, which are
            GRCh37 or GRCh38.
          </li>
        </ol>
        <h3>Output files</h3>
        <h3>HaploReg</h3>
        <p>
          The output of querying HaploReg database will be reported in two
          files: 1- The results of the annaoted variants, 2- A file containg the
          variants that are not annotated . The results of the annaoted variants
          is plain tab delimited text file containing the following 35 fields:
        </p>
        <ul>
          <li>Chr: to indicate variant’s chromosome number.</li>
          <li>
            pos_hg38: to indicate variant’s genomic position on the human genome
            based hg38 NCBI build.
          </li>
          <li>r2: Linkage disequilibrium.</li>
          <li>D’: Linkage disequilibrium as dprime.</li>
          <li>
            is_query_snp: to indicate whether the SNP is quired or retrieved due
            to its LD with the queried SNP. The value of 0 indicated that the
            SNP is not queried while the value of 1 means the SNP is queried.
          </li>
          <li>rsID: to indicate refSNP ID.</li>
          <li>ref: to indicate the reference allele.</li>
          <li>alt: to indicate the alternative allele.</li>
          <li>AFR: to indicate r2 value calculated for African population.</li>
          <li>AMR: to indicate r2 value calculated for American population.</li>
          <li>ASN: to indicate r2 value calculated for Asian population.</li>
          <li>EUR: to indicate r2 value calculated for European population.</li>
          <li>GERP_cons: to indicate GERP scores.</li>
          <li>SiPhy_cons: to indicate SiPhy scores.</li>
          <li>
            Chromatin_States: Chromatin states: reference epigenome identifiers
            (EID) of chromatin-associated proteins and histone modifications in
            that region.
          </li>
          <li>
            Chromatin_States_Imputed: reference epigenome identifiers (EID) of
            chromatin states based on imputed data.
          </li>
          <li>Chromatin_Marks: Chromatin marks. </li>
          <li>DNAse: to indicate DNAse.</li>
          <li>Proteins: A list of protein names</li>
          <li>eQTL: Expression Quantitative Trait Loci.</li>
          <li>gwas: GWAS study name.</li>
          <li>grasp: GRASP study name.</li>
          <li>Motifs: Motif names.</li>
          <li>GENCODE_id: GENCODE transcript ID.</li>
          <li>GENCODE_name: GENCODE gene name.</li>
          <li>
            GENCODE_direction: GENCODE direction (transcription toward 3’ or 5’
            end of the DNA sequence).
          </li>
          <li>GENCODE_distance: GENCODE distance</li>
          <li>RefSeq_id: NCBI Reference Sequence Accession number. </li>
          <li>RefSeq_name: NCBI Reference Sequence name.</li>
          <li>
            RefSeq_direction: NCBI Reference Sequence direction (transcription
            toward 3’ or 5’ end of the DNA sequence).
          </li>
          <li>RefSeq_distance: NCBI Reference Sequence distance. </li>
          <li>
            dbSNP_functional_annotation Annotated proteins associated with the
            SNP. Type: numeric.
          </li>
          <li>query_snp_rsid: Query SNP rs ID. </li>
          <li>Promoter_histone_marks: Promoter histone marks. </li>
          <li>Enhancer_histone_marks: Enhancer histone marks.</li>
        </ul>
        <h3>Biological meaning of epigenome identifiers (EID).</h3>
        <p>
          The full biological meaning of epigenome identifiers (EID) can be
          obtained from this article (doi:10.1038/nature14248). The tabl below
          is demonstrating the summary EID.{" "}
        </p>
        <div className={classes.info_table}>
          <table>
            <thead>
              <tr>
                <th>
                  <p>EID</p>
                </th>
                <th>
                  <p>Standardized Epigenome name</p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>E017</p>
                </td>
                <td>
                  <p>IMR90 fetal lung fibroblasts Cell Line</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E002</p>
                </td>
                <td>
                  <p>ES-WA7 Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E008</p>
                </td>
                <td>
                  <p>H9 Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E001</p>
                </td>
                <td>
                  <p>ES-I3 Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E015</p>
                </td>
                <td>
                  <p>HUES6 Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E014</p>
                </td>
                <td>
                  <p>HUES48 Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E016</p>
                </td>
                <td>
                  <p>HUES64 Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E003</p>
                </td>
                <td>
                  <p>H1 Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E024</p>
                </td>
                <td>
                  <p>ES-UCSF4 Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E020</p>
                </td>
                <td>
                  <p>iPS-20b Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E019</p>
                </td>
                <td>
                  <p>iPS-18 Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E018</p>
                </td>
                <td>
                  <p>iPS-15b Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E021</p>
                </td>
                <td>
                  <p>iPS DF 6.9 Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E022</p>
                </td>
                <td>
                  <p>iPS DF 19.11 Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E007</p>
                </td>
                <td>
                  <p>H1 Derived Neuronal Progenitor Cultured Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E009</p>
                </td>
                <td>
                  <p>H9 Derived Neuronal Progenitor Cultured Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E010</p>
                </td>
                <td>
                  <p>H9 Derived Neuron Cultured Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E013</p>
                </td>
                <td>
                  <p>hESC Derived CD56+ Mesoderm Cultured Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E012</p>
                </td>
                <td>
                  <p>hESC Derived CD56+ Ectoderm Cultured Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E011</p>
                </td>
                <td>
                  <p>hESC Derived CD184+ Endoderm Cultured Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E004</p>
                </td>
                <td>
                  <p>H1 BMP4 Derived Mesendoderm Cultured Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E005</p>
                </td>
                <td>
                  <p>H1 BMP4 Derived Trophoblast Cultured Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E006</p>
                </td>
                <td>
                  <p>H1 Derived Mesenchymal Stem Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E062</p>
                </td>
                <td>
                  <p>Primary mononuclear cells from peripheral blood</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E034</p>
                </td>
                <td>
                  <p>Primary T cells from peripheral blood</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E045</p>
                </td>
                <td>
                  <p>
                    Primary T cells effector/memory enriched from peripheral
                    blood
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E033</p>
                </td>
                <td>
                  <p>Primary T cells from cord blood</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E044</p>
                </td>
                <td>
                  <p>Primary T regulatory cells from peripheral blood</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E043</p>
                </td>
                <td>
                  <p>Primary T helper cells from peripheral blood</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E039</p>
                </td>
                <td>
                  <p>Primary T helper naive cells from peripheral blood</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E041</p>
                </td>
                <td>
                  <p>Primary T helper cells PMA-I stimulated</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E042</p>
                </td>
                <td>
                  <p>Primary T helper 17 cells PMA-I stimulated</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E040</p>
                </td>
                <td>
                  <p>Primary T helper memory cells from peripheral blood 1</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E037</p>
                </td>
                <td>
                  <p>Primary T helper memory cells from peripheral blood 2</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E048</p>
                </td>
                <td>
                  <p>Primary T CD8+ memory cells from peripheral blood</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E038</p>
                </td>
                <td>
                  <p>Primary T helper naive cells from peripheral blood</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E047</p>
                </td>
                <td>
                  <p>Primary T CD8+ naive cells from peripheral blood</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E029</p>
                </td>
                <td>
                  <p>Primary monocytes from peripheral blood</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E031</p>
                </td>
                <td>
                  <p>Primary B cells from cord blood</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E035</p>
                </td>
                <td>
                  <p>Primary hematopoietic stem cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E051</p>
                </td>
                <td>
                  <p>Primary hematopoietic stem cells G-CSF-mobilized Male</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E050</p>
                </td>
                <td>
                  <p>Primary hematopoietic stem cells G-CSF-mobilized Female</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E036</p>
                </td>
                <td>
                  <p>Primary hematopoietic stem cells short term culture</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E032</p>
                </td>
                <td>
                  <p>Primary B cells from peripheral blood</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E046</p>
                </td>
                <td>
                  <p>Primary Natural Killer cells from peripheral blood</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E030</p>
                </td>
                <td>
                  <p>Primary neutrophils from peripheral blood</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E026</p>
                </td>
                <td>
                  <p>Bone Marrow Derived Cultured Mesenchymal Stem Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E049</p>
                </td>
                <td>
                  <p>
                    Mesenchymal Stem Cell Derived Chondrocyte Cultured Cells
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E025</p>
                </td>
                <td>
                  <p>Adipose Derived Mesenchymal Stem Cell Cultured Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E023</p>
                </td>
                <td>
                  <p>Mesenchymal Stem Cell Derived Adipocyte Cultured Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E052</p>
                </td>
                <td>
                  <p>Muscle Satellite Cultured Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E055</p>
                </td>
                <td>
                  <p>Foreskin Fibroblast Primary Cells skin01</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E056</p>
                </td>
                <td>
                  <p>Foreskin Fibroblast Primary Cells skin02</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E059</p>
                </td>
                <td>
                  <p>Foreskin Melanocyte Primary Cells skin01</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E061</p>
                </td>
                <td>
                  <p>Foreskin Melanocyte Primary Cells skin03</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E057</p>
                </td>
                <td>
                  <p>Foreskin Keratinocyte Primary Cells skin02</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E058</p>
                </td>
                <td>
                  <p>Foreskin Keratinocyte Primary Cells skin03</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E028</p>
                </td>
                <td>
                  <p>Breast variant Human Mammary Epithelial Cells (vHMEC)</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E027</p>
                </td>
                <td>
                  <p>Breast Myoepithelial Primary Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E054</p>
                </td>
                <td>
                  <p>Ganglion Eminence derived primary cultured neurospheres</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E053</p>
                </td>
                <td>
                  <p>Cortex derived primary cultured neurospheres</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E112</p>
                </td>
                <td>
                  <p>Thymus</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E093</p>
                </td>
                <td>
                  <p>Fetal Thymus</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E071</p>
                </td>
                <td>
                  <p>Brain Hippocampus Middle</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E074</p>
                </td>
                <td>
                  <p>Brain Substantia Nigra</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E068</p>
                </td>
                <td>
                  <p>Brain Anterior Caudate</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E069</p>
                </td>
                <td>
                  <p>Brain Cingulate Gyrus</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E072</p>
                </td>
                <td>
                  <p>Brain Inferior Temporal Lobe</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E067</p>
                </td>
                <td>
                  <p>Brain Angular Gyrus</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E073</p>
                </td>
                <td>
                  <p>Brain_Dorsolateral_Prefrontal_Cortex</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E070</p>
                </td>
                <td>
                  <p>Brain Germinal Matrix</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E082</p>
                </td>
                <td>
                  <p>Fetal Brain Female</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E081</p>
                </td>
                <td>
                  <p>Fetal Brain Male</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E063</p>
                </td>
                <td>
                  <p>Adipose Nuclei</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E100</p>
                </td>
                <td>
                  <p>Psoas Muscle</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E108</p>
                </td>
                <td>
                  <p>Skeletal Muscle Female</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E107</p>
                </td>
                <td>
                  <p>Skeletal Muscle Male</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E089</p>
                </td>
                <td>
                  <p>Fetal Muscle Trunk</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E090</p>
                </td>
                <td>
                  <p>Fetal Muscle Leg</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E083</p>
                </td>
                <td>
                  <p>Fetal Heart</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E104</p>
                </td>
                <td>
                  <p>Right Atrium</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E095</p>
                </td>
                <td>
                  <p>Left Ventricle</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E105</p>
                </td>
                <td>
                  <p>Right Ventricle</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E065</p>
                </td>
                <td>
                  <p>Aorta</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E078</p>
                </td>
                <td>
                  <p>Duodenum Smooth Muscle</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E076</p>
                </td>
                <td>
                  <p>Colon Smooth Muscle</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E103</p>
                </td>
                <td>
                  <p>Rectal Smooth Muscle</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E111</p>
                </td>
                <td>
                  <p>Stomach Smooth Muscle</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E092</p>
                </td>
                <td>
                  <p>Fetal Stomach</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E085</p>
                </td>
                <td>
                  <p>Fetal Intestine Small</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E084</p>
                </td>
                <td>
                  <p>Fetal Intestine Large</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E109</p>
                </td>
                <td>
                  <p>Small Intestine</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E106</p>
                </td>
                <td>
                  <p>Sigmoid Colon</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E075</p>
                </td>
                <td>
                  <p>Colonic Mucosa</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E101</p>
                </td>
                <td>
                  <p>Rectal Mucosa Donor 29</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E102</p>
                </td>
                <td>
                  <p>Rectal Mucosa Donor 31</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E110</p>
                </td>
                <td>
                  <p>Stomach Mucosa</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E077</p>
                </td>
                <td>
                  <p>Duodenum Mucosa</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E079</p>
                </td>
                <td>
                  <p>Esophagus</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E094</p>
                </td>
                <td>
                  <p>Gastric</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E099</p>
                </td>
                <td>
                  <p>Placenta Amnion</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E086</p>
                </td>
                <td>
                  <p>Fetal Kidney</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E088</p>
                </td>
                <td>
                  <p>Fetal Lung</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E097</p>
                </td>
                <td>
                  <p>Ovary</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E087</p>
                </td>
                <td>
                  <p>Pancreatic Islets</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E080</p>
                </td>
                <td>
                  <p>Fetal Adrenal Gland</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E091</p>
                </td>
                <td>
                  <p>Placenta</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E066</p>
                </td>
                <td>
                  <p>Liver</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E098</p>
                </td>
                <td>
                  <p>Pancreas</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E096</p>
                </td>
                <td>
                  <p>Lung</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E113</p>
                </td>
                <td>
                  <p>Spleen</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E114</p>
                </td>
                <td>
                  <p>A549 EtOH 0.02pct Lung Carcinoma Cell Line</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E115</p>
                </td>
                <td>
                  <p>Dnd41 TCell Leukemia Cell Line</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E116</p>
                </td>
                <td>
                  <p>GM12878 Lymphoblastoid Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E117</p>
                </td>
                <td>
                  <p>HeLa-S3 Cervical Carcinoma Cell Line</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E118</p>
                </td>
                <td>
                  <p>HepG2 Hepatocellular Carcinoma Cell Line</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E119</p>
                </td>
                <td>
                  <p>HMEC Mammary Epithelial Primary Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E120</p>
                </td>
                <td>
                  <p>HSMM Skeletal Muscle Myoblasts Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E121</p>
                </td>
                <td>
                  <p>HSMM cell derived Skeletal Muscle Myotubes Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E122</p>
                </td>
                <td>
                  <p>HUVEC Umbilical Vein Endothelial Primary Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E123</p>
                </td>
                <td>
                  <p>K562 Leukemia Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E124</p>
                </td>
                <td>
                  <p>Monocytes-CD14+ RO01746 Primary Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E125</p>
                </td>
                <td>
                  <p>NH-A Astrocytes Primary Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E126</p>
                </td>
                <td>
                  <p>NHDF-Ad Adult Dermal Fibroblast Primary Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E127</p>
                </td>
                <td>
                  <p>NHEK-Epidermal Keratinocyte Primary Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E128</p>
                </td>
                <td>
                  <p>NHLF Lung Fibroblast Primary Cells</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>E129</p>
                </td>
                <td>
                  <p>Osteoblast Primary Cells</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Paper>
    </div>
  );
};

export default RegHaploRHome;
