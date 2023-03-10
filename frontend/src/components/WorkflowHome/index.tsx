import React from "react";
import customImage from "../../resources/images/spgwas_custom_trans.webp";
import classes from "./index.module.scss";

type Props = {};

const WorkflowHome: React.FC<Props> = (props: Props) => {
  return (
    <div className={classes.custom_home}>
      <div className={classes.container}>
        <h1 className={classes.main_header}>PostGWAS Custom Pipeline</h1>
        <p className={classes.start_text}>
          The aim of this customized pipeline is to run multiple pGWAS tools in
          a single task. This customized pipeline consists of 8 individual pGWA
          pipelines; namely SNPs clumping, Bayesian fine-mapping, pathway-based
          analysis, geneset-based analysis, eQTL analysis, SNPs annotation,
          deleteriousness analysis, and regulatory SNPs annotations. The essence
          of SNPs clumping step is select leads SNPs for the downstream
          analysis, i.e, its output used as input for the other 7 pipelines.
        </p>
        <div className={classes.image_container}>
          <figure>
            <img src={customImage} alt="custom" className={classes.image} />
            <figcaption>Figure 1: PostGWAS custom pipeline</figcaption>
          </figure>
        </div>
        <h3>Input file and general parameter</h3>
        <p>
          The input file is a GWAS summary file with at least 8 fields. The
          required fields are: SNPs IDs (rsid), SNP chromosome (CHR), SNP
          position (BP), Reference allele (A1 or effect_allele), Alternative (A2, Minor or alternate_allele) allele,
          Alternative (Minor) allele frequency (freq), Beta (slope) value
          (beta), Standard error (standard_error), p value (pval_nominal), Sample
          size (n), and Zscore (z). Population users should specify the
          population to calculate LD. Users can choose one of five 1000 genomes
          super populations, which are African (afr), American (amr), European
          (eur), East Asian (eas), and South Asian (sas).
        </p>
        <h3>Parameters for SNPs clumping</h3>
        <p>
          The customized pipeline uses PLINK tool to perform SNPs clumping to
          identify lead SNPs. Users can set values for following parameters:
        </p>
        <ol>
          <li>
            A p value threshold for a SNP to be included as an index (SNP.
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
            glist-hg38
          </li>
          <li>
            A window around gene bounds (clump_range_border) in kilobases. The
            default value is 0
          </li>
        </ol>
        <h3>Parameters for Colocalization</h3>
        <p>
          The customized pipeline uses the coloc R package (Colocalisation Tests
          of Two Genetic Traits) to perform Bayesian fine-mapping analysis of
          the lead SNPs. Users can set values for the following parameters:
        </p>
        <ol type={"1"}>
          <li>
            p1, this parameter specifies the prior probability a SNP is
            associated with the trait. Before performing Bayesian fine-mapping,
            we normalize the value of p1 by the total SNPs number.
          </li>
          <li>
            type, this parameter specifies the type of trait in the GWAS summary
            such as case-control or quantitative.
          </li>
          <li>
            s, this parameter is required for a case-control GWAS summary
            dataset and it indicates the proportion of samples in the GWAS
            summary that are cases.
          </li>
        </ol>
        <h3>Parameters for Pathway-based pGWAS analysis</h3>
        <p>
          The customized pipeline uses PASCAL pGWAStool to perform pathway based
          analysis using the lead SNPs. Users can set values for the following
          parameters:
        </p>
        <ol type={"1"}>
          <li>
            A parameter to perform pathways analysis (runpathway). This
            parameter has two options: on, and off. If a user sets it to be off
            then this pipeline will just perform gene set based analysis.
          </li>
          <li>
            The chromosome to be used to perform the analysis. Users can choose
            values between 1-22 to a single chromosome analysis. Also, users can
            set its value for ‘all’ to perform the analysis on all autosomal
            chromosomes.
          </li>
          <li>
            p-value cutoff to report the statistically significant genes and
            pathways. The default value is 0.05.
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
            algorithm.{" "}
          </li>
          <li>genomic distance in mega-bases.</li>
          <li>
            The minor allele frequency cutoff value (between 0 and 1). The
            default value is 0.05
          </li>
          <li>
            Geneset file where users can choose the database for the pathway
            analysis either as msigdb.v4.0.entrez or KEGG_REACTOME data set.
          </li>
        </ol>
        <h3>Parameters for Geneset-based pGWAS analysis</h3>
        <p>
          The customized pipeline uses MAGMA pGWAS tool to perform geneset-based
          analysis using the lead SNPs. Users can set values for the following
          parameters:
        </p>
        <ol type={"1"}>
          <li>
            The option that indicates how to deal with synonymous SNP IDs
            (synonym). The values for this option are:
            <ol type={"a"}>
              <li>
                No, to suppress automatically loading data for synonymous SNP ID
                this option will speed up the process
              </li>
              <li>
                Drop, SNPs that have multiple synonyms in the data will be
                removed from the analysis
              </li>
              <li>
                Drop-dup, for each synonym entry only the first listed in the
                synonym file is retained;
              </li>
              <li>
                Skip, the SNPs are left in the data and the synonym entry in the
                synonym file is skipped.
              </li>
              <li>
                Skip-dup, the genotype data for all synonymous SNPs is retained.
              </li>
            </ol>
          </li>
          <li>
            A value upstream annotation window around genes in kb. The default
            value is 0.
          </li>
          <li>
            A value downstream annotation window around genes in kb. The default
            value is 0.
          </li>
          <li>The tissue to calculate tissue-specific gene set analysis.</li>
        </ol>
        <h3>Parameters for eQTL analysis</h3>
        <p>
          The customized pipeline uses{" "}
          <a href="https://yanglab.westlake.edu.cn/software/smr/">SMR tool</a>{" "}
          to perform eQTL analysis based on two methods: SMR or HEIDI analysis.
          There are three types of analysis, which are:{" "}
        </p>
        <ol type={"1"}>
          <li>
            SMR <br />
            This helps to identify cis and trans eqtls in the summary
            staticstics. It mainly helps to identify genes whose expression
            levels are associated with the phenotype due to pleiotropy. The SMR
            p-value denotes this. The significance level is 8.4 * 10^-6 In the
            output file “.smr” we have the probe_id, probe_chr, gene name, gene
            base position, and the top eqtl SNP close to the position. The HEIDI
            p-value shows if the association is due to linkage or pleiotropy. A
            p-value less than 0.05 shows association is due to pleiotropy.
          </li>
          <li>
            Trans SMR <br />
            This helps to identify cis and trans eqtls in the summary
            staticstics. It mainly helps to identify genes whose expression
            levels are associated with the phenotype due to pleiotropy. The SMR
            p-value denotes this. The significance level is 8.4 * 10^-6 In the
            output file “.smr” we have the probe_id, probe_chr, gene name, gene
            base position, and the top eqtl SNP close to the position. The HEIDI
            p-value shows if the association is due to linkage or pleiotropy. A
            p-value less than 0.05 shows association is due to pleiotropy.
          </li>
          <li>
            Multi SMR <br />
            Multi SMR method tests the association of all SNPs in a given region
            that have passed the p-value cutoff and are not in very high LD.
          </li>
        </ol>
        <p>
          To run this pipeline, users can set values for the following
          parameters:
        </p>
        <ol type={"I"}>
          <li>
            General Parameters
            <ol type={"1"}>
              <li>
                The minor allele frequency (maf) cutoff value. The default value
                of this parameter is 0.05
              </li>
              <li>
                A threshold value for allele frequency quality control
                (diff_freq). The default value is 0.2.
              </li>
              <li>
                A threshold value for the maximum proportion of variants
                (diff_freq_prop) that can vary in the population. The default
                value is 0.05.
              </li>
              <li>
                A value of a window arround cis-eQTLs signal (cis_wind). The
                default value is 2000 Kb.
              </li>
              <li>
                A cutoff for SMR test pvalue (peqtl_smr). The default value is
                5.0e-8.
              </li>
              <li>
                The upper limit value for R-square value to prune SNPs
                (ld_upper_limit). The default value is 0.9
              </li>
              <li>
                The lower limit value for R-square value to prune SNPs
                (ld_lower_limit). The default value is 0.05.
              </li>
              <li>
                eQTL file where users can choose Westra or CAGE eqtl. Also users
                can shoes a tissue for for Gtex v.8
              </li>
            </ol>
          </li>
          <li>
            Heidi Parameters
            <p>
              If users choose to run Heidi test besides SMR, they set the below
              parameters
            </p>
            <ol type={"1"}>
              <li>
                A cutoff for Heidi test p value (peqtl_heidi). The default value
                is 1.57e-3.
              </li>
              <li>
                HEIDI test method (heidi_mtd) where 0 indicates the original
                HEIDI method and the value of 1 indicates the new HEIDI
                method.The default value is 1.
              </li>
              <li>
                The minimum of f cis-SNPs to perfom Heidi test (heidi_min_m).
                The default value is 3.
              </li>
              <li>
                The maximum number of eQTLs to be used for Heidi test
                (heidi_max_m). The default value is 20.
              </li>
            </ol>
          </li>
          <li>
            Parameters for trans SMR analysis (SMR test for trans regions)
            <p>
              If users chose to run a trans SMR test then users can specify a
              value for trans window size (trans_wind). The default value is
              1000 Kb.
            </p>
          </li>
          <li>
            {" "}
            Parameters for Multi-SNP-based SMR test
            <p>
              If users chose to run a Multi-SNPs SMR test then users can specify
              the following parameters:
            </p>
            <ol type={"1"}>
              <li>
                A value for a window size in Kb to select SNPs in the cis-region
                (set_wind). The default value is -9 which resulting in selecting
                SNPs in the whole cis-region.
              </li>
              <li>
                A cutoff value for R-square value to prune SNPs (ld_multi_snp).
                The default value is 0.1.
              </li>
            </ol>
          </li>
        </ol>
        <h3>Parameters for deleteriousness and annotation analysis</h3>
        <p>
          The customized pipeline uses Annovar tool to perform deleteriousness
          and annotation analysis using the lead SNPs. Users can set values for
          the following parameters:
        </p>
        <ol type={"1"}>
          <li>
            Gene database (GENE_DB); users can choose "ucsc", or "ensembl".
          </li>
          <li>
            Performing Cytoband annotation (CYTOBAND); users can choose "true",
            or "false".
          </li>
          <li>
            Performing analysis using all 1000 genome populations (ALL); users
            can choose "true", or "false".
          </li>
          <li>
            Performing analysis using samples of African ancestries of 1000
            genome populations (AFR); users can choose "true", or "false".
          </li>
          <li>
            Performing analysis using samples of American ancestries of 1000
            genome populations (AMR); users can choose "true", or "false".
          </li>
          <li>
            Performing analysis using samples of East Asian ancestries of 1000
            genome populations (EAS); users can choose "true", or "false".
          </li>
          <li>
            Performing analysis using samples of European ancestries of 1000
            genome populations (EUR); users can choose "true", or "false".
          </li>
          <li>
            Performing analysis using samples of South Asian ancestries of 1000
            genome populations (SAS); users can choose "true", or "false".
          </li>
          <li>
            Performing annotation based on Exome Aggregation Consortium (EXAC);
            users can choose "true", or "false".
          </li>
          <li>
            Performing annotation based on the gene-disease associations
            database (DISGENET); users can choose "true", or "false".
          </li>
          <li>
            Performing annotation based on the clinvar database (CLINVAR); users
            can choose "true", or "false".
          </li>
          <li>
            Performing annotation based on the Clinical Interpretation of
            genetic variants (INTERVAR); users can choose "true", or "false".
          </li>
        </ol>
        <h3>Parameters for regulatory SNPs annotations analysis</h3>
        <p>
          The customized pipeline uses HaploR R package to perform regulatory
          SNPs annotations using the lead SNPs.{" "}
          <a href="https://pubs.broadinstitute.org/mammals/haploreg/haploreg.php">
            HaploReg
          </a>{" "}
          can be used to annotate variants on noncoding regions on the genome.
          Users can set values for the following parameters:
        </p>
        <ol type={"1"}>
          <li>LD threshold (ldThresh)</li>
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
            coordinates and refseq for using RefSeq genes coordinates
          </li>
        </ol>
        <h3>Output Files</h3>
        The customized pipeline reports the following files:
        <h3>SNP Clumping</h3>
        <p>
          The output of the SNPs clumping contains the identified lead SNPs. The
          output file contains 11 fields with following header
        </p>
        <ol type={"1"}>
          <li>CHR; indicating SNPs chromosome.</li>
          <li>
            F; This field will contain 1 indicating that there was one fileset.
            If users run the tool offline and use several GWAS summary then this
            field is used as a code for filesets.
          </li>
          <li>SNP; indicating SNP identifier.</li>
          <li>BP; indicating SNPs physical position.</li>
          <li>TOTAL; indicating total number of clumped SNPs</li>
          <li>
            NSIG; indicating number of non significant clumped SNPs ( p &gt;
            0.05 )
          </li>
          <li>
            S05; indicating the number of clumped SNPs 0.01 &lt; p &lt; 0.05
          </li>
          <li>
            S01; indicating the number of clumped SNPs 0.001 &lt; p &lt; 0.01
          </li>
          <li>
            S001; indicating the number of clumped SNPs 0.0001 &lt; p &lt; 0.001{" "}
          </li>
          <li>S0001; indicating the number of clumped SNPs p p &lt; 0.0001</li>
          <li>
            SP2; field will contain SNPs names of the significant clumped SNPs.
          </li>
        </ol>
        <h3>Basyesian fine-mapping analysis.</h3>
        <p>
          The output of the Bayesian fine-mapping analysis contains the
          identified lead SNP with all fields of the input GWAS summary.
          However, there will be one more field contains the information of the
          probability of each SNPs to be causal, i.e the posterior probability
          that exactly that SNP is causal.
        </p>
        <h3>Pathway-based pGWAS analysis</h3>
        <p>
          The output of the pathway based analysis consists of a file of gene
          score results. In case the users choose to run pathways analysis,
          there will be more two files, which are:
        </p>
        <ul>
          <li>The pathway score results.</li>
          <li>Fusion gene scores results.</li>
        </ul>
        <h3>Geneset-based pGWAS analysis</h3>
        <p>
          The output of the geneset-based analysis consists of a file containing
          12 columns. The header of the output file consist of the following
          column names:
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
        <h3>eQTL analysis</h3>
        <p>
          The output of the eQTL analysis consist of a file contain all the
          information in the input GWAS summary files besides the following
          fields:
        </p>
        <ul>
          <li>ProbeID,</li>
          <li>Probe_Chr,</li>
          <li>Gene,</li>
          <li>b_eQTL (beta value from eQTL)</li>
          <li>se_eQTL (standard error value from eQTL)</li>
          <li>p_eQTL (pvalue from eQTL)</li>
          <li>b_SMR (beta value from SMR)</li>
          <li> se_SMR (standard error value from SMR)</li>
          <li>p_SMR (pvalue from SMR)</li>
          <li>p_HEIDI (pvalue from Heidi)</li>
        </ul>
        <h3>Deleteriousness and annotation analysis</h3>
        <p>
          The output of the Deleteriousness and annotation analysis consist of
          annotations of various resources such as Exome Aggregation Consortium
          (EXAC). Clinvar, and Clinical Interpretation of genetic variants.
          Also, the output provides useful information, such allele frequencies
          and statistics of SNPs type.
        </p>
        <h3>Regulatory SNPs annotations analysis</h3>
        <p>
          The output of querying the HaploReg database will be reporte e
          annotated variants is plain tab delimited text file containing the
          following 35 fields:
        </p>
        <ol>
          <li>Chr: to indicate variant’s chromosome number.</li>
          <li>
            pos_hg38: to indicate variant’s genomic position on the human genome
            based hg38 NCBI build.{" "}
          </li>
          <li>r2: Linkage disequilibrium.</li>
          <li>D’: Linkage disequilibrium as dprime.</li>
          <li>
            is_query_snp: to indicate whether the SNP is queried or retrieved
            due to its LD with the queried SNP. The value of 0 indicates that
            the SNP is not queried while the value of 1 means the SNP is
            queried.
          </li>
          <li>rsID: to indicate refSNP ID.</li>
          <li>ref: to indicate the reference allele.</li>
          <li>alt: to indicate the alternative allele.</li>
          <li>
            AFR: to indicate the r2 value calculated for the African population.
          </li>
          <li>
            AMR: to indicate r2 value calculated for the American population.
          </li>
          <li>ASN: to indicate r2 value calculated for Asian population.</li>
          <li>
            EUR: to indicate the r2 value calculated for the European
            population.
          </li>
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
          <li>Chromatin_Marks: Chromatin marks.</li>
          <li>DNAse: to indicate DNAse.</li>
          <li>Proteins: A list of protein names.</li>
          <li>eQTL: Expression Quantitative Trait Loci.</li>
          <li>gwas: GWAS study name.</li>
          <li>grasp: GRASP study name.</li>
          <li>Motifs: Motif names.</li>
          <li>GENCODE_id: GENCODE transcript ID</li>
          <li>GENCODE_name: GENCODE gene name.</li>
          <li>
            GENCODE_direction: GENCODE direction (transcription toward 3’ or 5’
            end of the DNA sequence).
          </li>
          <li>GENCODE_distance: GENCODE distance.</li>
          <li>RefSeq_id: NCBI Reference Sequence Accession number.</li>
          <li>RefSeq_name: NCBI Reference Sequence name.</li>
          <li>
            RefSeq_direction: NCBI Reference Sequence direction (transcription
            toward 3’ or 5’ end of the DNA sequence).
          </li>
          <li>RefSeq_distance: NCBI Reference Sequence distance.</li>
          <li>
            dbSNP_functional_annotation Annotated proteins associated with the
            SNP. Type: numeric.
          </li>
          <li>query_snp_rsid: Query SNP rs ID.</li>
          <li>Promoter_histone_marks: Promoter histone marks.</li>
          <li>Enhancer_histone_marks: Enhancer histone marks.</li>
        </ol>
      </div>
    </div>
  );
};

export default WorkflowHome;
