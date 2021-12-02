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

export type GeneBasedResult = {
  _id: string;
  status: string;
  job_name: string;
  jobUID: string;
  inputFile: string;
  createdAt: string;
  gene_based_genes_out: string;
  gene_based_tissue_genes_out: string;
  manhattan_plot: string;
  qq_plot: string;
  failed_reason: string | undefined;
  longJob: string;
  completionTime: string;
  genebased_params: {
    id: string;
    version: number;
    population: string;
    synonym: string;
    up_window: string;
    down_window: string;
    tissue: string | undefined;
  };
  [key: string]: any;
};

const GeneBasedResultView: React.FC<Props & RouteComponentProps<JobParam>> = (
  props
) => {
  const { user } = useTypedSelector((state) => state.auth);

  let apiPath = "";
  if (user?.username) {
    apiPath = "genebased";
  } else {
    apiPath = "genebased/noauth";
  }

  const reloadLimit = 60;
  const { jobId: id } = props.match.params;
  const [geneBasedRes, setGeneBasedRes] = useState<GeneBasedResult | undefined>(
    undefined
  );
  const [errorInfo, setErrorInfo] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [seconds, setSeconds] = useState(reloadLimit);
  const timeout = useRef<any>(null);
  let errorMessage: any | null = null;
  let genMessage: any | null = null;

  const [geneBasedResults, setGeneBasedResults] = useState<string[][]>([]);
  const [geneBasedHeader, setGeneBasedHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingGeneBasedResults, setLoadingGeneBasedResults] = useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    geneBasedResults,
    geneBasedHeader,
    [10, 15, 20],
    geneBasedResults.length
  );

  const [tissueBasedResults, setTissueBasedResults] = useState<string[][]>([]);
  const [tissueBasedHeader, setTissueBasedHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingTissueBasedResults, setLoadingTissueBasedResults] =
    useState(false);

  const {
    TblContainer: tissueTblContainer,
    TblHead: tissueTblHead,
    TblPagination: tissueTblPagination,
    recordsAfterPaging: tissueRecordsAfterPaging,
  } = useTable(
    tissueBasedResults,
    tissueBasedHeader,
    [10, 15, 20],
    tissueBasedResults.length
  );

  const createTheInfoSection = () => {
    if (geneBasedRes) {
      const paramsList = (
        <div className={classes.params_list}>
          <h3>Selected Parameters</h3>
          <ul>
            <li>
              <span>Population</span>
              <span>{String(geneBasedRes?.genebased_params.population)}</span>
            </li>
            <li>
              <span>Synonym</span>
              <span>{String(geneBasedRes?.genebased_params.synonym)}</span>
            </li>
            <li>
              <span>Up Window</span>
              <span>{String(geneBasedRes?.genebased_params.up_window)}</span>
            </li>
            <li>
              <span>Down Window</span>
              <span>{String(geneBasedRes?.genebased_params.down_window)}</span>
            </li>
            <li>
              <span>Tissue</span>
              <span>{String(geneBasedRes?.genebased_params.tissue)}</span>
            </li>
          </ul>
        </div>
      );
      return (
        <div className={classes.info_section}>
          <h3 className={classes.sub_heading}>Job Information</h3>
          <div className={classes.info}>
            {getInfoSection(geneBasedRes, classes)}
            {paramsList}
          </div>
        </div>
      );
    }

    return false;
  };

  const createChartSection = () => {
    if (geneBasedRes && geneBasedRes.status === "completed") {
      const chartOne = (
        <div className={classes.image_tab}>
          <h3>Manhattan Plot</h3>
          <div className={classes.image_box}>
            <img
              src={`/results${geneBasedRes!.manhattan_plot}`}
              alt="Manhattan plot"
            />
          </div>
        </div>
      );

      const chartTwo = (
        <div className={classes.image_tab}>
          <h3>QQ plot</h3>
          <div className={classes.image_box}>
            <img src={`/results${geneBasedRes!.qq_plot}`} alt="QQ plot" />
          </div>
        </div>
      );

      return (
        <div className={classes.chart_section}>
          <h3 className={classes.sub_heading}>Summary Statistics Overview</h3>
          <div className={classes.images}>
            {chartOne}
            {chartTwo}
          </div>
        </div>
      );
    }
    return false;
  };

  const createGeneBasedHeaders = (headers: string[]) => {
    const dcd = headers.map((ele, i) => {
      return {
        id: ele.toLowerCase(),
        label: ele,
        disableSorting: true,
      };
    });
    // dcd.unshift({ id: "123", label: "", disableSorting: true });
    setGeneBasedHeader(dcd);
  };

  const createGeneBasedTableBody = (allines: string[]) => {
    const ddd = allines
      .filter((line) => line !== "")
      .slice(1)
      .map((list_string: string) => {
        return list_string.split("\t");
      });
    setGeneBasedResults(ddd);
  };

  const createTissueBasedHeaders = (headers: string[]) => {
    const dcd = headers.map((ele, i) => {
      return {
        id: ele.toLowerCase(),
        label: ele,
        disableSorting: true,
      };
    });
    // dcd.unshift({ id: "123", label: "", disableSorting: true });
    setTissueBasedHeader(dcd);
  };

  const createTissueBasedTableBody = (allines: string[]) => {
    const ddd = allines
      .filter((line) => line !== "")
      .slice(1)
      .map((list_string: string) => {
        return list_string.split("\t");
      });
    setTissueBasedResults(ddd);
  };

  const createTableSection = (
    TblContainer: React.FC,
    TblHead: React.FC,
    TblPagination: any,
    recordsAfterPaging: () => any[]
  ) => {
    if (
      geneBasedRes &&
      geneBasedRes.status === "completed" &&
      geneBasedResults.length > 0
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
                      {element === "." ? "NA" : element}
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
    return null;
  };

  const showDownloadButton = (download: string, title: string) => {
    if (geneBasedRes && geneBasedRes.status === "completed") {
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
              href={`/results${geneBasedRes[download]}`}
            >
              Download {title} Results
            </Button>
          </div>
        </div>
      );
    }
    return false;
  };

  const showGeneBasedTables = () => {
    if (geneBasedRes && geneBasedRes.status === "completed") {
      return (
        <div className={classes.tables}>
          <h3 className={classes.sub_heading}>GeneBased Result Table</h3>
          {showDownloadButton("gene_based_genes_out", "Gene Based")}
          <div className={classes.table_wrapper}>
            {loadingGeneBasedResults ? (
              <CircularProgress />
            ) : (
              createTableSection(
                TblContainer,
                TblHead,
                TblPagination,
                recordsAfterPaging
              )
            )}
          </div>
        </div>
      );
    }
    return false;
  };

  const showTissueBasedTables = () => {
    if (
      geneBasedRes &&
      geneBasedRes.status === "completed" &&
      geneBasedRes.genebased_params.tissue
    ) {
      return (
        <div className={classes.tables}>
          <h3 className={classes.sub_heading}>GeneBased Result Table</h3>
          {showDownloadButton(
            "gene_based_tissue_genes_out",
            `Tissue Based: ${geneBasedRes.genebased_params.tissue}`
          )}
          <div className={classes.table_wrapper}>
            {loadingTissueBasedResults ? (
              <CircularProgress />
            ) : (
              createTableSection(
                tissueTblContainer,
                tissueTblHead,
                tissueTblPagination,
                tissueRecordsAfterPaging
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

  useEffect(() => {
    setLoading(true);
    pgwasAxios
      .get<GeneBasedResult>(`/${apiPath}/jobs/${id}`)
      .then((result) => {
        setGeneBasedRes(result.data);
        setLoading(false);
        setError(false);
        if (
          result.data.status === "completed" ||
          result.data.status === "failed"
        ) {
          // clearInterval(interval.current);
          clearTimeout(timeout.current);
        }
      })
      .catch((e) => {
        setGeneBasedRes(undefined);
        setLoading(false);
        setError(true);
        setErrorInfo(e.response.data.message);
        // clearInterval(interval.current);
        clearTimeout(timeout.current);
      });
  }, [id, reload]);

  useEffect(() => {
    if (
      geneBasedRes &&
      !geneBasedRes.longJob &&
      (geneBasedRes.status === "running" || geneBasedRes.status === "queued")
    ) {
      if (seconds > 0) {
        timeout.current = setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(reloadLimit);
        setReload((prev) => prev + 1);
      }
    }
  }, [geneBasedRes, seconds]);

  useEffect(() => {
    return () => {
      // clearInterval(interval.current);
      clearTimeout(timeout.current);
    };
  }, []);

  useEffect(() => {
    if (geneBasedRes && geneBasedRes.status === "completed") {
      if (geneBasedResults.length === 0) {
        setLoadingGeneBasedResults(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${id}/gene_based_genes_out`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createGeneBasedHeaders(header);
            createGeneBasedTableBody(alllines);
            setLoadingGeneBasedResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingGeneBasedResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [geneBasedRes, id]);

  useEffect(() => {
    if (
      geneBasedRes &&
      geneBasedRes.status === "completed" &&
      geneBasedRes.genebased_params.tissue
    ) {
      if (tissueBasedResults.length === 0) {
        setLoadingTissueBasedResults(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${id}/gene_based_tissue_genes_out`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createTissueBasedHeaders(header);
            createTissueBasedTableBody(alllines);
            setLoadingTissueBasedResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingTissueBasedResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [geneBasedRes, id]);

  return (
    <div className={classes.result_view}>
      {loading ? <CircularProgress /> : null}
      {error && (
        <div className={classes.error_message}>
          {genMessage}
          {errorMessage}
        </div>
      )}
      {createJobStatus(geneBasedRes, seconds, classes)}
      <h2 style={{ marginBottom: "2rem" }}>
        Results for Job: {geneBasedRes ? geneBasedRes.job_name : id}
      </h2>
      {createTheInfoSection()}
      {createJobFailedReason(geneBasedRes, classes)}
      {createChartSection()}
      {showGeneBasedTables()}
      {showTissueBasedTables()}
    </div>
  );
};

export default GeneBasedResultView;
