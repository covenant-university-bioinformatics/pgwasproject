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

export const getErrorMessage = (error: any) => {
  let message = "Unable to perform action";
  if (error?.response) {
    if (Array.isArray(error.response.data?.message)) {
      message = error.response.data.message.join("\n");
    } else if (error?.response.data?.message) {
      message = error?.response.data?.message;
    } else {
      message = error.message;
    }
  }
  return message;
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

const replaceName = (value: string) => {
  switch (value) {
    case "D":
      return "Deleterious";
    case "B":
      return "Benign";
    case "T":
      return "Tolerated";
    case "P":
      return "Possibly Damaging";
    case "N":
      return "Neutral";
    default:
      return value;
  }
};

const replaceMutatationTaser = (value: string) => {
  //H: high; M: medium; L: low; N: neutral. H/M means functional and L/N means non-functional
  switch (value) {
    case "A":
      return "Disease causing automatic";
    case "D":
      return "Disease causing";
    case "N":
      return "Polymorphism";
    case "P":
      return "Polymorphism automatic";
    default:
      return value;
  }
};

const replaceMutatationAssesor = (value: string) => {
  //H: high; M: medium; L: low; N: neutral. H/M means functional and L/N means non-functional
  switch (value) {
    case "H":
      return "High";
    case "M":
      return "Medium";
    case "L":
      return "Low";
    case "N":
      return "Neutral";
    case "H/M":
      return "Functional";
    case "L/N":
      return "Non-functional";
    default:
      return value;
  }
};

export const createScoresObject = (headers: string[], scores: string[][]) => {
  const result = scores.map((rows, i) => {
    if (rows.every((row) => row === "na")) {
      return null;
    }
    if (rows.length < 10) {
      return null;
    }
    const sift = {
      name: "SIFT",
      score: rows[0],
      rank_score: rows[1],
      prediction: replaceName(rows[2]),
    };
    const polyphen_hvar = {
      name: "POLYPHEN HDIV",
      score: rows[3],
      rank_score: rows[4],
      prediction: replaceName(rows[5]),
    };
    const polyphen_hdiv = {
      name: "POLYPHEN HVAR",
      score: rows[6],
      rank_score: rows[7],
      prediction: replaceName(rows[8]),
    };
    const lrt = {
      name: "LRT",
      score: rows[9],
      rank_score: rows[10],
      prediction: replaceName(rows[11]),
    };
    const mutation_taser = {
      name: "MUTATION TASTER",
      score: rows[12],
      rank_score: rows[13],
      prediction: replaceMutatationTaser(rows[14]),
    };
    const mutation_assessor = {
      name: "MUTATION ASSESOR",
      score: rows[15],
      rank_score: rows[16],
      prediction: replaceMutatationAssesor(rows[17]),
    };
    const fathmm = {
      name: "FATHMM",
      score: rows[18],
      rank_score: rows[19],
      prediction: replaceName(rows[20]),
    };
    const provean = {
      name: "PROVEAN",
      score: rows[21],
      rank_score: rows[22],
      prediction: replaceName(rows[23]),
    };
    const vest3 = {
      name: "VEST3",
      score: rows[24],
      rank_score: rows[25],
      prediction:
        rows[24] === "."
          ? "."
          : parseFloat(rows[24]) >= 0.5
          ? "Deleterious"
          : "Benign",
    };
    const metasvm = {
      name: "METASVM",
      score: rows[26],
      rank_score: rows[27],
      prediction: replaceName(rows[28]),
    };
    const metalr = {
      name: "METALR",
      score: rows[29],
      rank_score: rows[30],
      prediction: replaceName(rows[31]),
    };
    const mcap = {
      name: "MCAP",
      score: rows[32],
      rank_score: rows[33],
      prediction: replaceName(rows[34]),
    };
    const cadd = {
      name: "CADD",
      score: rows[35],
      rank_score: rows[36],
      prediction:
        rows[35] === "."
          ? "."
          : parseFloat(rows[35]) >= 15
          ? "Deleterious"
          : "Benign",
    };
    const dann = {
      name: "DANN",
      score: rows[38],
      rank_score: rows[39],
      prediction:
        rows[38] === "."
          ? "."
          : parseFloat(rows[38]) >= 0.995
          ? "Deleterious"
          : "Benign",
    };
    const fathmmmkl = {
      name: "FATHMM MKL CODING",
      score: rows[40],
      rank_score: rows[41],
      prediction: replaceName(rows[42]),
    };
    const genocanyon = {
      name: "GENO CANYON",
      score: rows[46],
      rank_score: rows[47],
      prediction: parseFloat(rows[46]) >= 0.5 ? "Deleterious" : "Benign",
    };
    const gerp = {
      name: "GERP",
      score: rows[51],
      rank_score: rows[52],
      prediction:
        rows[51] === "."
          ? "."
          : parseFloat(rows[51]) >= 2
          ? "Deleterious"
          : "Benign",
    };
    return [
      sift,
      polyphen_hvar,
      polyphen_hdiv,
      lrt,
      mutation_taser,
      mutation_assessor,
      fathmm,
      provean,
      vest3,
      metasvm,
      metalr,
      mcap,
      cadd,
      dann,
      fathmmmkl,
      genocanyon,
      gerp,
    ];
  });
  return result;
};

export const createComponentTableHeaders = (
  headers: string[],
  stateUpdateFunction: any
) => {
  const dcd = headers.map((ele, i) => {
    return {
      id: ele.toLowerCase().replace(/['"]+/g, ""),
      label: ele.replace(/['"]+/g, ""),
      disableSorting: true,
    };
  });
  // dcd.unshift({ id: "123", label: "", disableSorting: true });
  stateUpdateFunction(dcd);
};

export const createComponentTableBody = (
  allines: string[],
  stateUpdateFunction: any
) => {
  const ddd = allines
    .filter((line) => line !== "")
    .slice(1)
    .map((list_string: string) => {
      return list_string.split("\t");
    });
  stateUpdateFunction(ddd);
};
