import React, { useState } from "react";
import HomeLayout from "../../layouts/HomeLayout";
import classes from "../SignUp/index.module.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import pgwasAxios from "../../axios-fetches";
import {
  showToastError,
  showToastSuccess,
  textErrorHelper,
} from "../utility/general_utils";
import {
  Button,
  CircularProgress,
  FormControl,
  TextField,
} from "@material-ui/core";
import { SendRounded } from "@material-ui/icons";
import { RouteComponentProps } from "react-router-dom";
import otherClasses from "../ForgotPassword/index.module.scss";

type Props = {};

type QueryParam = {
  token: string;
};

const ChangePassword: React.FC<Props & RouteComponentProps<QueryParam>> = (
  props
) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSucess] = useState(false);
  const { token } = props.match.params;
  const formik = useFormik({
    initialValues: {
      password: "",
      password_repeat: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(5, "Minimum length of five")
        .max(20, "Max length of 20")
        .required("Password is required"),
      password_repeat: Yup.string()
        .min(5, "Minimum length of five")
        .max(20, "Max length of 20")
        .required("Password is required"),
    }),
    onSubmit: (values: any) => {
      if (values.password === values.password_repeat) {
        setLoading(true);
        pgwasAxios
          .post(`/auth/resetpassword/${token}`, values)
          .then((res) => {
            console.log(res.data);
            // then print response status
            if (res.data.success) {
              showToastSuccess(
                "Password change successful\nPlease kindly sign in"
              );
              setSucess(true);
            } else {
              setMessage("Password change failed");
              setSucess(false);
            }
            setLoading(false);
          })
          .catch((error) => {
            let message = "Password change failed";
            if (error?.response) {
              if (Array.isArray(error.response.data?.message)) {
                message = error.response.data.message.join("\n");
              } else {
                message = error?.response.data?.message;
              }
            }
            setLoading(false);
            showToastError(message);
            setMessage(message);
            setSucess(false);
          });
      } else {
        setMessage("Password not equal to Repeated password");
        setSucess(false);
      }
    },
  });
  return (
    <HomeLayout>
      <div className={classes.container}>
        {success ? (
          <div className={otherClasses.report}>
            <h3>Password change successful. Please sign in.</h3>
          </div>
        ) : (
          <>
            <h2>Enter new password</h2>
            {message ? (
              <div className={otherClasses.message}>{message}</div>
            ) : null}
            <form onSubmit={formik.handleSubmit}>
              <FormControl className={classes.formControl}>
                <TextField
                  id={"password"}
                  variant={"outlined"}
                  label={"Password"}
                  type={"password"}
                  size={"medium"}
                  {...formik.getFieldProps("password")}
                  {...textErrorHelper(formik, "password")}
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <TextField
                  id={"password_repeat"}
                  variant={"outlined"}
                  label={"Repeat Password"}
                  type={"password"}
                  size={"medium"}
                  {...formik.getFieldProps("password_repeat")}
                  {...textErrorHelper(formik, "password_repeat")}
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

export default ChangePassword;
