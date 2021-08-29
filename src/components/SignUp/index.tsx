import React, { useState } from "react";
import HomeLayout from "../../layouts/HomeLayout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CircularProgress } from "@material-ui/core";
import classes from "./index.module.scss";
import { Button, FormControl, TextField } from "@material-ui/core";
import {
  showToastError,
  showToastSuccess,
  textErrorHelper,
} from "../utility/general_utils";
import pgwasAxios from "../../axios-fetches";
import { PersonAdd } from "@material-ui/icons";
import { RouteComponentProps } from "react-router-dom";

type Props = {};

type SignUpFormData = {
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
  [key: string]: any;
};

const SignUp: React.FC<Props & RouteComponentProps> = (props) => {
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const formik = useFormik<SignUpFormData>({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(5, "Minimum length of five")
        .max(20, "Max length of 20")
        .required("Username is required"),
      email: Yup.string().email().required("Email is required"),
      password: Yup.string()
        .min(5, "Minimum length of five")
        .max(20, "Max length of 20")
        .required("Password is required"),
    }),
    onSubmit: (values: SignUpFormData) => {
      setLoading(true);
      pgwasAxios
        .post("/auth/register", values)
        .then((res) => {
          // then print response status
          showToastSuccess(
            "Sign Up successful\nPlease kindly check your email to verify the registered email"
          );
          setLoading(false);
          setRegisterSuccess(true);
        })
        .catch((error) => {
          console.log(error?.response?.data);
          let message = "Registration failed";
          if (error?.response) {
            if (Array.isArray(error.response.data?.message)) {
              message = error.response.data.message.join("\n");
            } else {
              message = error?.response.data?.message;
            }
          }
          setLoading(false);
          showToastError(message);
        });
    },
  });

  return (
    <HomeLayout>
      <div className={classes.container}>
        {registerSuccess ? (
          <div className={classes.message}>
            <h3>
              Thank you for signing up! <br />
              Please kindly complete your registration by verifying your email.
              Kindly check your inbox for an email we sent. Incase your don't
              get it please also check your spam folder.
            </h3>
          </div>
        ) : (
          <>
            <h2>New Scientist Registration</h2>
            <form onSubmit={formik.handleSubmit}>
              <FormControl className={classes.formControl}>
                <TextField
                  id={"username"}
                  variant={"outlined"}
                  label={"Username"}
                  size={"medium"}
                  {...formik.getFieldProps("username")}
                  {...textErrorHelper(formik, "username")}
                />
              </FormControl>
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
              <div className={classes.button_container}>
                {loading ? (
                  <CircularProgress color="secondary" className="progress" />
                ) : (
                  <Button
                    className={classes.form_button}
                    startIcon={<PersonAdd />}
                    size="large"
                    type={"submit"}
                    variant="contained"
                    color="primary"
                  >
                    Sign Up
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

export default SignUp;
