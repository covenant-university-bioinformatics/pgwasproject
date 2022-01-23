import React, { useRef, useState } from "react";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
// import classes from "./index.module.scss";
import classes from "../../utility/form_styles.module.scss";
import {
  Button,
  CircularProgress,
  Grid,
  Hidden,
  Paper,
} from "@material-ui/core";
import { generalFileForm } from "../../utility/general";
import { GetAppRounded, PlayArrow } from "@material-ui/icons";
import { RouteComponentProps } from "react-router-dom";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import {
  handleFileUploadChangedCommon,
  submitToServer,
} from "../../utility/form_common";
import {
  CommonTextElement,
  CommonFileElement,
  LoadTestData,
  SelectFieldsElement,
} from "../../utility/form_common_fields";

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
  gene_db: string;
  [key: string]: any;
};

const DeleteriousnessForm: React.FC<Props & RouteComponentProps> = (props) => {
  const { user } = useTypedSelector((state) => state.auth);
  const [uploadFile, setUploadFile] = useState<any>(null);
  const [useTest, setUseTest] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<UserFormData>();
  const fileInput = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    filename: "",
    job_name: "",
    ...(!user?.username && { email: "" }),
    useTest: false,
    marker_name: "",
    chromosome: "",
    position: "",
    effect_allele: "",
    alternate_allele: "",
    gene_db: "",
  };
  const testValues = {
    filename: "Test.txt",
    job_name: "Test Delet",
    ...(!user?.username && { email: "" }),
    useTest: true,
    marker_name: "6",
    chromosome: "1",
    position: "2",
    effect_allele: "4",
    alternate_allele: "5",
    gene_db: "refseq",
  };

  const formik = useFormik<UserFormData>({
    initialValues: formValues || initialValues,
    enableReinitialize: true,
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
        email: Yup.string().required("Email field is required").email(),
      }),
      gene_db: Yup.string().required("Please select a database"),
    }),
    onSubmit: (values: FormikValues) => {
      if (user?.username) {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "delet",
          "deleteriousness",
          user.username,
          props
        );
      } else {
        submitToServer(
          values,
          uploadFile,
          setLoading,
          "delet/noauth",
          "deleteriousness",
          undefined,
          props
        );
      }
    },
  });

  const handleUseTest = (event: any) => {
    formik.resetForm();
    setUseTest(true);
    setFormValues(testValues);
    fileInput.current.querySelector("input").disabled = true;
  };

  const handleRemoveUseTest = (event: any) => {
    setUseTest(false);
    setFormValues(undefined);
    formik.setFieldValue("filename", "");
    fileInput.current.querySelector("input").value = "";
    fileInput.current.querySelector("input").disabled = false;
    formik.resetForm();
  };

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

  const gene_dbs = [
    { variable: "refseq", name: "RefSeq" },
    { variable: "ucsc", name: "UCSC" },
    { variable: "ensembl", name: "Ensembl" },
  ];

  const dbs = [
    "whole-exome SIFT",
    "PolyPhen2 HDIV",
    "PolyPhen2 HVAR",
    "LRT",
    "MutationTaster",
    "MutationAssessor",
    "FATHMM",
    "PROVEAN",
    "MetaSVM",
    "MetaLR",
    "VEST",
    "M-CAP",
    "CADD",
    "GERP++",
    "DANN",
    "fathmm-MKL",
    "Eigen",
    "GenoCanyon",
    "fitCons",
    "PhyloP",
    "SiPhy",
  ];

  return (
    <div className={classes.job_form}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <LoadTestData
            classes={classes}
            useTest={useTest}
            handleUseTest={handleUseTest}
            handleRemoveUseTest={handleRemoveUseTest}
          />
          <Button
            type={"button"}
            variant="contained"
            color="primary"
            size={"small"}
            className={classes.button}
            endIcon={<GetAppRounded />}
            href={
              "https://drive.google.com/file/d/1SEDlM3EjXq4Mfdfvcp85j9rESBy3JXNT/view?usp=sharing"
            }
            target="_blank"
          >
            Download Test File
          </Button>
          <div className={classes.header_div}>
            <h2>Enter a Job Name</h2>
          </div>
          <CommonTextElement
            classes={classes}
            formik={formik}
            label={"Job Name"}
            textVariable={"job_name"}
          />
          {user?.username ? null : (
            <>
              <div className={classes.header_div}>
                <h2>Enter your email</h2>
              </div>
              <CommonTextElement
                classes={classes}
                formik={formik}
                label={"Email"}
                textVariable={"email"}
              />
            </>
          )}
          <div className={classes.header_div}>
            <h2>Upload a file</h2>
          </div>
          <CommonFileElement
            classes={classes}
            formik={formik}
            fileInput={fileInput}
            handleFileUploadChange={handleFileUploadChange}
            handleFileBlur={handleFileBlur}
            handleRemove={handleRemove}
          />
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
          <SelectFieldsElement
            classes={classes}
            formik={formik}
            selectElement={gene_dbs}
            selectVariable={"gene_db"}
            selectName={"Gene Annotation"}
          />
          <div className={classes.header_div}>
            <h2>Deleteriousness Databases</h2>
          </div>
          <Grid className={classes.grid} item xs={12} sm={12}>
            <Paper variant="outlined" className={classes.paper}>
              <ul className={classes.db_list}>
                {dbs.map((db, i) => (
                  <li key={i}>{db}</li>
                ))}
              </ul>
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

export default DeleteriousnessForm;
