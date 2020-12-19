import {RootState} from 'store';
import {createSelector} from 'reselect';

import { About, AboutState } from './types';


export const selectAboutState = (state: RootState) => state.about;

export const selectAbout = createSelector<
  RootState,
  AboutState,
  About | undefined
>([selectAboutState], (about) => about.about);
