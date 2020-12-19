import { FETCH_ABOUT, FETCH_ABOUT_FINISHED, FetchAboutAction, FetchAboutFinishedAction, About } from './types';



export const fetchAbout = (): FetchAboutAction => ({
    type: FETCH_ABOUT,
});

export const fetchAboutFinished = (
    payload?: About,
    error: boolean = false,
): FetchAboutFinishedAction => ({
    type: FETCH_ABOUT_FINISHED,
    payload,
    error,
});
