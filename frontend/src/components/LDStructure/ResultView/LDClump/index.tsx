import React, { useEffect, useState } from "react";
import { LDStructureResult } from "../index";
import useTable from "../../../../hooks/useTable";
import { Button, CircularProgress } from "@material-ui/core";
import { GetAppRounded } from "@material-ui/icons";
import { createTableSection } from "../../../utility/general";
import pgwasAxios from "../../../../axios-fetches";
import {
  createComponentTableBody,
  createComponentTableHeaders,
} from "../../../utility/general_utils";
import mainClasses from "../LDAll/index.module.scss";

type Props = {
  ldStructureRes: LDStructureResult;
  apiPath: string;
  jobId: string;
  classes: any;
};

const LDClump: React.FC<Props> = ({
  ldStructureRes,
  apiPath,
  jobId,
  classes,
}: Props) => {
  const [ldClumpResults, setLDClumpResults] = useState<string[][]>([]);
  const [ldClumpHeader, setLDClumpHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    ldClumpResults,
    ldClumpHeader,
    [10, 15, 20],
    ldClumpResults.length
  );

  const showDownloadButton = (download: string, title: string) => {
    if (
      ldStructureRes &&
      ldStructureRes.status === "completed" &&
      ldStructureRes.LDClumpFile
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
      ldStructureRes.LDClumpFile
    ) {
      return (
        <div className={classes.tables}>
          <h3 className={classes.sub_heading}>All LD Values Result Table</h3>
          {showDownloadButton("LDClumpFile", "LD Clumping")}
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
                ldClumpResults.length,
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
      if (ldStructureRes.LDClumpFile) {
        setLoading(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${jobId}/LDClumpFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createComponentTableHeaders(header, setLDClumpHeader);
            createComponentTableBody(alllines, setLDClumpResults);
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

  return <div>{showTable()}</div>;
};

export default LDClump;
