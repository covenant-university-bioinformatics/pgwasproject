import * as Yup from "yup";
import { toast } from "react-toastify";

export const textErrorHelper = (formik: any, values: string) => ({
  error: formik.errors[values] && formik.touched[values],
  helperText:
    formik.errors[values] && formik.touched[values]
      ? formik.errors[values]
      : null,
});

export const selectIsError = (formik: any, value: string) => {
  return formik.errors[value] && formik.touched[value];
};

export const showToastError = (message: string) => {
  toast.error(message);
};

export const showToastSuccess = (message: string) => {
  toast.success(message);
};

export const showToastMessage = (message: string) => {
  toast.info(message);
};

export const generalFormValidationObject = {
  marker_name: Yup.number()
    .required("Marker name column number is required")
    .min(0, "The minimum is zero")
    .max(10, "the max is 10"),
  chromosome: Yup.number()
    .required("Chromosome column number is required")
    .min(0, "The minimum is zero")
    .max(10, "the max is 10"),
  position: Yup.number()
    .required("Position column number is required")
    .min(0, "The minimum is zero")
    .max(10, "the max is 10"),
  pvalue: Yup.number()
    .required("Pvalue column number is required")
    .min(0, "The minimum is zero")
    .max(10, "the max is 10"),
  effect_allele: Yup.number()
    .required("Effect Allele column number is required")
    .min(0, "The minimum is zero")
    .max(10, "the max is 10"),
  alternate_allele: Yup.number()
    .min(0, "The minimum is zero")
    .max(10, "the max is 10"),
  se: Yup.number().min(0, "The minimum is zero").max(10, "the max is 10"),
  or: Yup.number().min(0, "The minimum is zero").max(10, "the max is 10"),
  beta: Yup.number().min(0, "The minimum is zero").max(10, "the max is 10"),
};
