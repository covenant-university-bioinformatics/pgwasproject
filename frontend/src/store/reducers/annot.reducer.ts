import { ActionType } from "../action-types";
import { AnnotAction } from "../actions/annot.action";

export type AnnotationResult = {
  _id: string;
  status: string;
  job_name: string;
  createdAt: string;
};

interface AnnotState {
  loading: boolean;
  error: string | null;
  success: boolean;
  total: number;
  data: AnnotationResult[];
}

const initialState = {
  loading: false,
  error: null,
  success: false,
  total: 0,
  data: [],
};

const annotReducer = (
  state: AnnotState = initialState,
  action: AnnotAction
): AnnotState => {
  switch (action.type) {
    case ActionType.ANNOTATION_RESULT_START:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
        data: [],
      };
    case ActionType.ANNOTATION_RESULT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        success: true,
        data: action.payload.data,
        total: action.payload.total,
      };
    case ActionType.ANNOTATION_RESULT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
        data: [],
      };
    default:
      return state;
  }
};

export default annotReducer;
