import React, { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@material-ui/icons";

type Props = {
  item: any;
  chromatinValues: {
    Chromatin_States: string;
    Chromatin_States_Imputed: string;
    Chromatin_Marks: string;
    DNAse: string;
    Proteins: string;
    Motifs: string;
    GENCODE_name: string;
    Promoter_histone_marks: string;
    Enhancer_histone_marks: string;
  };
  classes: any;
};

const HaploRRow: React.FC<Props> = ({
  item,
  chromatinValues,
  classes,
}: Props) => {
  const [open, setOpen] = useState(false);
  // console.log(item);
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
            {element === "."
              ? "NA"
              : element.length > 30
              ? `${element.substr(0, 31).replace(/['"]+/g, "")} ...`
              : element.replace(/['"]+/g, "")}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={15}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                More Results
              </Typography>
              <div className={classes.more_results}>
                <div>
                  <h3>Chromatin Marks</h3>
                  <ul>
                    {chromatinValues.Chromatin_Marks.replace(/['"]+/g, "")
                      .split(",")
                      .map((ele, idx) => (
                        <li key={`ele${idx}`}>
                          {ele === "" || ele === "." ? "NA" : ele}
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h3>Chromatin States</h3>
                  <ul>
                    {chromatinValues.Chromatin_States.replace(/['"]+/g, "")
                      .split(",")
                      .map((ele, idx) => (
                        <li key={`ele${idx}`}>
                          {ele === "" || ele === "." ? "NA" : ele}
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h3>Chromatin States Imputed</h3>
                  <ul>
                    {chromatinValues.Chromatin_States_Imputed.replace(
                      /['"]+/g,
                      ""
                    )
                      .split(",")
                      .map((ele, idx) => (
                        <li key={`ele${idx}`}>
                          {ele === "" || ele === "." ? "NA" : ele}
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h3>DNAse</h3>
                  <ul>
                    {chromatinValues.DNAse.replace(/['"]+/g, "")
                      .split(";")
                      .map((ele, idx) => (
                        <li key={`ele${idx}`}>
                          {ele === "" || ele === "." ? "NA" : ele}
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h3>Motifs</h3>
                  <ul>
                    {chromatinValues.Motifs.replace(/['"]+/g, "")
                      .split(";")
                      .map((ele, idx) => (
                        <li key={`ele${idx}`}>
                          {ele === "" || ele === "." ? "NA" : ele}
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h3>Proteins</h3>
                  <ul>
                    {chromatinValues.Proteins.replace(/['"]+/g, "")
                      .split(",")
                      .map((ele, idx) => (
                        <li key={`ele${idx}`}>
                          {ele === "" || ele === "." ? "NA" : ele}
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h3>Enhancer histone marks</h3>
                  <ul>
                    {chromatinValues.Enhancer_histone_marks.replace(
                      /['"]+/g,
                      ""
                    )
                      .split(",")
                      .map((ele, idx) => (
                        <li key={`ele${idx}`}>
                          {ele === "" || ele === "." ? "NA" : ele}
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h3>Promoter histone marks</h3>
                  <ul>
                    {chromatinValues.Promoter_histone_marks.replace(
                      /['"]+/g,
                      ""
                    )
                      .split(",")
                      .map((ele, idx) => (
                        <li key={`ele${idx}`}>
                          {ele === "" || ele === "." ? "NA" : ele}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default HaploRRow;
