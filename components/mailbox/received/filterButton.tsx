import colors from '@/styles/colors';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export interface IFilterButtonData {
  id: string;
  text: string;
}

const FilterButton = ({
  data,
  selectedId,
  handleOnPress,
}: {
  data: IFilterButtonData;
  selectedId: string;
  handleOnPress: (id: string) => void;
}) => {
  const usingButtonStyle = {
    ...buttonStyle.ButtonWrapper,
    ...(selectedId === data.id ? buttonStyle.ButtonSelected : buttonStyle.ButtonDefault),
  };

  const usingButtonTextStyle = {
    ...buttonStyle.ButtonText,
    ...(selectedId === data.id ? buttonStyle.ButtonTextSelected : buttonStyle.ButtonTextDefault),
  };

  return (
    <TouchableOpacity
      onPress={() => {
        handleOnPress(data.id);
      }}>
      <View style={usingButtonStyle}>
        <Text style={usingButtonTextStyle}>{data.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default FilterButton;

const buttonStyle = StyleSheet.create({
  ButtonWrapper: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 17,
    borderWidth: 1,
    borderStyle: 'solid',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  ButtonDefault: {
    borderColor: colors.ling_2,
  },
  ButtonSelected: {
    borderColor: colors.primary_default,
  },

  ButtonText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  ButtonTextDefault: {
    color: colors.text_2,
  },
  ButtonTextSelected: {
    color: 'white',
  },
});
