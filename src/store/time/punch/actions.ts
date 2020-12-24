import {
  FETCH_PUNCH_STATUS,
  FETCH_PUNCH_STATUS_FINISHED,
  CHANGE_PUNCH_CURRENT_DATE_TIME,
  PICK_PUNCH_NOTE,
  PUNCH_IN_REQUEST,
  PUNCH_OUT_REQUEST,
  FetchPunchStatusAction,
  FetchPunchStatusFinishedAction,
  ChangePunchCurrentDateTimeAction,
  SetPunchNoteAction,
  PunchInRequestAction,
  PunchOutRequestAction,
  ResetPunchStateAction,
  PunchStatus,
  RESET_PUNCH_STATE,
} from './types';
import {$PropertyType} from 'utility-types';

export const setPunchNote = (note: string): SetPunchNoteAction => ({
  type: PICK_PUNCH_NOTE,
  noteSaved: note,
});

export const fetchPunchStatus = (
  refresh?: boolean,
): FetchPunchStatusAction => ({
  type: FETCH_PUNCH_STATUS,
  refresh,
});

export const fetchPunchStatusFinished = (
  payload?: PunchStatus,
  error: boolean = false,
): FetchPunchStatusFinishedAction => ({
  type: FETCH_PUNCH_STATUS_FINISHED,
  payload,
  error,
});

export const changePunchCurrentDateTime = (
  datetime?: Date,
): ChangePunchCurrentDateTimeAction => ({
  type: CHANGE_PUNCH_CURRENT_DATE_TIME,
  punchCurrentDateTime: datetime,
});

export const savePunchInRequest = (
  payload: $PropertyType<PunchInRequestAction, 'payload'>,
): PunchInRequestAction => ({
  type: PUNCH_IN_REQUEST,
  payload,
});

export const savePunchOutRequest = (
  payload: $PropertyType<PunchOutRequestAction, 'payload'>,
): PunchOutRequestAction => ({
  type: PUNCH_OUT_REQUEST,
  payload,
});

export const resetPunchState = (): ResetPunchStateAction => ({
  type: RESET_PUNCH_STATE,
});
