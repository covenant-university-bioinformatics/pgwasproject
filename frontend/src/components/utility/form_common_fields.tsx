import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  NativeSelect,
  Paper,
  TextField,
} from "@material-ui/core";
import Tooltip from "@mui/material/Tooltip";
import { selectIsError, textErrorHelper } from "./general_utils";
import { selectErrorHelper } from "./general";
import React from "react";
import {
  DeleteOutline,
  DeleteOutlineSharp,
  PlayArrow,
} from "@material-ui/icons";

type LoadTestDataProps = {
  classes: any;
  useTest: boolean;
  handleRemoveUseTest: any;
  handleUseTest: any;
};

export const LoadTestData: React.FC<LoadTestDataProps> = ({
  classes,
  useTest,
  handleRemoveUseTest,
  handleUseTest,
}: LoadTestDataProps) => {
  const result = useTest ? (
    <Button
      className={classes.test_button}
      startIcon={<DeleteOutline />}
      size="large"
      type={"button"}
      variant="contained"
      color="primary"
      onClick={handleRemoveUseTest}
    >
      Remove Test Data
    </Button>
  ) : (
    <Button
      className={classes.test_button}
      startIcon={<PlayArrow />}
      size="large"
      type={"button"}
      variant="contained"
      color="primary"
      onClick={handleUseTest}
    >
      Use Test Data
    </Button>
  );

  return result;
};

export const selectFieldsElement = (
  classes: any,
  formik: any,
  selectElement: { variable: string; name: string }[],
  selectVariable: string,
  selectName: string = "Option"
) => {
  return (
    <Grid className={classes.grid} item xs={12} sm={4}>
      <Paper variant="outlined" className={classes.paper}>
        <FormControl
          className={classes.formControl}
          error={selectIsError(formik, selectVariable)}
        >
          <InputLabel htmlFor={selectVariable}>
            Select a {selectName}
          </InputLabel>
          <NativeSelect
            id={selectVariable}
            {...formik.getFieldProps(selectVariable)}
          >
            <option aria-label="None" value="" />
            {selectElement.map((db, i) => (
              <option key={i} value={db.variable}>
                {db.name}
              </option>
            ))}
          </NativeSelect>
          {selectErrorHelper(formik, selectVariable)}
        </FormControl>
      </Paper>
    </Grid>
  );
};

type SelectFieldsElementProps = {
  classes: any;
  formik: any;
  selectElement: { variable: string; name: string }[];
  selectVariable: string;
  selectName: string;
  tooltip?: string;
};

const isVowel = (word: string) => {
  const vowels = "aeiouAEIOU";
  return vowels.indexOf(word[0]) !== -1;
};

export const SelectFieldsElement: React.FC<SelectFieldsElementProps> = ({
  classes,
  formik,
  selectElement,
  selectVariable,
  selectName,
  tooltip,
}: SelectFieldsElementProps) => {
  let article = isVowel(selectName) ? "an" : "a";
  // console.log(formik.getFieldProps(selectVariable));
  return (
    <Grid className={classes.grid} item xs={12} sm={4}>
      <Paper variant="outlined" className={classes.paper}>
        <FormControl
          className={classes.formControl}
          error={selectIsError(formik, selectVariable)}
        >
          <InputLabel htmlFor={selectVariable}>
            Select {article} {selectName}
          </InputLabel>
          {tooltip ? (
            <Tooltip title={tooltip} arrow>
              <NativeSelect
                id={selectVariable}
                {...formik.getFieldProps(selectVariable)}
              >
                <option aria-label="None" value="" />
                {selectElement.map((db, i) => (
                  <option key={i} value={db.variable}>
                    {db.name}
                  </option>
                ))}
              </NativeSelect>
            </Tooltip>
          ) : (
            <NativeSelect
              id={selectVariable}
              {...formik.getFieldProps(selectVariable)}
            >
              <option aria-label="None" value="" />
              {selectElement.map((db, i) => (
                <option key={i} value={db.variable}>
                  {db.name}
                </option>
              ))}
            </NativeSelect>
          )}
          {selectErrorHelper(formik, selectVariable)}
        </FormControl>
      </Paper>
    </Grid>
  );
};

export const commonTextElement = (
  classes: any,
  formik: any,
  label: string,
  textVariable: string,
  tooltip: string
) => {
  return (
    <Grid className={classes.grid} item={true} xs={12} sm={6} md={4}>
      <Paper elevation={0} className={classes.paper}>
        <FormControl className={classes.formControl}>
          <Tooltip title={tooltip} arrow>
            <TextField
              id={textVariable}
              variant={"outlined"}
              label={label}
              size={"medium"}
              {...formik.getFieldProps(textVariable)}
              {...textErrorHelper(formik, textVariable)}
            />
          </Tooltip>
        </FormControl>
      </Paper>
    </Grid>
  );
};

type CommonTextElementProps = {
  classes: any;
  formik: any;
  label: string;
  textVariable: string;
  tooltip?: string;
};

export const CommonTextElement: React.FC<CommonTextElementProps> = ({
  classes,
  formik,
  label,
  textVariable,
  tooltip,
}: CommonTextElementProps) => {
  return (
    <Grid className={classes.grid} item={true} xs={12} sm={6} md={4}>
      <Paper elevation={0} className={classes.paper}>
        <FormControl className={classes.formControl}>
          {tooltip ? (
            <Tooltip title={tooltip} arrow>
              <TextField
                id={textVariable}
                variant={"outlined"}
                label={label}
                size={"medium"}
                {...formik.getFieldProps(textVariable)}
                {...textErrorHelper(formik, textVariable)}
              />
            </Tooltip>
          ) : (
            <TextField
              id={textVariable}
              variant={"outlined"}
              label={label}
              size={"medium"}
              {...formik.getFieldProps(textVariable)}
              {...textErrorHelper(formik, textVariable)}
            />
          )}
        </FormControl>
      </Paper>
    </Grid>
  );
};

export const commonFileElement = (
  classes: any,
  formik: any,
  fileInput: any,
  handleFileUploadChange: any,
  handleFileBlur: any,
  handleRemove: any
) => {
  return (
    <Grid className={classes.grid} item={true} xs={12} sm={6} md={4}>
      <Paper elevation={0} className={classes.paper}>
        <FormControl
          error={selectIsError(formik, "filename")}
          className={classes.formControl}
        >
          <TextField
            id={"filename"}
            variant="outlined"
            size={"medium"}
            type={"file"}
            ref={fileInput}
            onChange={handleFileUploadChange}
            onBlur={handleFileBlur}
            {...textErrorHelper(formik, "filename")}
          />
        </FormControl>
        {!formik.errors.filename && formik.touched.filename && (
          <Button
            // className={classes.form_button}
            startIcon={<DeleteOutlineSharp />}
            size="small"
            type={"button"}
            variant="contained"
            color="primary"
            onClick={handleRemove}
          >
            remove
          </Button>
        )}
      </Paper>
    </Grid>
  );
};

type CommonFileElementProps = {
  classes: any;
  formik: any;
  fileInput: any;
  handleFileUploadChange: any;
  handleFileBlur: any;
  handleRemove: any;
};

export const CommonFileElement: React.FC<CommonFileElementProps> = ({
  classes,
  formik,
  fileInput,
  handleFileUploadChange,
  handleFileBlur,
  handleRemove,
}: CommonFileElementProps) => {
  return (
    <Grid className={classes.grid} item={true} xs={12} sm={6} md={4}>
      <Paper elevation={0} className={classes.paper}>
        <FormControl
          error={selectIsError(formik, "filename")}
          className={classes.formControl}
        >
          <TextField
            id={"filename"}
            variant="outlined"
            size={"medium"}
            type={"file"}
            ref={fileInput}
            onChange={handleFileUploadChange}
            onBlur={handleFileBlur}
            {...textErrorHelper(formik, "filename")}
          />
          <span>Max 300mb. If you have a file bigger than the limit, please "zip" it. Let there be only one file in the "zip" archive.</span>
        </FormControl>
        {/*{!formik.errors.filename && formik.touched.filename && (*/}
        {/*  <Button*/}
        {/*    // className={classes.form_button}*/}
        {/*    startIcon={<DeleteOutlineSharp />}*/}
        {/*    size="small"*/}
        {/*    type={"button"}*/}
        {/*    variant="contained"*/}
        {/*    color="primary"*/}
        {/*    onClick={handleRemove}*/}
        {/*  >*/}
        {/*    remove*/}
        {/*  </Button>*/}
        {/*)}*/}
      </Paper>
    </Grid>
  );
};
