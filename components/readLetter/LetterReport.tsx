import colors from '@/styles/colors';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSetRecoilState} from 'recoil';
import SvgIcon from '../svgIcon';
import {isShowLetterReportState} from './LetterReportState';

export const LetterReportIcon = () => {
  const setIsShowLetterReport = useSetRecoilState(isShowLetterReportState);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setIsShowLetterReport(true);
        }}>
        <SvgIcon name="Report" size={18} />
      </TouchableOpacity>
    </>
  );
};

const LetterReport = ({
  onClickReport,
  onClickCancel,
}: {
  onClickReport: () => any;
  onClickCancel: () => void;
}) => {
  const {
    LetterReportAlert,
    LetterReportWrapper,
    TextColor,
    Title,
    ButtonSize,
    ButtonsWrapper,
    ButtonBase,
    CancelButton,
    ReportButton,
    Description,
    DescriptionWrapper,
  } = LetterReportAlertStyle;

  return (
    <View style={LetterReportAlert}>
      <View style={{...LetterReportWrapper}}>
        <Text style={{...Title, ...TextColor}}>신고하기</Text>

        <View style={DescriptionWrapper}>
          <Text style={{...Description, ...TextColor}}>이 편지를 신고하시나요?</Text>
          <Text style={{...Description, ...TextColor}}>신고하면 편지는 가려지게 됩니다.</Text>
        </View>

        <View style={ButtonsWrapper}>
          <TouchableOpacity style={ButtonSize} onPress={onClickCancel}>
            <Text style={{...CancelButton, ...ButtonBase, ...TextColor}}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ButtonSize} onPress={onClickReport}>
            <Text style={{...ReportButton, ...ButtonBase, ...TextColor}}>신고하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LetterReport;

const LetterReportAlertStyle = StyleSheet.create({
  LetterReportAlert: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  LetterReportWrapper: {
    width: '80%',
    backgroundColor: colors.bg_3,
    paddingTop: 42,
    paddingBottom: 28,
    borderRadius: 16,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextColor: {
    textAlign: 'center',
    color: 'white',
  },
  Title: {
    fontSize: 20,
    fontWeight: '700',
  },

  DescriptionWrapper: {
    marginTop: 26,
  },

  Description: {
    fontSize: 16,
  },
  ButtonsWrapper: {
    width: '85%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 36,
  },
  ButtonSize: {
    width: '48%',
  },
  ButtonBase: {
    paddingTop: 18,
    paddingBottom: 18,
  },
  CancelButton: {
    fontSize: 16,
    fontWeight: '500',
    borderRadius: 8,
    backgroundColor: colors.primary_default,
  },
  ReportButton: {
    fontSize: 16,
    fontWeight: '500',
    borderRadius: 8,
    backgroundColor: colors.bg_4,
  },
});
