import React, { useEffect, useState } from "react";
import { CustomResult } from "../index";
import useTable from "../../../hooks/useTable";
import mainClasses from "../../LDStructure/ResultView/LDAll/index.module.scss";
import { CircularProgress } from "@material-ui/core";
import { createTableSection } from "../../utility/general";
import pgwasAxios from "../../../axios-fetches";
import {
  createComponentTableBody,
  createComponentTableHeaders,
} from "../../utility/general_utils";

type Props = {
  customResult: CustomResult | undefined;
  apiPath: string;
  jobId: string;
  classes: any;
  showDownloadButton: (
    download: string,
    title: string
  ) => JSX.Element | boolean;
};

const ColocResult: React.FC<Props> = ({
  customResult,
  apiPath,
  jobId,
  classes,
  showDownloadButton,
}) => {
  //coloc state
  const [colocResults, setColocResults] = useState<string[][]>([]);
  const [colocResultHeader, setColocResultHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    colocResults,
    colocResultHeader,
    [10, 15, 20],
    colocResults.length
  );

  const showTable = () => {
    if (
      customResult &&
      customResult.status === "completed" &&
      customResult.coloc_ResultsFile
    ) {
      return (
        <div className={classes.tables}>
          <h3 className={classes.sub_heading}>
            Colocalization Analysis Result Table
          </h3>
          {showDownloadButton("coloc_ResultsFile", "Coloc")}
          <div
            className={[classes.table_wrapper, mainClasses.overflow].join(" ")}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              createTableSection(
                TblContainer,
                TblHead,
                TblPagination,
                recordsAfterPaging,
                colocResults.length,
                customResult,
                classes
              )
            )}
          </div>
        </div>
      );
    }
    return false;
  };

  useEffect(() => {
    if (customResult && customResult.status === "completed") {
      if (customResult.coloc_ResultsFile) {
        setLoading(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${jobId}/coloc_ResultsFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createComponentTableHeaders(header, setColocResultHeader);
            createComponentTableBody(alllines, setColocResults);
            setLoading(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoading(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [customResult, jobId]);

  return <div>{showTable()}</div>;
};

export default ColocResult;
