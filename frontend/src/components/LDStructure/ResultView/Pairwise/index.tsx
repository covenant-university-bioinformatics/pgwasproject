import React, { useEffect, useState } from "react";
import pgwasAxios from "../../../../axios-fetches";
import { LDStructureResult } from "../index";
import classes from "./index.module.scss";
import { CircularProgress } from "@material-ui/core";

type Props = {
  ldStructureRes: LDStructureResult;
  apiPath: string;
  jobId: string;
};

const LDPairwise: React.FC<Props> = ({
  ldStructureRes,
  apiPath,
  jobId,
}: Props) => {
  const [resultData, setResultData] = useState("");
  const [errorData, setErrorData] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ldStructureRes && ldStructureRes.status === "completed") {
      if (ldStructureRes.LDPairwiseFile) {
        setLoading(true);
        pgwasAxios
          .get(`/${apiPath}/jobs/output/${jobId}/LDPairwiseFile`)
          .then((response) => {
            setResultData(response.data);
            setErrorData("");
            setLoading(false);
          })
          .catch((error) => {
            console.dir(error);
            setErrorData(error.message);
            setResultData("");
            setLoading(false);
          });
      }
    }
    // eslint-disable-next-line
  }, [ldStructureRes, jobId]);

  return (
    <div className={classes.pairwise}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <p className={classes.error}>{errorData}</p>
          <h2 className={classes.heading}>LD Information Between Two SNPs</h2>
          <pre className={classes.result}>{resultData}</pre>
        </>
      )}
    </div>
  );
};

export default LDPairwise;
