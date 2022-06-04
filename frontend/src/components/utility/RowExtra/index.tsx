import React, { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  // Typography,
} from "@material-ui/core";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@material-ui/icons";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import classes from "./index.module.scss";
import bellcurve from "highcharts/modules/histogram-bellcurve";
bellcurve(Highcharts);
type Props = {
  item: any[];
  scores:
    | { name: string; score: string; rank_score: string; prediction: string }[]
    | null;
};

const RowExtra: React.FC<Props> = ({ item, scores }) => {
  const [open, setOpen] = useState(false);
  // console.log(scores);
  const findFreq = (
    data:
      | {
          name: string;
          score: string;
          rank_score: string;
          prediction: string;
        }[]
      | null,
    element: "rank_score" | "prediction"
  ) => {
    if (data === null) return {};
    if (data === undefined) return {};

    const res = data.map((row) => (row[element] === "." ? "NA" : row[element]));

    return res.reduce(function (acc: { [key: string]: number }, curr) {
      // eslint-disable-next-line
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    }, {});
  };

  const freqs = findFreq(scores, "prediction");

  const optionsBar = {
    chart: {
      type: "bar",
    },
    title: {
      text: "Frequency of Predictions",
    },
    subtitle: {
      text: "",
    },
    xAxis: {
      categories: Object.keys(freqs),
      title: {
        text: null,
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Frequencies",
        align: "high",
      },
      labels: {
        overflow: "justify",
      },
    },
    tooltip: {
      valueSuffix: " frequency",
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    credits: {
      enabled: false,
    },
    series: [{ name: "Deleteriousness", data: Object.values(freqs) }],
  };

  // @ts-ignore
  // const data = scores
  //   ? scores
  //       .filter(
  //         (row) => row["rank_score"] !== "na" && row["rank_score"] !== "."
  //       )
  //       .map((row) => parseFloat(row["rank_score"]))
  //   : [];
  // console.log("data ", data);
  // const optionsHist = {
  //   chart: {
  //     type: "histogram",
  //   },
  //   title: {
  //     text: "Rank Scores Chart",
  //   },
  //
  //   xAxis: [
  //     {
  //       title: { text: "Frequency" },
  //       alignTicks: true,
  //     },
  //   ],
  //
  //   yAxis: [
  //     {
  //       title: { text: "Rank Scores" },
  //     },
  //   ],
  //
  //   plotOptions: {
  //     histogram: {
  //       binWidth: 10,
  //     },
  //   },
  //
  //   series: [
  //     {
  //       name: "Histogram",
  //       data: data,
  //     },
  //   ],
  // };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {item.map((element: string, idx: number) => (
          <TableCell key={`idx${idx}`}>
            {element === "." ? "NA" : element}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {/*<Typography variant="h6" gutterBottom component="div">*/}
              {/*  Marker Name: {""}*/}
              {/*</Typography>*/}
              {item[8] === "nonsynonymous SNV" && scores !== null ? (
                <div className={classes.infos}>
                  <div className={classes.side_one}>
                    {scores.map((vals, index) => {
                      return (
                        <div key={index} className={classes.extra_info}>
                          <h3>{vals.name}</h3>
                          <p>Score: {vals.score === "." ? "NA" : vals.score}</p>
                          <p>
                            Rank Score:{" "}
                            {vals.rank_score === "." ? "NA" : vals.rank_score}
                          </p>
                          <p>
                            Prediction:{" "}
                            {vals.prediction === "." ? "NA" : vals.prediction}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div className={classes.image_box}>
                    {/*<div className={classes.image_one}>*/}
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={optionsBar}
                    />
                    {/*</div>*/}
                    {/*<div className={classes.image_two}>*/}
                    {/*  <HighchartsReact*/}
                    {/*    highcharts={Highcharts}*/}
                    {/*    options={optionsHist}*/}
                    {/*  />*/}
                    {/*</div>*/}
                  </div>
                </div>
              ) : (
                <p>This is not a nonsynonymous SNV or Results not available!</p>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default RowExtra;
