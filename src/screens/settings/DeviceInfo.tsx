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
import {View, StyleSheet, Keyboard,Platform} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import SafeAreaLayout from 'layouts/SafeAreaLayout';
import MainLayout from 'layouts/MainLayout';
import withTheme, {WithTheme} from 'lib/hoc/withTheme';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {fetchAbout} from 'store/settings/about/actions';
import {selectAbout} from 'store/settings/about/selectors';
import Text from 'components/DefaultText';
import { Left } from 'native-base';



class DeviceInfo extends React.Component<PickLeaveRequestDaysProps> {
  constructor(props: PickLeaveRequestDaysProps) {
    super(props);
    // props.fetchAbout()
        
  }

  onRefresh = () => {
    // this.props.fetchAbout();
  };

  render() {
    
    console.log(Platform.OS);
    
    const {
      theme,
      about,
    } = this.props;

    return (


      <MainLayout
      onRefresh={this.onRefresh}
      >

      </MainLayout>
    );
  }
}

interface PickLeaveRequestDaysProps
  extends WithTheme,
    ConnectedProps<typeof connector> {
  navigation: NavigationProp<ParamListBase>;
}

const styles = StyleSheet.create({
  calendarView: {
    flex: 1,
    alignItems: 'center',
  },
  mainView: {
    flex: 1,
  },
  detailsView: {
    marginTop:15,
    marginLeft:60,
  }
});

const mapStateToProps = (state: RootState) => ({
  about: selectAbout(state),
});

const mapDispatchToProps = {
  fetchAbout,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const PickLeaveRequestDaysWithTheme = withTheme<PickLeaveRequestDaysProps>()(
  DeviceInfo, 
);

export default connector(PickLeaveRequestDaysWithTheme);

