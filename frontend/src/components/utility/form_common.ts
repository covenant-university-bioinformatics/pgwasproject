import pgwasAxios from "../../axios-fetches";
import {
  getErrorMessage,
  showToastError,
  showToastMessage,
} from "./general_utils";
import { FormikValues } from "formik";

export const submitToServer = (
  values: FormikValues,
  uploadFile: any,
  setLoading: any,
  apiPath: string,
  props: any
) => {
  const data = new FormData();
  data.append("file", uploadFile);
  for (const element in values) {
    if (values.hasOwnProperty(element)) {
      console.log(element + ": " + values[element].toString());
      data.append(element, values[element]);
    }
  }
  setLoading(true);
  pgwasAxios
    .post(`/${apiPath}/jobs`, data)
    .then((res) => {
      // then print response status
      showToastMessage("Job submitted successfully");
      setLoading(false);
      props.history.push(
        `/${props.match.url.split("/")[1]}/${apiPath}/all_results`
      );
    })
    .catch((error) => {
      setLoading(false);
      showToastError(getErrorMessage(error));
    });
};

export const handleFileUploadChangedCommon = (
  event: any,
  formik: any,
  setUploadFile: any
) => {
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
