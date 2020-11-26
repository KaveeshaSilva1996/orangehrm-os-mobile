/*
 * This file is part of OrangeHRM
 *
 * Copyright (C) 2020 onwards OrangeHRM (https://www.orangehrm.com/)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  TextInput as RNTextInput,
} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import MainLayout from 'layouts/MainLayout';
import withTheme, {WithTheme} from 'lib/hoc/withTheme';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {
  fetchPunchStatus,
  changePunchCurrentDateTime,
  setPunchNote,
  savePunchInRequest,
  savePunchOutRequest,
} from 'store/time/attendance/actions';
import {
  PunchRequest,
  PUNCHED_IN,
  PUNCHED_OUT,
  INITIAL,
} from 'store/time/attendance/types';
import {
  selectPunchStatus,
  selectPunchCurrentDateTime,
  selectSavedPunchNote,
} from 'store/time/attendance/selectors';
import Text from 'components/DefaultText';
import Divider from 'components/DefaultDivider';
import Button from 'components/DefaultButton';
import Icon from 'components/DefaultIcon';
import EditPunchInOutDateTimeCard from 'screens/time/components/EditPunchInOutDateTimeCardComponent';
import PunchInOutDateTimeCard from 'screens/time/components/PunchInOutDateTimeCardComponent';
import PickNote, {PickNoteFooter} from 'screens/time/components/NoteComponent';
import Card from 'components/DefaultCard';
import CardContent from 'components/DefaultCardContent';
import {
  calculateDurationUsingSavedFormat,
  getDateSaveFormatFromDateObject,
  formatLastRecordDetails,
  getCurrentTimeZoneOffset,
  NEGATIVE_DURATION,
} from 'lib/helpers/attendance';
import {TYPE_WARN} from 'store/globals/types';
import withGlobals, {WithGlobals} from 'lib/hoc/withGlobals';
import {selectCurrentRoute} from 'store/globals/selectors';
import {PUNCH} from 'screens/index';

class Punch extends React.Component<PunchProps, PunchState> {
  inputRef: RNTextInput | null;
  timeInterval: any;
  constructor(props: PunchProps) {
    super(props);
    this.inputRef = null;
    this.timeInterval = null;
    this.state = {
      typingNote: false,
      note: '',
      duration: '00:00',
    };
    props.fetchPunchStatus();
  }

  componentDidUpdate(prevProps: PunchProps) {
    if (
      prevProps.currentRoute !== this.props.currentRoute ||
      prevProps.punchStatus?.dateTimeEditable !==
        this.props.punchStatus?.dateTimeEditable
    ) {
      if (this.props.punchStatus?.dateTimeEditable === undefined) {
      }
      if (
        this.props.currentRoute === PUNCH &&
        this.timeInterval === null &&
        this.props.punchStatus?.dateTimeEditable === false
      ) {
        this.timeInterval = setInterval(this.onRefresh, 2000);
      } else {
        clearInterval(this.timeInterval);
        this.timeInterval = null;
      }
    }
    if (prevProps.punchCurrentDateTime !== this.props.punchCurrentDateTime) {
      if (
        this.props.punchStatus?.punchTime &&
        this.props.punchCurrentDateTime
      ) {
        let duration = this.calculateDuration(
          this.props.punchStatus?.punchTime,
          getDateSaveFormatFromDateObject(this.props.punchCurrentDateTime),
        );
        this.setState({duration: duration});
      }
    }
  }

  componentDidMount() {
    Keyboard.addListener('keyboardDidHide', this.hideCommentInput);
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidHide', this.hideCommentInput);
  }

  onRefresh = () => {
    this.props.fetchPunchStatus();
  };

  updateDateTime = (datetime: Date) => {
    this.props.changePunchCurrentDateTime(datetime);
  };

  setNote = (text: string) => {
    this.setState({
      note: text,
    });
  };
  toggleCommentInput = () => {
    if (this.state.typingNote === true) {
      this.hideCommentInput();
    } else {
      this.showCommentInput();
    }
  };

  onPressNote = () => {
    const {setPunchNote} = this.props;
    const {note} = this.state;
    setPunchNote(note);
    this.hideCommentInput();
  };

  showCommentInput = () => {
    this.setState({typingNote: true});
  };

  hideCommentInput = () => {
    this.setState({typingNote: false});
  };
  setLeaveComment = (text: string) => {
    this.setState({
      note: text,
    });
  };

  onPressPunchButton = () => {
    const {punchCurrentDateTime, savedNote} = this.props;
    if (punchCurrentDateTime !== undefined) {
      let punchRequest: PunchRequest = {
        timezoneOffset: getCurrentTimeZoneOffset(),
        note: savedNote ? savedNote : undefined,
        datetime: getDateSaveFormatFromDateObject(punchCurrentDateTime),
      };
      if (this.props.punchStatus?.punchState === PUNCHED_IN) {
        this.props.savePunchOutRequest({
          ...punchRequest,
        });
      } else if (this.props.punchStatus?.punchState === PUNCHED_OUT) {
        this.props.savePunchInRequest({
          ...punchRequest,
        });
      } else if (this.props.punchStatus?.punchState === INITIAL) {
        this.props.savePunchInRequest({
          ...punchRequest,
        });
      }
      this.setState({note: ''});
    }
  };

  calculateDuration = (datetime1: string, datetime2: string) => {
    let duration = calculateDurationUsingSavedFormat(datetime1, datetime2);
    if (duration === NEGATIVE_DURATION) {
      this.props.showSnackMessage(
        'Punch Out Time Should Be Later Than Punch In Time',
        TYPE_WARN,
      );
    }
    return duration;
  };

  render() {
    const {theme, punchStatus, punchCurrentDateTime, savedNote} = this.props;
    const {note} = this.state;
    const editable = punchStatus?.dateTimeEditable;

    const lastRecordDetails = formatLastRecordDetails(
      punchStatus?.punchTime,
      punchStatus?.PunchTimeZoneOffset,
    );

    return (
      <MainLayout
        onRefresh={this.onRefresh}
        footer={
          <View>
            {this.state.typingNote ? (
              <>
                <Divider />
                <PickNoteFooter
                  ref={(input) => {
                    this.inputRef = input;
                  }}
                  value={note}
                  onChangeText={this.setLeaveComment}
                  onPress={this.onPressNote}
                />
              </>
            ) : (
              <View
                style={{
                  paddingHorizontal: theme.spacing * 12,
                  paddingVertical: theme.spacing * 2,
                  backgroundColor: theme.palette.background,
                }}>
                <Button
                  title={
                    punchStatus?.punchState === PUNCHED_IN
                      ? 'Punch Out'
                      : 'Punch In'
                  }
                  primary
                  fullWidth
                  onPress={this.onPressPunchButton}
                />
              </View>
            )}
          </View>
        }>
        <View style={{marginLeft: theme.spacing, marginTop: theme.spacing * 5}}>
          {editable ? (
            <>
              <EditPunchInOutDateTimeCard
                punchCurrentDateTime={punchCurrentDateTime}
                updateDateTime={this.updateDateTime}
              />
            </>
          ) : (
            <PunchInOutDateTimeCard
              punchCurrentDateTime={punchCurrentDateTime}
            />
          )}
        </View>
        <View
          style={{
            paddingHorizontal: theme.spacing * 5,
            paddingBottom: theme.spacing * 4,
            paddingTop: theme.spacing * 3,
            paddingLeft: theme.spacing * 6,
          }}>
          <Card
            fullWidth
            style={{
              borderRadius: theme.borderRadius * 2,
            }}>
            <CardContent
              style={{
                paddingTop: theme.spacing * 2,
                paddingHorizontal: theme.spacing * 3,
              }}>
              {punchStatus?.punchState === PUNCHED_IN &&
              this.state.duration !== NEGATIVE_DURATION ? (
                <>
                  <View
                    style={[
                      {
                        paddingTop: theme.spacing * 4,
                      },
                      styles.durationMainView,
                    ]}>
                    <View style={[styles.durationText]}>
                      <View style={{marginRight: theme.spacing * 1.5}}>
                        <View
                          style={[
                            styles.briefcaseIcon,
                            {
                              backgroundColor: theme.palette.secondary,
                              borderRadius: theme.spacing * 7,
                            },
                          ]}>
                          <Icon
                            name={'briefcase'}
                            fontSize={18}
                            style={[
                              styles.colorWhite,
                              {padding: theme.spacing},
                            ]}
                          />
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.textBold,
                          {
                            color: theme.palette.secondary,
                            fontSize: theme.spacing * 5,
                          },
                        ]}>
                        {'Duration'}
                      </Text>
                    </View>
                    <View style={[styles.hoursView]}>
                      <View style={{paddingLeft: theme.spacing * 1.25}}>
                        <Text
                          style={[
                            styles.textBold,
                            {
                              color: theme.palette.secondary,
                              fontSize: theme.spacing * 5,
                            },
                          ]}>
                          {this.state.duration}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={[
                            styles.textBold,
                            {
                              color: theme.palette.secondary,
                              marginTop: theme.spacing,
                              fontSize: theme.spacing * 4,
                            },
                          ]}>
                          {' Hours'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              ) : null}

              {punchStatus?.punchState !== INITIAL ? (
                <>
                  <View style={{paddingBottom: theme.spacing * 3}}>
                    <View
                      style={[
                        styles.lastRecordDetailsMainView,
                        {
                          marginHorizontal: theme.spacing * 2.5,
                          marginVertical: theme.spacing * 2.5,
                          padding: theme.spacing * 0.75,
                          borderRadius: theme.spacing * 4,
                        },
                      ]}>
                      <View style={{paddingLeft: theme.spacing * 1.25}}>
                        <View style={[styles.lastPunchText]}>
                          {punchStatus?.punchState === PUNCHED_OUT ? (
                            <Text>{'Last Punch Out' + ' : '}</Text>
                          ) : null}
                          {punchStatus?.punchState === PUNCHED_IN ? (
                            <Text>{'Punched In at' + ' : '}</Text>
                          ) : null}
                        </View>
                      </View>
                      <View style={[styles.flexFour]}>
                        <Text>{lastRecordDetails}</Text>
                      </View>
                    </View>
                  </View>
                  <Divider />
                </>
              ) : null}
              <View
                style={[
                  styles.mainView,
                  {
                    paddingBottom: theme.spacing * 0.5,
                  },
                ]}>
                <View style={{paddingTop: theme.spacing * 5}}>
                  <PickNote
                    onPress={this.toggleCommentInput}
                    note={savedNote}
                  />
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </MainLayout>
    );
  }
}
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  noRecordsTextView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecordsText: {
    textAlign: 'center',
  },
  durationMainView: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },

  durationText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  briefcaseIcon: {
    width: 30,
    height: 30,
    alignItems: 'center',
  },

  textBold: {
    fontWeight: 'bold',
  },

  lastRecordDetailsMainView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f3f5',
  },

  lastPunchText: {
    flex: 2,
    flexDirection: 'column',
  },

  colorWhite: {
    color: 'white',
  },

  flexFour: {
    flex: 4,
  },
  flexTwo: {
    flex: 2,
  },
  flexThree: {
    flex: 3,
  },
  centerItems: {
    alignItems: 'center',
  },

  rowFlexDirection: {
    flexDirection: 'row',
  },
  hoursView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
});

interface PunchProps
  extends WithTheme,
    WithGlobals,
    ConnectedProps<typeof connector> {
  navigation: NavigationProp<ParamListBase>;
}

interface PunchState {
  note: string;
  typingNote: boolean;
  duration: string;
}

const mapStateToProps = (state: RootState) => ({
  punchStatus: selectPunchStatus(state),
  punchCurrentDateTime: selectPunchCurrentDateTime(state),
  savedNote: selectSavedPunchNote(state),
  currentRoute: selectCurrentRoute(state),
});

const mapDispatchToProps = {
  fetchPunchStatus,
  changePunchCurrentDateTime,
  setPunchNote,
  savePunchInRequest,
  savePunchOutRequest,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const PunchWithTheme = withTheme<PunchProps>()(Punch);

const PunchWithGlobals = withGlobals<PunchProps>()(PunchWithTheme);
export default connector(PunchWithGlobals);