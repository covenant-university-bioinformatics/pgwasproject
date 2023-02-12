import pgwasAxios from "../../axios-fetches";
import {
  getErrorMessage,
  showToastError,
  showToastMessage,
} from "./general_utils";
// import { FormikValues } from "formik";

export const submitToServer = (
  values: any,
  uploadFile: any,
  setLoading: any,
  apiPath: string,
  frontEndPath: string,
  username: string | undefined,
  props: any
) => {
  const data = new FormData();

  data.append("file", uploadFile);
  for (const element in values) {
    if (values.hasOwnProperty(element)) {
      // console.log(element + ": " + values[element].toString());
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
      const baseURL = props.match.url.split("/")[1];
      if (username) {
        props.history.push(`/${baseURL}/${frontEndPath}/all_results`);
      } else {
        props.history.push(
          `/${baseURL}/${frontEndPath}/result_view/${res.data.jobId}`
        );
      }
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
    // if (file.type === "text/plain") {
      reader.onloadend = () => {
        formik.setFieldValue("filename", event.target.files[0].name);
        setUploadFile(event.target.files[0]);

        formik.setFieldError("filename", undefined);
      };
      reader.readAsDataURL(file);
    // } else {
    //   formik.setFieldError("filename", "Please upload a text file");
    //   formik.setFieldValue("filename", undefined);
    // }
  } else {
    formik.setFieldError("filename", "Please upload a readable text file");
    formik.setFieldValue("filename", undefined);
  }
};
