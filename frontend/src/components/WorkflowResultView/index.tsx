import React, { useEffect, useState } from "react";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { RouteComponentProps } from "react-router-dom";
import classes from "../utility/result_view.module.scss";
import mainClasses from "./index.module.scss";
import {
  CreateInfoSection,
  createJobFailedReason,
  createJobStatus,
} from "../utility/general";
import { Button, CircularProgress } from "@material-ui/core";
import pgwasAxios from "../../axios-fetches";
import { GetAppRounded } from "@material-ui/icons";
import LDClumpCustom from "./LDClump";
import ColocResult from "./ColocResult";
import PathwayBasedResult from "./PathwayBasedResult";
import GeneBasedResult from "./GeneBased";
import EqtlSmrResult from "./EqtlSmrResult";
import DeletResults from "./DeleteResults";
import AnnotResults from "./AnnotResults";
import RegulationResults from "./RegulationResults";
import HaploR from "../Regulation/ResultView/HaploR";

type Props = {};

type JobParam = {
  jobId: string;
};

export type CustomResult = {
  _id: string;
  jobUID: string;
  job_name: string;
  inputFile: string;
  status: string;
  failed_reason: string;
  longJob: boolean;
  clump_ResultsFile: string;
  coloc_ResultsFile: string;
  pascal_geneScoresFile: string;
  pascal_pathwaySetFile: string;
  pascal_fusionGenesFile: string;
  emagma_genes_out: string;
  emagma_manhattan_plot: string;
  emagma_tissue_genes_out: string;
  smr_cageSMRFile: string;
  smr_cageTransFile: string;
  smr_cageMultiFile: string;
  smr_cageSMRManhattanPlot: string;
  smr_cageMultiManhattanPlot: string;
  smr_tissueSMRFile: string;
  smr_tissueTransFile: string;
  smr_tissueMultiFile: string;
  smr_tissueSMRManhattanPlot: string;
  smr_tissueMultiManhattanPlot: string;
  smr_westraSMRFile: string;
  smr_westraTransFile: string;
  smr_westraMultiFile: string;
  smr_westraSMRManhattanPlot: string;
  smr_westraMultiManhattanPlot: string;
  delet_outputFile: string;
  delet_exon_plot: string;
  annot_outputFile: string;
  annot_disgenet: string;
  annot_snp_plot: string;
  annot_exon_plot: string;
  haplor_ResultsFile: string;
  version: number;
  completionTime: Date;
  [key: string]: any;
  spgwas_params: {
    [key: string]: any;
    marker_name: number;
    chr: number;
    position: number;
    effect_allele: number;
    alternate_allele: number;
    maf: number;
    beta: number;
    standard_error: number;
    pvalue: number;
    sample_size: number;
    population: string;
    clump_p1: number;
    clump_p2: number;
    clump_r2: number;
    clump_kb: number;
    clump_allow_overlap: string;
    clump_use_gene_region_file: string;
    clump_range: string;
    clump_range_border: number;
    coloc_type: string;
    coloc_s: number;
    coloc_p1: number;
    pascal_runpathway: string;
    pascal_chr: string;
    pascal_genesetfile: string;
    pascal_pvalue_cutoff: number;
    pascal_up: number;
    pascal_down: number;
    pascal_maxsnp: number;
    pascal_genescoring: string;
    pascal_mergedistance: number;
    pascal_mafcutoff: number;
    emagma_synonym: string;
    emagma_up_window: number;
    emagma_down_window: number;
    emagma_tissues: string;
    smr_heidi: string;
    smr_trans: string;
    smr_smr_multi: string;
    smr_maf: number;
    smr_diff_freq: number;
    smr_diff_freq_prop: number;
    smr_cis_wind: number;
    smr_peqtl_smr: number;
    smr_ld_upper_limit: number;
    smr_ld_lower_limit: number;
    smr_peqtl_heidi: number;
    smr_heidi_mtd: number;
    smr_heidi_min_m: number;
    smr_heidi_max_m: number;
    smr_trans_wind: number;
    smr_set_wind: number;
    smr_ld_multi_snp: number;
    smr_westra_eqtl: string;
    smr_cage_eqtl: string;
    smr_gtex_tissue: string;
    annot_gene_db: string;
    annot_cytoband: string;
    annot_all: string;
    annot_afr: string;
    annot_amr: string;
    annot_eas: string;
    annot_eur: string;
    annot_sas: string;
    annot_exac: string;
    annot_disgenet: string;
    annot_clinvar: string;
    annot_intervar: string;
    haplor_ld_threshold: number;
    haplor_epi: string;
    haplor_cons: string;
    haplor_genetypes: string;
  };
};

const WorkflowResultView: React.FC<Props & RouteComponentProps<JobParam>> = (
  props
) => {
  const { user } = useTypedSelector((state) => state.auth);

  let apiPath = "";
  if (user?.username) {
    apiPath = "spgwas";
  } else {
    apiPath = "spgwas/noauth";
  }

  const { jobId: id } = props.match.params;

  const [customResult, setCustomResult] = useState<CustomResult | undefined>(
    undefined
  );

  const [errorInfo, setErrorInfo] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const createChartSection = () => {
    if (customResult && customResult.status === "completed") {
      const manhattan = (
        <div className={classes.image_tab}>
          <h3>Manhattan Plot</h3>
          <div className={classes.image_box}>
            <img
              src={`/results${customResult.emagma_manhattan_plot}`}
              alt="manhattan plot"
            />
          </div>
        </div>
      );

      const snps = (
        <div className={classes.image_tab}>
          <h3>SNP Location Overview</h3>
          <div className={classes.image_box}>
            <img
              src={`/results${customResult.annot_snp_plot}`}
              alt="snp plot"
            />
          </div>
        </div>
      );

      return (
        <div className={classes.chart_section}>
          <h3 className={classes.sub_heading}>Data Overview</h3>
          <div className={classes.images}>
            {manhattan}
            {snps}
          </div>
        </div>
      );
    }
    return false;
  };

  const showDownloadButton = (download: string, title: string) => {
    if (
      customResult &&
      customResult.status === "completed" &&
      customResult[download]
    ) {
      return (
        <div className={classes.download}>
          <p>
            The table below have been chunked and pruned to allow for proper
            display. Use the buttons below to download the full files.
          </p>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              endIcon={<GetAppRounded />}
              href={`/results${customResult[download]}`}
              target={"_blank"}
              // download={downloadName}
            >
              Download {title} Results
            </Button>
          </div>
        </div>
      );
    }
    return false;
  };

  //Get status object
  useEffect(() => {
    setLoading(true);
    pgwasAxios
      .get<CustomResult>(`/${apiPath}/jobs/${id}`)
      .then((result) => {
        // console.log(result.data);
        setCustomResult(result.data);
        setLoading(false);
        setError(false);
      })
      .catch((e) => {
        console.dir(e);
        setCustomResult(undefined);
        setLoading(false);
        setError(true);
        if (e.response.status === 503) {
          setErrorInfo("Service not available");
        } else if (e.response.data.message) {
          setErrorInfo(e.response.data.message);
        } else {
          setErrorInfo("Service not available");
        }
      });
  }, [apiPath, id]);

  return (
    <div className={[classes.result_view, mainClasses.main_view].join(" ")}>
      <div className={mainClasses.result_view_container}>
        {loading ? <CircularProgress /> : null}
        {error && (
          <div className={classes.error_message}>
            <p>Issue with fetching job with id: {id}</p>
            <p>Message from server: {errorInfo}</p>
          </div>
        )}
        {createJobStatus(customResult, 60, classes)}
        {customResult && customResult.status === "completed" && (
          <h2 style={{ marginBottom: "2rem" }}>
            Results for Job: {customResult ? customResult.job_name : id}
          </h2>
        )}
        <CreateInfoSection
          resultObj={customResult}
          params={"spgwas_params"}
          classes={classes}
        />
        {createJobFailedReason(customResult, classes)}
        {createChartSection()}
        <LDClumpCustom
          customResult={customResult}
          apiPath={apiPath}
          jobId={id}
          classes={classes}
          showDownloadButton={showDownloadButton}
        />
        <ColocResult
          customResult={customResult}
          apiPath={apiPath}
          jobId={id}
          classes={classes}
          showDownloadButton={showDownloadButton}
        />
        <PathwayBasedResult
          customResult={customResult}
          apiPath={apiPath}
          jobId={id}
          classes={classes}
        />
        <GeneBasedResult
          customResult={customResult}
          apiPath={apiPath}
          jobId={id}
          classes={classes}
        />
        {customResult?.spgwas_params?.smr_cage_eqtl === "true" && (
          <EqtlSmrResult
            customResult={customResult}
            apiPath={apiPath}
            dataset={"Cage"}
            jobId={id}
            classes={classes}
          />
        )}
        {customResult?.spgwas_params?.smr_westra_eqtl === "true" && (
          <EqtlSmrResult
            customResult={customResult}
            apiPath={apiPath}
            dataset={"Westra"}
            jobId={id}
            classes={classes}
          />
        )}
        {customResult?.spgwas_params?.smr_gtex_tissue && (
          <EqtlSmrResult
            customResult={customResult}
            apiPath={apiPath}
            dataset={"Tissue"}
            jobId={id}
            classes={classes}
            tissueName={customResult?.spgwas_params?.smr_gtex_tissue}
          />
        )}
        <DeletResults
          customResult={customResult}
          apiPath={apiPath}
          jobId={id}
          classes={classes}
        />
        <AnnotResults
          customResult={customResult}
          apiPath={apiPath}
          jobId={id}
          classes={classes}
        />
        {customResult &&
          customResult.status === "completed" &&
          (customResult.haplor_ResultsFile ? (
            <HaploR
              resultObj={customResult}
              apiPath={apiPath}
              jobId={id}
              file_key={"haplor_ResultsFile"}
              classes={classes}
            />
          ) : (
            <RegulationResults />
          ))}
      </div>
    </div>
  );
};

export default WorkflowResultView;
