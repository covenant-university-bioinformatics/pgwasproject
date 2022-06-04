import React, { useEffect, useState } from "react";
import useTable from "../../../hooks/useTable";
import mainClasses from "../../LDStructure/ResultView/LDAll/index.module.scss";
import { CircularProgress } from "@material-ui/core";
import { createTableSection } from "../../utility/general";
import { CustomResult } from "../index";
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

const LDClumpCustom: React.FC<Props> = ({
  customResult,
  apiPath,
  jobId,
  classes,
  showDownloadButton,
}) => {
  //clump state
  const [clumpResults, setClumpResults] = useState<string[][]>([]);
  const [clumpResultHeader, setClumpResultHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    clumpResults,
    clumpResultHeader,
    [10, 15, 20],
    clumpResults.length
  );

  const showTable = () => {
    if (
      customResult &&
      customResult.status === "completed" &&
      customResult.clump_ResultsFile
    ) {
      return (
        <div className={classes.tables}>
          <h3 className={classes.sub_heading}>
            Linkage Disequilibrium Clump Result Table
          </h3>
          {showDownloadButton("clump_ResultsFile", "LD Clump")}
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
                clumpResults.length,
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
      if (customResult.clump_ResultsFile) {
        setLoading(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${jobId}/clump_ResultsFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createComponentTableHeaders(header, setClumpResultHeader);
            createComponentTableBody(alllines, setClumpResults);
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

export default LDClumpCustom;
