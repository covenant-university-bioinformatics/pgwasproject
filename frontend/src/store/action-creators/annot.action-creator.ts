import axios from "../../axios-fetches";
import { ActionType } from "../action-types";
import { AnnotAction } from "../actions/annot.action";
import { Dispatch } from "redux";

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
      let message = "";
      if (Array.isArray(error.response.data.message)) {
        message = error.response.data.message.join("\n");
      } else {
        message = error.response.data.message;
      }
      dispatch({
        type: ActionType.ANNOTATION_RESULT_ERROR,
        payload: message,
      });
    }
  };
};
