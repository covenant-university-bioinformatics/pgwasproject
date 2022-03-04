import React, { useEffect, useState } from "react";
import { HaploRResult } from "../index";
import useTable from "../../../../hooks/useTable";
import { Button, CircularProgress, TableBody } from "@material-ui/core";
import { GetAppRounded } from "@material-ui/icons";
import pgwasAxios from "../../../../axios-fetches";
import HaploRRow from "./HaploRRow";
import mainClasses from "./index.module.scss";

type Props = {
  resultObj: HaploRResult;
  apiPath: string;
  jobId: string;
  classes: any;
};

const HaploR: React.FC<Props> = ({
  resultObj,
  apiPath,
  jobId,
  classes,
}: Props) => {
  const [haploRResults, setHaploRResults] = useState<string[][]>([]);
  const [haploRHeader, setHaploRHeader] = useState<
    { id: string; label: string; disableSorting: boolean }[]
  >([]);
  const [otherValues, setOtherValues] = useState<
    {
      Chromatin_States: string;
      Chromatin_States_Imputed: string;
      Chromatin_Marks: string;
      DNAse: string;
      Proteins: string;
      Motifs: string;
      GENCODE_name: string;
      Promoter_histone_marks: string;
      Enhancer_histone_marks: string;
    }[]
  >([]);

  // console.log(haploRHeader);
  // console.log(haploRResults);
  // console.log(otherValues);

  const [loading, setLoading] = useState(false);

  const { TblContainer, TblHead, TblPagination, recordsAfterPaging } = useTable(
    haploRResults,
    haploRHeader,
    [10, 15, 20],
    haploRResults.length
  );

  const getOtherValues = (allines: string[]) => {
    const ddd = allines
      .filter((line) => line !== "")
      .slice(1)
      .map((list_string: string) => {
        const list = list_string.split("\t");
        const temp = {
          Chromatin_States: list[14],
          Chromatin_States_Imputed: list[15],
          Chromatin_Marks: list[16],
          DNAse: list[17],
          Proteins: list[18],
          Motifs: list[22],
          GENCODE_name: list[24],
          Promoter_histone_marks: list[33],
          Enhancer_histone_marks: list[34],
        };
        return temp;
      });

    setOtherValues(ddd);
  };

  const createHeaders = (headers: string[]) => {
    const headSlice = headers.slice(0, 12);
    headSlice.push(headers[24]);
    const dcd = headSlice.map((ele, i) => {
      return {
        id: ele.toLowerCase().replace(/['"]+/g, ""),
        label: ele.replace(/['"]+/g, ""),
        disableSorting: true,
      };
    });
    dcd.unshift({ id: "123", label: "", disableSorting: true });
    setHaploRHeader(dcd);
  };

  const createTableBody = (allines: string[]) => {
    const ddd = allines
      .filter((line) => line !== "")
      .slice(1)
      .map((list_string: string) => {
        const list = list_string.split("\t");
        const temp = list.slice(0, 12);
        temp.push(list[24]);
        return temp;
      });
    setHaploRResults(ddd);
  };

  const showDownloadButton = (download: string, title: string) => {
    if (resultObj && resultObj.status === "completed" && resultObj.haploRFile) {
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
              target="_blank"
              href={`/results${resultObj[download]}`}
            >
              Download {title} Results
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              endIcon={<GetAppRounded />}
              target="_blank"
              href={`/results${resultObj["haploRErrorFile"]}`}
            >
              Download Errors File
            </Button>
          </div>
        </div>
      );
    }
    return false;
  };

  useEffect(() => {
    if (resultObj && resultObj.status === "completed") {
      if (resultObj.haploRFile) {
        setLoading(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${jobId}/haploRFile`)
          .then((response) => {
            const alllines = response.data.split("\n");
            const header: string[] = alllines[0].split("\t");
            createHeaders(header);
            createTableBody(alllines);
            getOtherValues(alllines);
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

  return (
    <div>
      {resultObj && resultObj.status === "completed" && resultObj.haploRFile && (
        <div className={classes.tables}>
          <h3 className={classes.sub_heading}>HaploR Results Table</h3>
          {showDownloadButton("haploRFile", "HaploR")}
          <div
            className={[classes.table_wrapper, mainClasses.overflow].join(" ")}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <div className={classes.table_section}>
                {/*<Paper className={mclasses.pageContent}>*/}
                <TblContainer>
                  <TblHead />
                  <TableBody>
                    {recordsAfterPaging().map((item, index) => (
                      <HaploRRow
                        key={`item${index}`}
                        item={item}
                        chromatinValues={otherValues[index]}
                        classes={mainClasses}
                      />
                    ))}
                  </TableBody>
                </TblContainer>
                <TblPagination />
                {/*</Paper>*/}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HaploR;
