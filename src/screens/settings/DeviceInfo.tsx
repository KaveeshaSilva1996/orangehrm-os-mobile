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
// import {DeviceInfo as dv} from 'react-native-device-info';



class DeviceInfo extends React.Component<PickLeaveRequestDaysProps> {
  constructor(props: PickLeaveRequestDaysProps) {
    super(props);
    // props.fetchAbout()
        
  }

  onRefresh = () => {
    this.render();
  };

  render() {
    // console.log(Platform.OS);
    const {
      theme,
      about,
    } = this.props;

    return (
      <MainLayout
      onRefresh={this.onRefresh}
      >
      <View style={{marginLeft:10,marginTop:20}}>
        <View style={styles.detailsViewBlock}>
          <View  style={styles.detailsViewLabel}>
            <Text>{"Device OS"}</Text>
          </View>
          <View  style={styles.detailsView}>
              <Text> {Platform.OS}</Text>
          </View>
        </View>

        <View style={styles.detailsViewBlock}>
          <View  style={styles.detailsViewLabel}>
            <Text>{"OS Version"}</Text>
          </View>
          <View  style={styles.detailsView}>
              {/* <Text> {dv.getSystemVersion()}</Text> */}
              <Text>{Platform.Version}</Text>
          </View>
        </View>
        </View>
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
  mainView: {
    flex: 1,
  },
  detailsView: {
    marginTop:1,
    marginLeft:10,
  },
  detailsViewBlock: {
    marginTop:15,
    marginLeft:10,
  },
  detailsViewLabel: {
    marginLeft:10,
  }});

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

