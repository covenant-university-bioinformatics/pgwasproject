import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  NativeSelect,
  Paper,
  TextField,
} from "@material-ui/core";
import { selectIsError, textErrorHelper } from "./general_utils";
import { selectErrorHelper } from "./general";
import React from "react";
import { DeleteOutlineSharp } from "@material-ui/icons";

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

export const commonTextElement = (
  classes: any,
  formik: any,
  label: string,
  textVariable: string
) => {
  return (
    <Grid className={classes.grid} item xs={12} sm={4}>
      <Paper elevation={0} className={classes.paper}>
        <FormControl className={classes.formControl}>
          <TextField
            id={textVariable}
            variant={"outlined"}
            label={label}
            size={"medium"}
            {...formik.getFieldProps(textVariable)}
            {...textErrorHelper(formik, textVariable)}
          />
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
    <Grid className={classes.grid} item xs={12} sm={4}>
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
