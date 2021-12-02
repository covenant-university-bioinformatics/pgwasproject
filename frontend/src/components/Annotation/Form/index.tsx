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
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import {
  commonFileElement,
  commonTextElement,
  selectFieldsElement,
} from "../../utility/form_common_fields";
import {
  handleFileUploadChangedCommon,
  submitToServer,
} from "../../utility/form_common";

type Props = {};

type UserFormData = {
  filename: string;
  job_name: string;
  email?: string;
  marker_name: string | undefined;
  chromosome: string | undefined;
  position: string | undefined;
  effect_allele: string | undefined;
  alternate_allele: string | undefined;
  cytoband: false;
  kgp_all: false;
  kgp_afr: false;
  kgp_amr: false;
  kgp_eas: false;
  kgp_eur: false;
  kgp_sas: false;
  exac: false;
  disgenet: false;
  clinvar: false;
  intervar: false;
  [key: string]: any;
};

const AnnotationForm: React.FC<Props & RouteComponentProps> = (props) => {
  const { user } = useTypedSelector((state) => state.auth);
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
      effect_allele: "",
      alternate_allele: "",
      gene_db: "",
      cytoband: false,
      kgp_all: false,
      kgp_afr: false,
      kgp_amr: false,
      kgp_eas: false,
      kgp_eur: false,
      kgp_sas: false,
      exac: false,
      disgenet: false,
      clinvar: false,
      intervar: false,
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
      effect_allele: Yup.number()
        .required("Effect Allele column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      alternate_allele: Yup.number()
        .required("Effect Allele column number is required")
        .min(1, "The minimum is one")
        .max(15, "the max is fifteen"),
      job_name: Yup.string().required("Job name is required"),
      ...(!user?.username && {
        email: Yup.string().email().required("Email field is required"),
      }),
      gene_db: Yup.string().required("Please select a database"),
    }),
    onSubmit: (values: FormikValues) => {
      if (user?.username) {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "annot",
          "annotation",
          user.username,
          props
        );
      } else {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "annot/noauth",
          "annotation",
          undefined,
          props
        );
      }
    },
  });

  const handleFileUploadChange = (event: any) => {
    handleFileUploadChangedCommon(event, formik, setUploadFile);
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

  const databases = [
    { variable: "cytoband", name: "Cytoband" },
    { variable: "kgp_all", name: "Frequency in 1KGP (ALL)" },
    { variable: "kgp_afr", name: "Frequency in 1KGP (AFR)" },
    { variable: "kgp_amr", name: "Frequency in 1KGP (AMR)" },
    { variable: "kgp_eur", name: "Frequency in 1KGP (EUR)" },
    { variable: "kgp_eas", name: "Frequency in 1KGP (EAS)" },
    { variable: "kgp_sas", name: "Frequency in 1KGP (SAS)" },
    { variable: "exac", name: "Exome Frequencies" },
    { variable: "disgenet", name: "DISGENET" },
    { variable: "clinvar", name: "CLINVAR" },
    { variable: "intervar", name: "INTERVAR" },
  ];

  const gene_dbs = [
    { variable: "refseq", name: "RefSeq" },
    { variable: "ucsc", name: "UCSC" },
    { variable: "ensembl", name: "Ensembl" },
  ];

  return (
    <div className={classes.annot_form}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <div className={classes.header_div}>
            <h2>Enter Job Name</h2>
          </div>
          {commonTextElement(classes, formik, "Job Name", "job_name")}
          {user?.username ? null : (
            <>
              <div className={classes.header_div}>
                <h2>Enter your email</h2>
              </div>
              {commonTextElement(classes, formik, "Email", "email")}
            </>
          )}
          <div className={classes.header_div}>
            <h2>Upload a file</h2>
          </div>
          {commonFileElement(
            classes,
            formik,
            fileInput,
            handleFileUploadChange,
            handleFileBlur,
            handleRemove
          )}
          <div className={classes.header_div}>
            <h2>Summary statistics column positions</h2>
          </div>
          {generalFileForm(classes, formik, [
            "marker_name",
            "chromosome",
            "position",
            "effect_allele",
            "alternate_allele",
          ])}
          <div className={classes.header_div}>
            <h2>Gene Annotation Database</h2>
          </div>
          {selectFieldsElement(
            classes,
            formik,
            gene_dbs,
            "gene_db",
            "Gene Annotation"
          )}
          <div className={classes.header_div}>
            <h2>Other Annotation Databases</h2>
          </div>
          <Grid className={classes.grid} item xs={12}>
            <Paper variant="outlined" className={classes.paper}>
              <FormGroup row>
                {databases.map((data, index) => (
                  <FormControlLabel
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
              disabled={!formik.isValid}
            >
              Execute <Hidden xsDown> Analysis</Hidden>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AnnotationForm;
