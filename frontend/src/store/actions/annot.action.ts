import { ActionType } from "../action-types";
import { AnnotationResult } from "../reducers/annot.reducer";

export type AnnotAction =
  | AnnotStartAction
  | AnnotSuccessAction
  | AnnotErrorAction;

interface AnnotStartAction {
  type: ActionType.ANNOTATION_RESULT_START;
}

interface AnnotSuccessAction {
  type: ActionType.ANNOTATION_RESULT_SUCCESS;
  payload: {
    data: AnnotationResult[];
    total: number;
  };
}

interface AnnotErrorAction {
  type: ActionType.ANNOTATION_RESULT_ERROR;
  payload: string;
}
