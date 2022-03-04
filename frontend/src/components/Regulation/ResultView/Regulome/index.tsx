import React, { useEffect, useState } from "react";
import useTable from "../../../../hooks/useTable";
import pgwasAxios from "../../../../axios-fetches";
import { createTableSection } from "../../../utility/general";
import {
  createComponentTableHeaders,
  createComponentTableBody,
} from "../../../utility/general_utils";
import { HaploRResult } from "../index";
import { Button, CircularProgress } from "@material-ui/core";
import { GetAppRounded } from "@material-ui/icons";
import mainClasses from "./index.module.scss";

type Props = {
  resultObj: HaploRResult;
  apiPath: string;
  jobId: string;
  classes: any;
};

const Regulome: React.FC<Props> = ({
  resultObj,
  apiPath,
  jobId,
  classes,
}: Props) => {
  const [regulomeResults, setRegulomeResults] = useState<string[]>([]);
  const [regulomeHeader, setRegulomeHeader] = useState<string[]>([]);
  const [nearbySnps, setNearblySnps] = useState<string[][]>([]);
  const [nearbySnpsHeader, setNearblySnpsHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [loadingNearbySnps, setLoadingNearbySnps] = useState(false);

  // console.log(regulomeResults);
  // console.log(nearbySnps);
  // console.log(nearbySnpsHeader);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    nearbySnps,
    nearbySnpsHeader,
    [10, 15, 20],
    nearbySnps.length
  );

  const showDownloadButton = (download: string, title: string) => {
    if (
      resultObj &&
      resultObj.status === "completed" &&
      resultObj.regulomeFile
    ) {
      return (
        <div className={mainClasses.download}>
          <p>
            The table below have been chunked and pruned to allow for proper
            display. Use the buttons below to download the full files.
          </p>
          <div className={mainClasses.buttons}>
            <Button
              variant="contained"
              color="primary"
              className={mainClasses.button}
              endIcon={<GetAppRounded />}
              target="_blank"
              href={`/results${resultObj[download]}`}
            >
              Download {title} Results
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={mainClasses.button}
              endIcon={<GetAppRounded />}
              target="_blank"
              href={`/results${resultObj["regulomeNearbySNPsFile"]}`}
            >
              Download Nearby SNPs File
            </Button>
          </div>
        </div>
      );
    }
    return false;
  };

  useEffect(() => {
    if (resultObj && resultObj.status === "completed") {
      if (resultObj.regulomeFile) {
        setLoading(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${jobId}/regulomeFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            setRegulomeHeader(alllines[0].split("\t"));
            setRegulomeResults(alllines[1].split("\t"));
            setLoading(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoading(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [resultObj, jobId]);

  useEffect(() => {
    if (resultObj && resultObj.status === "completed") {
      if (resultObj.regulomeFile) {
        setLoadingNearbySnps(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${jobId}/regulomeNearbySNPsFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header = alllines[0].split("\t");
            createComponentTableHeaders(header, setNearblySnpsHeader);
            createComponentTableBody(alllines, setNearblySnps);
            setLoadingNearbySnps(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingNearbySnps(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [resultObj, jobId]);

  return (
    <>
      {resultObj && resultObj.status === "completed" && resultObj.regulomeFile && (
        <div className={mainClasses.regulome}>
          <h2>Regulome Results</h2>
          {showDownloadButton("regulomeFile", "Regulome File")}
          {loading ? (
            <CircularProgress />
          ) : (
            <ul className={mainClasses.list}>
              {regulomeResults.map((ele, index) => (
                <li key={`idx${index}`} className={mainClasses.element}>
                  <span>{regulomeHeader[index].replace(/['"]+/g, "")}</span>
                  <span>{ele.replace(/['"]+/g, "")}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {resultObj &&
        resultObj.status === "completed" &&
        resultObj.regulomeNearbySNPsFile && (
          <div>
            <div className={classes.tables}>
              <h3 className={classes.sub_heading}>NearBy SNPs Results Table</h3>
              <div
                className={[classes.table_wrapper, mainClasses.overflow].join(
                  " "
                )}
              >
                {loadingNearbySnps ? (
                  <CircularProgress />
                ) : (
                  createTableSection(
                    TblContainer,
                    TblHead,
                    TblPagination,
                    recordsAfterPaging,
                    nearbySnps.length,
                    resultObj,
                    classes
                  )
                )}
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default Regulome;
