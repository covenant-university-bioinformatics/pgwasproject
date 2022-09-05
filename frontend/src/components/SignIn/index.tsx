import React, { useCallback, useEffect } from "react";
import HomeLayout from "../../layouts/HomeLayout";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import classes from "./index.module.scss";
import {
  Button,
  CircularProgress,
  FormControl,
  TextField,
} from "@material-ui/core";
import { showToastSuccess, textErrorHelper } from "../utility/general_utils";
import { ExitToAppSharp } from "@material-ui/icons";
import { RouteComponentProps, Link, Redirect } from "react-router-dom";
import { useActions } from "../../hooks/useActions";
import { useTypedSelector } from "../../hooks/useTypedSelector";

type Props = {};

type SignInFormData = {
  credential: string | undefined;
  password: string | undefined;
  [key: string]: any;
};

const SignIn: React.FC<
  Props & RouteComponentProps<{}, {}, { referrer: string }>
> = (props) => {
  const { signinUser, clearError } = useActions();

  const { loading, error, success, user } = useTypedSelector(
    (state) => state.auth
  );

  const signIn = useCallback(
    (user: { credential: string; password: string }) => {
      signinUser(user);
    },
    [signinUser]
  );

  const clearSignInError = useCallback(() => {
    clearError();
  }, [clearError]);

  let redirect: JSX.Element | null = null;
  if (success && user.username) {
    showToastSuccess(`Welcome ${user.username}`);
    const path = props?.location?.state?.referrer || "/admin";
    redirect = <Redirect to={path} />;
  }

  let message: JSX.Element | null = null;
  if (error) {
    message = (
      <div className={classes.message}>
        <h3>{error}</h3>
      </div>
    );
  }

  const formik = useFormik<SignInFormData>({
    initialValues: {
      credential: "",
      password: "",
    },

    validationSchema: Yup.object({
      credential: Yup.string()
        .min(5, "Minimum length of five")
        .max(40, "Max length of 20")
        .required("Username/Email is required"),
      password: Yup.string()
        .min(5, "Minimum length of five")
        .max(20, "Max length of 20")
        .required("Password is required"),
    }),
    onSubmit: (values: FormikValues) => {
      signIn({ credential: values.credential, password: values.password });
    },
  });

  useEffect(() => {
    return () => {
      clearSignInError();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {redirect}
      <HomeLayout>
        <div className={classes.container}>
          <h2>Please Sign in</h2>
          {message}
          <form onSubmit={formik.handleSubmit}>
            <FormControl className={classes.formControl}>
              <TextField
                id={"username"}
                variant={"outlined"}
                label={"Username/Email"}
                size={"medium"}
                {...formik.getFieldProps("credential")}
                {...textErrorHelper(formik, "credential")}
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
                <CircularProgress
                  color="secondary"
                  className={[classes.spinner, "progress"].join(" ")}
                />
              ) : (
                <Button
                  className={classes.form_button}
                  startIcon={<ExitToAppSharp />}
                  size="large"
                  type={"submit"}
                  variant="contained"
                  color="primary"
                >
                  Login
                </Button>
              )}
            </div>
          </form>
          <div className={classes.info}>
            <p>
              Not registered? Please sign up <Link to={"/sign_up"}>here</Link>
            </p>
          </div>
          <div className={classes.info}>
            <p>
              Forgot Password? Please reset{" "}
              <Link to={"/forgotpassword"}>here</Link>
            </p>
          </div>
        </div>
      </HomeLayout>
    </>
  );
};

export default SignIn;
