import React, { useEffect, useState } from "react";
import useTable from "../../../hooks/useTable";
import { createScoresObject } from "../../utility/general_utils";
import mainClasses from "../../Deleteriousness/ResultView/index.module.scss";
import { Button, CircularProgress, TableBody } from "@material-ui/core";
import ListRow from "../../utility/RowExtra";
import { CustomResult } from "../index";
import { GetAppRounded } from "@material-ui/icons";
import pgwasAxios from "../../../axios-fetches";

type Props = {
  customResult: CustomResult | undefined;
  apiPath: string;
  jobId: string;
  classes: any;
};

let counter = 0;

const DeletResults: React.FC<Props> = ({
  customResult,
  apiPath,
  jobId,
  classes,
}) => {
  const [snpResults, setSnpResults] = useState<string[][]>([]);
  const [snpHeader, setSnpHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [deletScores, setDeletScores] = useState<
    (
      | {
          name: string;
          score: string;
          rank_score: string;
          prediction: string;
        }[]
      | null
    )[]
  >([]);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    snpResults,
    snpHeader,
    [10, 15, 20],
    snpResults.length
  );

  const createHeaders = (headers: string[]) => {
    const deletHead = headers.slice(0, 9);
    deletHead.push(headers[headers.length - 1]);
    const dcd = deletHead.map((ele, i) => {
      return {
        id: ele.toLowerCase(),
        label: ele,
        disableSorting: true,
      };
    });
    dcd.unshift({ id: "123", label: "", disableSorting: true });
    setSnpHeader(dcd);
  };

  const getScores = (headers: string[], allines: string[]) => {
    const deletHead = headers.slice(10);
    deletHead.splice(-1);

    const deletBody = allines.slice(1).map((list_string: string) => {
      const list = list_string.split("\t");
      const temp = list.slice(10);
      temp.splice(-1);
      return temp;
    });

    const result = createScoresObject(deletHead, deletBody);
    setDeletScores(result);
  };

  // console.log(deletScores);

  const createTableBody = (allines: string[]) => {
    const ddd = allines
      .filter((line) => line !== "")
      .slice(1)
      .map((list_string: string) => {
        const list = list_string.split("\t");
        const temp = list.slice(0, 9);
        temp.push(list[list.length - 1]);
        return temp;
      });
    setSnpResults(ddd);
  };

  const createTableSection = (
    TblContainer: React.FC,
    TblHead: React.FC,
    TblPagination: any,
    recordsAfterPaging: () => any[]
  ) => {
    if (snpResults.length > 0) {
      return (
        <div className={mainClasses.table_section}>
          {/*<Paper className={mclasses.pageContent}>*/}
          <TblContainer>
            <TblHead />
            <TableBody>
              {recordsAfterPaging().map((item, index, arr) => {
                const row = (
                  <ListRow
                    key={`row${index + counter}`}
                    item={item}
                    scores={deletScores[index + counter]}
                  />
                );

                if (index === arr.length - 1) {
                  counter += arr.length;
                }

                return row;
              })}
            </TableBody>
          </TblContainer>
          <TblPagination />
          {/*</Paper>*/}
        </div>
      );
    }
    return null;
  };

  const showDownloadButton = () => {
    if (customResult && customResult.status === "completed") {
      return (
        <div className={mainClasses.download}>
          <p>
            The tables below have been chunked and pruned to allow for proper
            display. Use the buttons below to download the full files.
          </p>
          <div className={mainClasses.buttons}>
            <Button
              variant="contained"
              color="primary"
              className={mainClasses.button}
              endIcon={<GetAppRounded />}
              href={`/results${customResult.delet_outputFile}`}
            >
              Download Deleteriousness Results
            </Button>
          </div>
        </div>
      );
    }
    return null;
  };

  const createChartSection = () => {
    if (customResult && customResult.status === "completed") {
      const exons = (
        <div className={mainClasses.image_tab}>
          <h3>Exon Locations</h3>
          <div className={mainClasses.image_box}>
            <img
              src={`/results${customResult!.delet_exon_plot}`}
              alt="exon plot"
            />
          </div>
        </div>
      );

      return (
        <div className={mainClasses.delet_overview}>
          <h3 className={mainClasses.sub_heading}>Exonic SNPs Overview</h3>
          <div>{exons}</div>
        </div>
      );
    }
    return false;
  };

  const showTables = () => {
    if (snpResults.length > 0) {
      return (
        <div className={mainClasses.tables}>
          <h3 className={mainClasses.sub_heading}>
            Deleteriousness Result Table
          </h3>
          {showDownloadButton()}
          <div className={mainClasses.table_wrapper}>
            {loadingResults ? (
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
    return null;
  };

  useEffect(() => {
    if (customResult && customResult.status === "completed") {
      if (snpResults.length === 0) {
        setLoadingResults(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${jobId}/delet_outputFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createHeaders(header);
            createTableBody(alllines);
            getScores(header, alllines);
            setLoadingResults(false);
          })
          .catch((error) => {
            console.dir(error);
            setLoadingResults(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [customResult, jobId]);

  return (
    <>
      {createChartSection()}
      {showTables()}
    </>
  );
};

export default DeletResults;
