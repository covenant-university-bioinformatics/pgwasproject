import React, { useState } from "react";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import classes from "../SignUp/index.module.scss";
import otherClasses from "./index.module.scss";
import {
  Button,
  CircularProgress,
  FormControl,
  TextField,
} from "@material-ui/core";
import { showToastError, textErrorHelper } from "../utility/general_utils";
import HomeLayout from "../../layouts/HomeLayout";
import { SendRounded } from "@material-ui/icons";
import pgwasAxios from "../../axios-fetches";

type Props = {};

const ForgotPassword: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState("");
  const [success, setSucess] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email().required("Email is required"),
    }),
    onSubmit: (values: FormikValues) => {
      setLoading(true);
      pgwasAxios
        .post("/auth/forgotpassword", values)
        .then((res) => {
          // then print response status
          console.log(res.data);
          if (res.data.success === true) {
            setEmailSentSuccess("");
            setSucess(res.data.success);
          } else {
            setEmailSentSuccess("Password reset failed");
            setSucess(false);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log(error?.response?.data);
          let message = "Password reset failed";
          if (error?.response) {
            if (Array.isArray(error.response.data?.message)) {
              message = error.response.data.message.join("\n");
            } else {
              message = error?.response.data?.message;
            }
          }
          setLoading(false);
          setEmailSentSuccess(message);
          setSucess(false);
          showToastError(message);
        });
    },
  });

  return (
    <HomeLayout>
      <div className={classes.container}>
        {success ? (
          <div className={otherClasses.report}>
            <h3>
              Password reset successful. Please check your registered email for
              an email from us to help change your password.
            </h3>
          </div>
        ) : (
          <>
            <h2>Please enter registered email</h2>
            {emailSentSuccess ? (
              <div className={otherClasses.message}>{emailSentSuccess}</div>
            ) : null}
            <form onSubmit={formik.handleSubmit}>
              <FormControl className={classes.formControl}>
                <TextField
                  id={"email"}
                  variant={"outlined"}
                  label={"Email"}
                  size={"medium"}
                  {...formik.getFieldProps("email")}
                  {...textErrorHelper(formik, "email")}
                />
              </FormControl>
              <div className={classes.button_container}>
                {loading ? (
                  <CircularProgress color="secondary" className="progress" />
                ) : (
                  <Button
                    className={classes.form_button}
                    endIcon={<SendRounded />}
                    size="large"
                    type={"submit"}
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </HomeLayout>
  );
};

export default ForgotPassword;
