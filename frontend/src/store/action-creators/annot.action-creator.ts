import axios from "../../axios-fetches";
import { ActionType } from "../action-types";
import { AnnotAction } from "../actions/annot.action";
import { Dispatch } from "redux";
import { getErrorMessage } from "../../components/utility/general_utils";

export const getAnnotationResults = (page: number, limit: number) => {
  return async (dispatch: Dispatch<AnnotAction>) => {
    dispatch({
      type: ActionType.ANNOTATION_RESULT_START,
    });

    try {
      const response = await axios.get(
        `/annot/jobs?page=${page + 1}&limit=${limit}`
      );
      dispatch({
        type: ActionType.ANNOTATION_RESULT_SUCCESS,
        payload: {
          data: response.data.data,
          total: response.data.total,
        },
      });
    } catch (error) {
      console.dir(error);
      console.log(getErrorMessage(error));
      dispatch({
        type: ActionType.ANNOTATION_RESULT_ERROR,
        payload: getErrorMessage(error),
      });
    }
  };
};
