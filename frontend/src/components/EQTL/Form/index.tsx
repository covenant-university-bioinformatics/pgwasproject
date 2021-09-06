import React, { useRef, useState } from "react";
import { FormikValues, useFormik } from "formik";
import pgwasAxios from "../../../axios-fetches";
import * as Yup from "yup";
import classes from "./index.module.scss";
import {
  getErrorMessage,
  selectIsError,
  showToastError,
  showToastMessage,
  textErrorHelper,
} from "../../utility/general_utils";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Hidden,
  InputLabel,
  NativeSelect,
  Paper,
  TextField,
} from "@material-ui/core";
import { generalFileForm, selectErrorHelper } from "../../utility/general";
import { PlayArrow, DeleteOutlineSharp } from "@material-ui/icons";
import { RouteComponentProps } from "react-router-dom";

type Props = {};

type UserFormData = {
  filename: string;
  job_name: string;
  marker_name: string | undefined;
  chromosome: string | undefined;
  position: string | undefined;
  p_value: string | undefined;
  sample_size: string | undefined;
  population: string;
  synonym: string;
  Adipose_Subcutaneous: boolean;
  Adipose_Visceral_Omentum: boolean;
  Adrenal_Gland: boolean;
  Artery_Aorta: boolean;
  Artery_Coronary: boolean;
  Artery_Tibial: boolean;
  Brain_Amygdala: boolean;
  Brain_Anterior_cingulate_cortex_BA24: boolean;
  Brain_Caudate_basal_ganglia: boolean;
  Brain_Cerebellar_Hemisphere: boolean;
  Brain_Cerebellum: boolean;
  Brain_Cortex: boolean;
  Brain_Frontal_Cortex_BA9: boolean;
  Brain_Hippocampus: boolean;
  Brain_Hypothalamus: boolean;
  Brain_Nucleus_accumbens_basal_ganglia: boolean;
  Brain_Putamen_basal_ganglia: boolean;
  Brain_Spinal_cord_cervical_c_1: boolean;
  Brain_Substantia_nigra: boolean;
  Breast_Mammary_Tissue: boolean;
  Cells_EBV_transformed_lymphocytes: boolean;
  Colon_Sigmoid: boolean;
  Colon_Transverse: boolean;
  Esophagus_Gastroesophageal_Junction: boolean;
  Esophagus_Mucosa: boolean;
  Esophagus_Muscularis: boolean;
  Heart_Atrial_Appendage: boolean;
  Heart_Left_Ventricle: boolean;
  Liver: boolean;
  Lung: boolean;
  Minor_Salivary_Gland: boolean;
  Muscle_Skeletal: boolean;
  Nerve_Tibial: boolean;
  Ovary: boolean;
  Pancreas: boolean;
  Pituitary: boolean;
  Prostate: boolean;
  Skin_Not_Sun_Exposed_Suprapubic: boolean;
  Skin_Sun_Exposed_Lower_leg: boolean;
  Small_Intestine_Terminal_Ileum: boolean;
  Spleen: boolean;
  Stomach: boolean;
  Testis: boolean;
  Thyroid: boolean;
  Uterus: boolean;
  Vagina: boolean;
  Whole_Blood: boolean;
  [key: string]: any;
};

const EQTLForm: React.FC<Props & RouteComponentProps> = (props) => {
  const [uploadFile, setUploadFile] = useState<any>(null);
  const fileInput = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  const formik = useFormik<UserFormData>({
    initialValues: {
      filename: "",
      job_name: "",
      marker_name: "",
      chromosome: "",
      position: "",
      p_value: "",
      sample_size: "",
      population: "",
      synonym: "",
      Adipose_Subcutaneous: false,
      Adipose_Visceral_Omentum: false,
      Adrenal_Gland: false,
      Artery_Aorta: false,
      Artery_Coronary: false,
      Artery_Tibial: false,
      Brain_Amygdala: false,
      Brain_Anterior_cingulate_cortex_BA24: false,
      Brain_Caudate_basal_ganglia: false,
      Brain_Cerebellar_Hemisphere: false,
      Brain_Cerebellum: false,
      Brain_Cortex: false,
      Brain_Frontal_Cortex_BA9: false,
      Brain_Hippocampus: false,
      Brain_Hypothalamus: false,
      Brain_Nucleus_accumbens_basal_ganglia: false,
      Brain_Putamen_basal_ganglia: false,
      Brain_Spinal_cord_cervical_c_1: false,
      Brain_Substantia_nigra: false,
      Breast_Mammary_Tissue: false,
      Cells_EBV_transformed_lymphocytes: false,
      Colon_Sigmoid: false,
      Colon_Transverse: false,
      Esophagus_Gastroesophageal_Junction: false,
      Esophagus_Mucosa: false,
      Esophagus_Muscularis: false,
      Heart_Atrial_Appendage: false,
      Heart_Left_Ventricle: false,
      Liver: false,
      Lung: false,
      Minor_Salivary_Gland: false,
      Muscle_Skeletal: false,
      Nerve_Tibial: false,
      Ovary: false,
      Pancreas: false,
      Pituitary: false,
      Prostate: false,
      Skin_Not_Sun_Exposed_Suprapubic: false,
      Skin_Sun_Exposed_Lower_leg: false,
      Small_Intestine_Terminal_Ileum: false,
      Spleen: false,
      Stomach: false,
      Testis: false,
      Thyroid: false,
      Uterus: false,
      Vagina: false,
      Whole_Blood: false,
    },

    validationSchema: Yup.object({
      filename: Yup.string().required("Please upload a file"),
      marker_name: Yup.number()
        .required("Marker name column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      chromosome: Yup.number()
        .required("Chromosome column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      position: Yup.number()
        .required("Position column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      p_value: Yup.number()
        .required("Effect Allele column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      sample_size: Yup.number()
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      job_name: Yup.string().required("Job name is required"),
      population: Yup.string().required("Please select a population"),
      synonym: Yup.string().required(
        "Please select how to handle similar SNPs"
      ),
    }),
    onSubmit: (values: FormikValues) => {
      const data = new FormData();
      data.append("file", uploadFile);
      for (const element in values) {
        if (values.hasOwnProperty(element)) {
          data.append(element, values[element]);
        }
      }
      setLoading(true);
      pgwasAxios
        .post("/eqtl/jobs", data)
        .then((res) => {
          // then print response status
          showToastMessage("Job submitted successfully");
          setLoading(false);
          props.history.push(
            `/${props.match.url.split("/")[1]}/eqtl/all_results`
          );
        })
        .catch((error) => {
          setLoading(false);
          showToastError(getErrorMessage(error));
        });
    },
  });

  const handleFileUploadChange = (event: any) => {
    let reader = new FileReader();
    let file = event.target.files[0];
    if (file) {
      if (file.type === "text/plain") {
        reader.onloadend = () => {
          formik.setFieldValue("filename", event.target.files[0].name);
          setUploadFile(event.target.files[0]);

          formik.setFieldError("filename", undefined);
        };
        reader.readAsDataURL(file);
      } else {
        formik.setFieldError("filename", "Please upload a text file");
      }
    } else {
      formik.setFieldError("filename", "Please upload a readable text file");
    }
  };

  const handleFileBlur = (event: any) => {
    if (event.target.files) {
      formik.setFieldError("filename", "Please upload a file");
      formik.setFieldTouched("filename");
    }
  };

  const handleRemove = (event: any) => {
    setUploadFile(null);
    formik.setFieldValue("filename", "");
    formik.setFieldError("filename", "Please upload a file");
    fileInput.current.querySelector("input").value = "";
  };

  const populations = [
    { variable: "afr", name: "AFR" },
    { variable: "eur", name: "EUR" },
    { variable: "amr", name: "AMR" },
    { variable: "eas", name: "EAS" },
    { variable: "sas", name: "SAS" },
  ];

  const synonyms = [
    { variable: "No", name: "NO" },
    { variable: "drop", name: "DROP" },
    { variable: "drop-dup", name: "DROP_DUP" },
    { variable: "skip", name: "SKIP" },
    { variable: "skip_dup", name: "SKIP_DUP" },
  ];

  const tissues = [
    { variable: "Adipose_Subcutaneous", name: "Adipose_Subcutaneous" },
    { variable: "Adipose_Visceral_Omentum", name: "Adipose_Visceral_Omentum" },
    { variable: "Adrenal_Gland", name: "Adrenal_Gland" },
    { variable: "Artery_Aorta", name: "Artery_Aorta" },
    { variable: "Artery_Coronary", name: "Artery_Coronary" },
    { variable: "Artery_Tibial", name: "Artery_Tibial" },
    { variable: "Brain_Amygdala", name: "Brain_Amygdala" },
    {
      variable: "Brain_Anterior_cingulate_cortex_BA24",
      name: "Brain_Anterior_cingulate_cortex_BA24",
    },
    {
      variable: "Brain_Caudate_basal_ganglia",
      name: "Brain_Caudate_basal_ganglia",
    },
    {
      variable: "Brain_Cerebellar_Hemisphere",
      name: "Brain_Cerebellar_Hemisphere",
    },
    { variable: "Brain_Cerebellum", name: "Brain_Cerebellum" },
    { variable: "Brain_Cortex", name: "Brain_Cortex" },
    { variable: "Brain_Frontal_Cortex_BA9", name: "Brain_Frontal_Cortex_BA9" },
    { variable: "Brain_Hippocampus", name: "Brain_Hippocampus" },
    { variable: "Brain_Hypothalamus", name: "Brain_Hypothalamus" },
    {
      variable: "Brain_Nucleus_accumbens_basal_ganglia",
      name: "Brain_Nucleus_accumbens_basal_ganglia",
    },
    {
      variable: "Brain_Putamen_basal_ganglia",
      name: "Brain_Putamen_basal_ganglia",
    },
    {
      variable: "Brain_Spinal_cord_cervical_c_1",
      name: "Brain_Spinal_cord_cervical_c-1",
    },
    { variable: "Brain_Substantia_nigra", name: "Brain_Substantia_nigra" },
    { variable: "Breast_Mammary_Tissue", name: "Breast_Mammary_Tissue" },
    {
      variable: "Cells_EBV_transformed_lymphocytes",
      name: "Cells_EBV-transformed_lymphocytes",
    },
    { variable: "Colon_Sigmoid", name: "Colon_Sigmoid" },
    { variable: "Colon_Transverse", name: "Colon_Transverse" },
    {
      variable: "Esophagus_Gastroesophageal_Junction",
      name: "Esophagus_Gastroesophageal_Junction",
    },
    { variable: "Esophagus_Mucosa", name: "Esophagus_Mucosa" },
    { variable: "Esophagus_Muscularis", name: "Esophagus_Muscularis" },
    { variable: "Heart_Atrial_Appendage", name: "Heart_Atrial_Appendage" },
    { variable: "Heart_Left_Ventricle", name: "Heart_Left_Ventricle" },
    { variable: "Liver", name: "Liver" },
    { variable: "Lung", name: "Lung" },
    { variable: "Minor_Salivary_Gland", name: "Minor_Salivary_Gland" },
    { variable: "Muscle_Skeletal", name: "Muscle_Skeletal" },
    { variable: "Nerve_Tibial", name: "Nerve_Tibial" },
    { variable: "Ovary", name: "Ovary" },
    { variable: "Pancreas", name: "Pancreas" },
    { variable: "Pituitary", name: "Pituitary" },
    { variable: "Prostate", name: "Prostate" },
    {
      variable: "Skin_Not_Sun_Exposed_Suprapubic",
      name: "Skin_Not_Sun_Exposed_Suprapubic",
    },
    {
      variable: "Skin_Sun_Exposed_Lower_leg",
      name: "Skin_Sun_Exposed_Lower_leg",
    },
    {
      variable: "Small_Intestine_Terminal_Ileum",
      name: "Small_Intestine_Terminal_Ileum",
    },
    { variable: "Spleen", name: "Spleen" },
    { variable: "Stomach", name: "Stomach" },
    { variable: "Testis", name: "Testis" },
    { variable: "Thyroid", name: "Thyroid" },
    { variable: "Uterus", name: "Uterus" },
    { variable: "Vagina", name: "Vagina" },
    { variable: "Whole_Blood", name: "Whole_Blood" },
  ];

  return (
    <div className={classes.eqtl_form}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <div className={classes.header_div}>
            <h2>Upload a file</h2>
          </div>
          <Grid className={classes.grid} item xs={6}>
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
          <Grid className={classes.grid} item xs={6}>
            <Paper elevation={0} className={classes.paper}>
              <FormControl className={classes.formControl}>
                <TextField
                  id={"job_name"}
                  variant={"outlined"}
                  label={"Job Name"}
                  size={"medium"}
                  {...formik.getFieldProps("job_name")}
                  {...textErrorHelper(formik, "job_name")}
                />
              </FormControl>
            </Paper>
          </Grid>
          <div className={classes.header_div}>
            <h2>Summary statistics column positions</h2>
          </div>
          {generalFileForm(classes, formik, [
            "marker_name",
            "chromosome",
            "position",
            "p_value",
            "sample_size",
          ])}
          <div className={classes.header_div}>
            <h2>Tool Parameters</h2>
          </div>
          <Grid className={classes.grid} item xs={12} sm={3}>
            <Paper variant="outlined" className={classes.paper}>
              <FormControl
                className={classes.formControl}
                error={selectIsError(formik, "population")}
              >
                <InputLabel htmlFor="population">Select Population</InputLabel>
                <NativeSelect
                  id="population"
                  {...formik.getFieldProps("population")}
                >
                  <option aria-label="None" value="" />
                  {populations.map((db, i) => (
                    <option key={i} value={db.variable}>
                      {db.name}
                    </option>
                  ))}
                </NativeSelect>
                {selectErrorHelper(formik, "population")}
              </FormControl>
            </Paper>
          </Grid>
          <Grid className={classes.grid} item xs={12} sm={3}>
            <Paper variant="outlined" className={classes.paper}>
              <FormControl
                className={classes.formControl}
                error={selectIsError(formik, "synonym")}
              >
                <InputLabel htmlFor="synonym">Select Population</InputLabel>
                <NativeSelect id="synonym" {...formik.getFieldProps("synonym")}>
                  <option aria-label="None" value="" />
                  {synonyms.map((db, i) => (
                    <option key={i} value={db.variable}>
                      {db.name}
                    </option>
                  ))}
                </NativeSelect>
                {selectErrorHelper(formik, "synonym")}
              </FormControl>
            </Paper>
          </Grid>
          <div className={classes.header_div}>
            <h2>Select tissues</h2>
          </div>
          <Grid className={classes.grid} item xs={12} sm={12}>
            <Paper variant="outlined" className={classes.paper}>
              <FormGroup row className={classes.db_list}>
                {tissues.map((data, index) => (
                  <FormControlLabel
                    className={classes.tissue}
                    key={`check_${index}`}
                    control={
                      <Checkbox
                        checked={formik.values[data.variable]}
                        {...formik.getFieldProps(data.variable)}
                      />
                    }
                    label={data.name}
                  />
                ))}
              </FormGroup>
            </Paper>
          </Grid>
        </Grid>
        <div className={classes.button_container}>
          {loading ? (
            <CircularProgress color="secondary" className="progress" />
          ) : (
            <Button
              className={classes.form_button}
              startIcon={<PlayArrow />}
              size="large"
              type={"submit"}
              variant="contained"
              color="primary"
              disabled={true}
            >
              {/*Execute <Hidden xsDown> Analysis</Hidden>*/}
              Coming Soon
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EQTLForm;
