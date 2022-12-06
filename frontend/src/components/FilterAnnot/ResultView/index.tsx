import React, { useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import pgwasAxios from "../../../axios-fetches";
// import classes from "./index.module.scss";
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
  CreateInfoSection,
  createJobFailedReason,
  createJobStatus,
} from "../../utility/general";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import classes from "../../utility/result_view.module.scss";

type Props = {};
type JobParam = {
  jobId: string;
};

export type FilterAnnotResult = {
  _id: string;
  status: string;
  job_name: string;
  jobUID: string;
  inputFile: string;
  createdAt: string;
  resultsFile: string;
  failed_reason: string | undefined;
  longJob: string;
  completionTime: string;
  filterannot_params: {
    id: string;
    version: number;
    marker_name: number;
    chromosome: number;
    position: number;
    effect_allele: number;
    alternate_allele: number;
    annotation_type: string;
  };
  [key: string]: any;
};

const FilterAnnotResultView: React.FC<Props & RouteComponentProps<JobParam>> = (
  props
) => {
  const { user } = useTypedSelector((state) => state.auth);

  let apiPath = "";
  if (user?.username) {
    apiPath = "filterannot";
  } else {
    apiPath = "filterannot/noauth";
  }

  const reloadLimit = 60;
  const { jobId: id } = props.match.params;
  const [filterannotRes, setFilterAnnotRes] = useState<FilterAnnotResult | undefined>(undefined);
  const [errorInfo, setErrorInfo] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [seconds, setSeconds] = useState(reloadLimit);
  const timeout = useRef<any>(null);
  let errorMessage: any | null = null;
  let genMessage: any | null = null;

  const [filterannotResults, setFilterAnnotResults] = useState<string[][]>([]);
  const [filterannotHeader, setFilterAnnotHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingFilterAnnotResults, setLoadingFilterAnnotResults] = useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    filterannotResults,
    filterannotHeader,
    [10, 15, 20],
    filterannotResults.length
  );

  const createFilterAnnotHeaders = (headers: string[]) => {
    const dcd = headers.map((ele, i) => {
      return {
        id: ele.toLowerCase().replaceAll('"', ''),
        label: ele.replaceAll('"', ''),
        disableSorting: true,
      };
    });
    // dcd.unshift({ id: "123", label: "", disableSorting: true });
    // console.log(dcd);
    setFilterAnnotHeader(dcd);
  };

  const createFilterAnnotTableBody = (allines: string[]) => {
    const ddd = allines
      .filter((line) => line !== "")
      .slice(1)
      .map((list_string: string) => {
        return list_string.split("\t");
      });
    setFilterAnnotResults(ddd);
  };

  const createTableSection = (
    TblContainer: React.FC,
    TblHead: React.FC,
    TblPagination: any,
    recordsAfterPaging: () => any[]
  ) => {
    if (
      filterannotRes &&
      filterannotRes.status === "completed" &&
      filterannotResults.length > 0
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
                        ? `${element.replace(/['"]+/g, "").substr(0, 31)} ...`
                        : element.replace(/['"]+/g, "")}
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
    if (filterannotRes && filterannotRes.status === "completed") {
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
              href={`/results${filterannotRes[download]}`}
            >
              Download {title} Results
            </Button>
          </div>
        </div>
      );
    }
    return false;
  };

  const showFilterAnnotTables = () => {
    if (filterannotRes && filterannotRes.status === "completed") {
      return (
        <div className={classes.tables}>
          <h3 className={classes.sub_heading}>GWAVA Result Table</h3>
          {showDownloadButton("resultsFile", "Annotation")}
          <div className={classes.table_wrapper}>
            {loadingFilterAnnotResults ? (
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

  if (error) {
    genMessage = <p>Issue with fetching job with id: {id}</p>;
    errorMessage = <p>Message from server: {errorInfo}</p>;
  }

  useEffect(() => {
    setLoading(true);
    pgwasAxios
      .get<FilterAnnotResult>(`/${apiPath}/jobs/${id}`)
      .then((result) => {
        setFilterAnnotRes(result.data);
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
        setFilterAnnotRes(undefined);
        setLoading(false);
        setError(true);
        setErrorInfo(e.response.data.message);
        // clearInterval(interval.current);
        clearTimeout(timeout.current);
      });
  }, [id, reload, apiPath]);

  useEffect(() => {
    if (
      filterannotRes &&
      !filterannotRes.longJob &&
      (filterannotRes.status === "running" || filterannotRes.status === "queued")
    ) {
      if (seconds > 0) {
        timeout.current = setTimeout(() => setSeconds(seconds - 1), 1000);
      } else {
        setSeconds(reloadLimit);
        setReload((prev) => prev + 1);
      }
    }
  }, [filterannotRes, seconds]);

  useEffect(() => {
    return () => {
      // clearInterval(interval.current);
      clearTimeout(timeout.current);
    };
  }, []);

  useEffect(() => {
    if (filterannotRes && filterannotRes.status === "completed") {
      if (filterannotResults.length === 0) {
        setLoadingFilterAnnotResults(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${id}/resultsFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createFilterAnnotHeaders(header);
            createFilterAnnotTableBody(alllines);
            setLoadingFilterAnnotResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingFilterAnnotResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [filterannotRes, id]);

  return (
    <div className={classes.result_view}>
      {loading ? <CircularProgress /> : null}
      {error && (
        <div className={classes.error_message}>
          {genMessage}
          {errorMessage}
        </div>
      )}
      {createJobStatus(filterannotRes, seconds, classes)}
      <h2 style={{ marginBottom: "2rem" }}>
        Results for Job: {filterannotRes ? filterannotRes.job_name : id}
      </h2>
      <CreateInfoSection
        resultObj={filterannotRes}
        params={"filterannot_params"}
        classes={classes}
      />
      {createJobFailedReason(filterannotRes, classes)}
      {showFilterAnnotTables()}
    </div>
  );
};

export default FilterAnnotResultView;
