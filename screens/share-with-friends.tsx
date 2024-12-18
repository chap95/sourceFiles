import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import {FriendList} from '@/components/friend/friendList';
import axios from 'axios';
import {BASE_URL} from '@/utils/variables';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import {accessTokenState} from '@/states';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {WriteLetterParamList, HomeParamList} from '@/types/navigation-types';
import {NavigationProp, RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import qs from 'qs';

function ShareWithFriends() {
  const route = useRoute<RouteProp<WriteLetterParamList, 'ShareWithFriends'>>();
  const homeNavigation = useNavigation<NavigationProp<HomeParamList>>();
  const writeLetterNavigation = useNavigation<NavigationProp<WriteLetterParamList>>();
  const {letterId} = route.params;
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const currentAccessToken = useRecoilValue(accessTokenState);

  const handleItemSelect = useCallback(
    (index: string) => {
      if (selectedItems.includes(index)) {
        setSelectedItems(selectedItems.filter(i => i !== index));
      } else {
        setSelectedItems([...selectedItems, index]);
      }
    },
    [selectedItems],
  );

  const getFriendsAxios = async () => {
    const {data} = await axios.get(`${BASE_URL}friends`, {
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
      },
    });
    return data;
  };

  const friendsQuery = useQuery(['friends_list'], getFriendsAxios, {
    refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
    retry: 1, // 실패시 재호출 몇번 할지
    onSuccess: data => {
      console.log('ShareWithFriends friends_list success');
    },
    onError: e => {
      console.log('ShareWithFriends friends_list error', e);
    },
    onSettled: () => {
      console.log('ShareWithFriends friends_list end');
    },
  });

  const renderItem = useCallback(
    ({item}: any) => {
      const activeItem = selectedItems.includes(item.id);
      return (
        <FriendList
          item={item}
          //아이템을 클릭하면 selectedId가 변경
          onPress={() => handleItemSelect(item.id)}
          activeItem={activeItem}
        />
      );
    },
    [selectedItems, handleItemSelect],
  );

  const queryClient = useQueryClient();
  const submitLetter = async () => {
    try {
      const submitLetterResponse = await axios.post(
        `${BASE_URL}letters/${letterId}/send`,
        {
          params: {
            friendIds: selectedItems,
          },
          paramsSerializer: (params: any) => {
            return qs.stringify(params);
          },
        },
        {
          headers: {
            Authorization: `Bearer ${currentAccessToken}`,
          },
        },
      );
    } catch (e) {
      console.log('ShareWithFriends /letters/{letterId}/send post', e);
    }

    //3초 뒤에 실행
    const timer = setTimeout(() => {
      queryClient.resetQueries({queryKey: ['letters_counts']});
      homeNavigation.navigate('MailboxTopTab');
    }, 3000);

    writeLetterNavigation.navigate('WriteLetterComplete');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <FlatList
        data={friendsQuery.data?.content} //리스트의 소스를 담는 속성
        renderItem={renderItem} //data로 받은 소스의 아이템들을 render 시켜주는 콜백함수
        keyExtractor={item => item.id} //item의 고유의 키를 부여하는 속성
        extraData={selectedItems} //selectedId가 변경되면 리렌더링 되도록 하는 속성
      />
      <View style={styles.wrapper}>
        <TouchableOpacity
          onPress={submitLetter}
          style={
            selectedItems.length === 0
              ? styles.sendLetterBtnWrapper
              : styles.sendLetterBtnActivationWrapper
          }
          disabled={selectedItems.length === 0}>
          <View style={styles.sendLetterTextWrapper}>
            <Text
              style={
                selectedItems.length === 0 ? styles.sendLetterText : styles.sendLetterActivationText
              }>
              편지 보내기
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg_6, height: Dimensions.get('window').height},
  wrapper: {
    backgroundColor: colors.bg_6,
    paddingHorizontal: 10,
  },
  sendLetterBtnWrapper: {
    backgroundColor: colors.bg_4,
    borderRadius: 10,
    justifyContent: 'center',
    height: Dimensions.get('window').width / 8,
    width: Dimensions.get('window').width - 20,
    marginBottom: 10,
  },
  sendLetterText: {
    color: colors.text_3,
    fontWeight: '900',
    textAlign: 'center',
    marginLeft: 10,
  },
  sendLetterBtnActivationWrapper: {
    backgroundColor: colors.icon_point,
    borderRadius: 10,
    justifyContent: 'center',
    height: Dimensions.get('window').width / 8,
    width: Dimensions.get('window').width - 20,
    marginBottom: 10,
  },
  sendLetterTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendLetterActivationText: {
    color: colors.text_1,
    fontWeight: '900',
    textAlign: 'center',
    marginLeft: 10,
  },
});

export default ShareWithFriends;
