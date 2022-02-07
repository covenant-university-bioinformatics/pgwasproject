import React, { useEffect, useState } from "react";
import useTable from "../../../../hooks/useTable";
import pgwasAxios from "../../../../axios-fetches";
import { createTableSection } from "../../../utility/general";
import {
  createComponentTableHeaders,
  createComponentTableBody,
} from "../../../utility/general_utils";
import { LDStructureResult } from "../index";
import { Button, CircularProgress } from "@material-ui/core";
import { GetAppRounded } from "@material-ui/icons";
import mainClasses from "./index.module.scss";

type Props = {
  ldStructureRes: LDStructureResult;
  apiPath: string;
  jobId: string;
  classes: any;
};

const LDAll: React.FC<Props> = ({
  ldStructureRes,
  apiPath,
  jobId,
  classes,
}: Props) => {
  const [ldAllResults, setLDAllResults] = useState<string[][]>([]);
  const [ldAllHeader, setLDAllHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);

  const [loading, setLoading] = useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    ldAllResults,
    ldAllHeader,
    [10, 15, 20],
    ldAllResults.length
  );

  const showDownloadButton = (download: string, title: string) => {
    if (
      ldStructureRes &&
      ldStructureRes.status === "completed" &&
      ldStructureRes.LDAllFile
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
              href={`/results${ldStructureRes[download]}`}
            >
              Download {title} Results
            </Button>
          </div>
        </div>
      );
    }
    return false;
  };

  const showTable = () => {
    if (
      ldStructureRes &&
      ldStructureRes.status === "completed" &&
      ldStructureRes.LDAllFile
    ) {
      return (
        <div className={classes.tables}>
          <h3 className={classes.sub_heading}>All LD Values Result Table</h3>
          {showDownloadButton("LDAllFile", "All LD Values")}
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
                ldAllResults.length,
                ldStructureRes,
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
    if (ldStructureRes && ldStructureRes.status === "completed") {
      if (ldStructureRes.LDAllFile) {
        setLoading(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${jobId}/LDAllFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createComponentTableHeaders(header, setLDAllHeader);
            createComponentTableBody(alllines, setLDAllResults);
            setLoading(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoading(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [ldStructureRes, jobId]);

  return <>{showTable()}</>;
};

export default LDAll;
