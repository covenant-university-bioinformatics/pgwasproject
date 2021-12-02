import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import pgwasAxios from "../../../axios-fetches";
import classes from "./index.module.scss";
import useTable from "../../../hooks/useTable";
import {
  Button,
  CircularProgress,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";
import { GetAppRounded } from "@material-ui/icons";
import {
  createJobFailedReason,
  createJobStatus,
  getInfoSection,
} from "../../utility/general";
import { useTypedSelector } from "../../../hooks/useTypedSelector";

type Props = {};
type JobParam = {
  jobId: string;
};

export type PathwayBasedResult = {
  _id: string;
  jobUID: string;
  job_name: string;
  inputFile: string;
  status: string;
  geneScoresFile: string;
  pathwaySetFile: string;
  fusionGenesFile: string;
  failed_reason: string;
  longJob: boolean;
  version: number;
  completionTime: string;
  pathwaybased_params: {
    filename_prefix: string;
    population: string;
    run_pathway: string;
    chr: string;
    gene_set_file: string;
    pvalue_cutoff: string;
    up_window: string;
    down_window: string;
    max_snp: string;
    gene_scoring: string;
    merge_distance: string;
    maf_cutoff: string;
  };
  [key: string]: any;
};

const PathwayBasedResultView: React.FC<Props & RouteComponentProps<JobParam>> =
  (props) => {
    const { user } = useTypedSelector((state) => state.auth);

    let apiPath = "";
    if (user?.username) {
      apiPath = "pathwaybased";
    } else {
      apiPath = "pathwaybased/noauth";
    }

    const reloadLimit = 60;
    const { jobId: id } = props.match.params;

    const [pathwayBasedRes, setPathwayBasedRes] = useState<
      PathwayBasedResult | undefined
    >(undefined);

    const [errorInfo, setErrorInfo] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(0);
    const [seconds, setSeconds] = useState(reloadLimit);
    const timeout = useRef<any>(null);
    let errorMessage: any | null = null;
    let genMessage: any | null = null;

    const [geneScoreResults, setGeneScoreResults] = useState<string[][]>([]);
    const [geneScoreHeader, setGeneScoreHeader] = useState<
      { id: string; label: string; disableSorting: boolean }[]
    >([]);
    const [loadingGeneScoreResults, setLoadingGeneScoreResults] =
      useState(false);

    const {
      TblContainer: GeneScoreTblContainer,
      TblHead: GeneScoreTblHead,
      TblPagination: GeneScoreTblPaginaion,
      recordsAfterPaging: GeneScoreRecordsAfterPaging,
    } = useTable(
      geneScoreResults,
      geneScoreHeader,
      [10, 15, 20],
      geneScoreResults.length
    );

    const [pathwayBasedResults, setPathwayBasedResults] = useState<string[][]>(
      []
    );
    const [pathwayBasedHeader, setPathwayBasedHeader] = useState<
      { id: string; label: string; disableSorting: boolean }[]
    >([]);
    const [loadingPathwayBasedResults, setLoadingPathwayBasedResults] =
      useState(false);

    const {
      TblContainer: PathwayBasedTblContainer,
      TblHead: PathwayBasedTblHead,
      TblPagination: PathwayBasedTblPaginaion,
      recordsAfterPaging: PathwayBasedRecordsAfterPaging,
    } = useTable(
      pathwayBasedResults,
      pathwayBasedHeader,
      [10, 15, 20],
      pathwayBasedResults.length
    );

    const [fusionScoreResults, setFusionScoreResults] = useState<string[][]>(
      []
    );
    const [fusionScoreHeader, setFusionScoreHeader] = useState<
      { id: string; label: string; disableSorting: boolean }[]
    >([]);
    const [loadingFusionScoreResults, setLoadingFusionScoreResults] =
      useState(false);

    const {
      TblContainer: FusionScoreTblContainer,
      TblHead: FusionScoreTblHead,
      TblPagination: FusionScoreTblPagination,
      recordsAfterPaging: FusionScoreRecordsAfterPaging,
    } = useTable(
      fusionScoreResults,
      fusionScoreHeader,
      [10, 15, 20],
      fusionScoreResults.length
    );

    const createTheInfoSection = () => {
      if (pathwayBasedRes) {
        const paramsList = (
          <div className={classes.params_list}>
            <h3>Selected Parameters</h3>
            <ul>
              <li>
                <span>Population</span>
                <span>
                  {String(pathwayBasedRes?.pathwaybased_params.population)}
                </span>
              </li>
              <li>
                <span>Run Pathway</span>
                <span>
                  {String(pathwayBasedRes?.pathwaybased_params.run_pathway)}
                </span>
              </li>
              <li>
                <span>Chromosome</span>
                <span>{String(pathwayBasedRes?.pathwaybased_params.chr)}</span>
              </li>
              <li>
                <span>Gene Set File</span>
                <span>
                  {String(pathwayBasedRes?.pathwaybased_params.gene_set_file)}
                </span>
              </li>
              <li>
                <span>Pvalue Cutoff</span>
                <span>
                  {String(pathwayBasedRes?.pathwaybased_params.pvalue_cutoff)}
                </span>
              </li>
              <li>
                <span>Up Window</span>
                <span>
                  {String(pathwayBasedRes?.pathwaybased_params.up_window)}
                </span>
              </li>
              <li>
                <span>Down Window</span>
                <span>
                  {String(pathwayBasedRes?.pathwaybased_params.down_window)}
                </span>
              </li>
              <li>
                <span>Max SNP</span>
                <span>
                  {String(pathwayBasedRes?.pathwaybased_params.max_snp)}
                </span>
              </li>
              <li>
                <span>Gene Scoring</span>
                <span>
                  {String(pathwayBasedRes?.pathwaybased_params.gene_scoring)}
                </span>
              </li>
              <li>
                <span>Merge Distance</span>
                <span>
                  {String(pathwayBasedRes?.pathwaybased_params.merge_distance)}
                </span>
              </li>
              <li>
                <span>MAF Cutoff</span>
                <span>
                  {String(pathwayBasedRes?.pathwaybased_params.maf_cutoff)}
                </span>
              </li>
            </ul>
          </div>
        );
        return (
          <div className={classes.info_section}>
            <h3 className={classes.sub_heading}>Job Information</h3>
            <div className={classes.info}>
              {getInfoSection(pathwayBasedRes, classes)}
              {paramsList}
            </div>
          </div>
        );
      }

      return false;
    };

    const createComponentTableHeaders = (
      headers: string[],
      stateUpdateFunction: any
    ) => {
      const dcd = headers.map((ele, i) => {
        return {
          id: ele.toLowerCase(),
          label: ele,
          disableSorting: true,
        };
      });
      // dcd.unshift({ id: "123", label: "", disableSorting: true });
      stateUpdateFunction(dcd);
    };

    const createComponentTableBody = (
      allines: string[],
      stateUpdateFunction: any
    ) => {
      const ddd = allines
        .filter((line) => line !== "")
        .slice(1)
        .map((list_string: string) => {
          return list_string.split("\t");
        });
      stateUpdateFunction(ddd);
    };

    const createTableSection = (
      TblContainer: React.FC,
      TblHead: React.FC,
      TblPagination: any,
      recordsAfterPaging: () => any[],
      resultsObj: any[][]
    ) => {
      if (
        pathwayBasedRes &&
        pathwayBasedRes.status === "completed" &&
        resultsObj.length > 0
      ) {
        return (
          <div className={classes.table_section}>
            {/*<Paper className={mclasses.pageContent}>*/}
            <TblContainer>
              <TblHead />
              <TableBody>
                {recordsAfterPaging().map((item, index) => (
                  <TableRow key={`row${index}`}>
                    {item.map((element: string, idx: number) => (
                      <TableCell key={`idx${idx}`}>
                        {element === "."
                          ? "NA"
                          : element.length > 30
                          ? `${element.substr(0, 31)} ...`
                          : element}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </TblContainer>
            <TblPagination />
            {/*</Paper>*/}
          </div>
        );
      }
      return (
        <p>No results for your data. Check if you used correct parameters.</p>
      );
    };

    const showDownloadButton = (download: string, title: string) => {
      if (pathwayBasedRes && pathwayBasedRes.status === "completed") {
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
                href={`/results${pathwayBasedRes[download]}`}
                target="_blank"
              >
                Download {title} Results
              </Button>
            </div>
          </div>
        );
      }
      return false;
    };

    const showGeneScoreTables = () => {
      if (pathwayBasedRes && pathwayBasedRes.status === "completed") {
        return (
          <div className={classes.tables}>
            <h3 className={classes.sub_heading}>Gene Score Result Table</h3>
            {showDownloadButton("geneScoresFile", "Gene Scores Result")}
            <div className={classes.table_wrapper}>
              {loadingGeneScoreResults ? (
                <CircularProgress />
              ) : (
                createTableSection(
                  GeneScoreTblContainer,
                  GeneScoreTblHead,
                  GeneScoreTblPaginaion,
                  GeneScoreRecordsAfterPaging,
                  geneScoreResults
                )
              )}
            </div>
          </div>
        );
      }
      return false;
    };

    const showPathwayBasedTables = () => {
      if (
        pathwayBasedRes &&
        pathwayBasedRes.status === "completed" &&
        pathwayBasedRes.pathwaybased_params.run_pathway === "on"
      ) {
        return (
          <div className={classes.tables}>
            <h3 className={classes.sub_heading}>Pathway Results Table</h3>
            {showDownloadButton("pathwaySetFile", "Pathways Result Table")}
            <div className={classes.table_wrapper}>
              {loadingPathwayBasedResults ? (
                <CircularProgress />
              ) : (
                createTableSection(
                  PathwayBasedTblContainer,
                  PathwayBasedTblHead,
                  PathwayBasedTblPaginaion,
                  PathwayBasedRecordsAfterPaging,
                  pathwayBasedResults
                )
              )}
            </div>
          </div>
        );
      }
      return false;
    };

    const showFusionScoreTables = () => {
      if (
        pathwayBasedRes &&
        pathwayBasedRes.status === "completed" &&
        pathwayBasedRes.pathwaybased_params.run_pathway === "on"
      ) {
        return (
          <div className={classes.tables}>
            <h3 className={classes.sub_heading}>Fusion Genes Results Table</h3>
            {showDownloadButton(
              "fusionGenesFile",
              "Fusion Genes Results Table"
            )}
            <div className={classes.table_wrapper}>
              {loadingFusionScoreResults ? (
                <CircularProgress />
              ) : (
                createTableSection(
                  FusionScoreTblContainer,
                  FusionScoreTblHead,
                  FusionScoreTblPagination,
                  FusionScoreRecordsAfterPaging,
                  fusionScoreResults
                )
              )}
            </div>
          </div>
        );
      }
      return false;
    };

    if (error) {
      genMessage = <p>Issue with fetching job with id: {id}</p>;
      errorMessage = <p>Message from server: {errorInfo}</p>;
    }

    //Get status object
    useEffect(() => {
      setLoading(true);
      pgwasAxios
        .get<PathwayBasedResult>(`/${apiPath}/jobs/${id}`)
        .then((result) => {
          setPathwayBasedRes(result.data);
          setLoading(false);
          setError(false);
          if (
            result.data.status === "completed" ||
            result.data.status === "failed"
          ) {
            clearTimeout(timeout.current);
          }
        })
        .catch((e) => {
          setPathwayBasedRes(undefined);
          setLoading(false);
          setError(true);
          setErrorInfo(e.response.data.message);
          clearTimeout(timeout.current);
        });
    }, [apiPath, id, reload]);

    //controls timer
    useEffect(() => {
      if (
        pathwayBasedRes &&
        !pathwayBasedRes.longJob &&
        (pathwayBasedRes.status === "running" ||
          pathwayBasedRes.status === "queued")
      ) {
        if (seconds > 0) {
          timeout.current = setTimeout(() => setSeconds(seconds - 1), 1000);
        } else {
          setSeconds(reloadLimit);
          setReload((prev) => prev + 1);
        }
      }
    }, [pathwayBasedRes, seconds]);

    useEffect(() => {
      return () => {
        clearTimeout(timeout.current);
      };
    }, []);

    //download file one
    useEffect(() => {
      if (pathwayBasedRes && pathwayBasedRes.status === "completed") {
        if (geneScoreResults.length === 0) {
          setLoadingGeneScoreResults(true);
          pgwasAxios
            .get(`/${apiPath}/jobs/output/${id}/geneScoresFile`)
            .then((response) => {
              const alllines = response.data.split("\n");
              const header: string[] = alllines[0].split("\t");
              createComponentTableHeaders(header, setGeneScoreHeader);
              createComponentTableBody(alllines, setGeneScoreResults);
              setLoadingGeneScoreResults(false);
            })
            .catch((error) => {
              console.dir(error);
              setLoadingGeneScoreResults(false);
            });
        }
      }
      // eslint-disable-next-line
    }, [apiPath, pathwayBasedRes, id]);

    //download file two
    useEffect(() => {
      if (
        pathwayBasedRes &&
        pathwayBasedRes.status === "completed" &&
        pathwayBasedRes.pathwaybased_params.run_pathway === "on"
      ) {
        if (pathwayBasedResults.length === 0) {
          setLoadingPathwayBasedResults(true);
          pgwasAxios
            .get(`/${apiPath}/jobs/output/${id}/pathwaySetFile`)
            .then((response) => {
              const alllines = response.data.split("\n");
              const header: string[] = alllines[0].split("\t");
              createComponentTableHeaders(header, setPathwayBasedHeader);
              createComponentTableBody(alllines, setPathwayBasedResults);
              setLoadingPathwayBasedResults(false);
            })
            .catch((error) => {
              console.dir(error);
              setLoadingPathwayBasedResults(false);
            });
        }
      }
      // eslint-disable-next-line
    }, [apiPath, pathwayBasedRes, id]);

    //download file three
    useEffect(() => {
      if (
        pathwayBasedRes &&
        pathwayBasedRes.status === "completed" &&
        pathwayBasedRes.pathwaybased_params.run_pathway === "on"
      ) {
        if (fusionScoreResults.length === 0) {
          setLoadingFusionScoreResults(true);
          pgwasAxios
            .get(`/${apiPath}/jobs/output/${id}/fusionGenesFile`)
            .then((response) => {
              const alllines = response.data.split("\n");
              const header: string[] = alllines[0].split("\t");
              createComponentTableHeaders(header, setFusionScoreHeader);
              createComponentTableBody(alllines, setFusionScoreResults);
              setLoadingFusionScoreResults(false);
            })
            .catch((error) => {
              console.dir(error);
              setLoadingFusionScoreResults(false);
            });
        }
      }
      // eslint-disable-next-line
    }, [apiPath, pathwayBasedRes, id]);

    return (
      <div className={classes.result_view}>
        {loading ? <CircularProgress /> : null}
        {error && (
          <div className={classes.error_message}>
            {genMessage}
            {errorMessage}
          </div>
        )}
        {createJobStatus(pathwayBasedRes, seconds, classes)}
        <h2 style={{ marginBottom: "2rem" }}>
          Results for Job: {pathwayBasedRes ? pathwayBasedRes.job_name : id}
        </h2>
        {createTheInfoSection()}
        {createJobFailedReason(pathwayBasedRes, classes)}
        {showGeneScoreTables()}
        {showPathwayBasedTables()}
        {showFusionScoreTables()}
      </div>
    );
  };

export default PathwayBasedResultView;
