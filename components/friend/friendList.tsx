import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {CheckCircle, CheckNotCircle} from '@/assets';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';

// FIXME:
const DATA = [
  {
    id: '1',
    name: '멍멍멍멍멍멍멍멍멍',
    profileImageUrl: 'https://t1.daumcdn.net/cfile/tistory/24283C3858F778CA2E',
  },
  {
    id: '2',
    name: '생각',
    profileImageUrl: 'https://cdn.pixabay.com/photo/2017/09/25/13/12/puppy-2785074__480.jpg',
  },
  {
    id: '3',
    name: '멍2',
    profileImageUrl: 'https://t1.daumcdn.net/cfile/tistory/24283C3858F778CA2E',
  },
  {
    id: '4',
    name: '생각2',
    profileImageUrl: 'https://cdn.pixabay.com/photo/2017/09/25/13/12/puppy-2785074__480.jpg',
  },
  {
    id: '5',
    name: '멍3sdfsdfsdfs',
    profileImageUrl: 'https://t1.daumcdn.net/cfile/tistory/24283C3858F778CA2E',
  },
  {
    id: '6',
    name: '생각3',
    profileImageUrl: 'https://cdn.pixabay.com/photo/2017/09/25/13/12/puppy-2785074__480.jpg',
  },
  {
    id: '7',
    name: '멍4',
    profileImageUrl: 'https://t1.daumcdn.net/cfile/tistory/24283C3858F778CA2E',
  },
  {
    id: '8',
    name: '생각4',
    profileImageUrl: 'https://cdn.pixabay.com/photo/2017/09/25/13/12/puppy-2785074__480.jpg',
  },
  {
    id: '9',
    name: '생각생각생각생각생각',
    profileImageUrl: 'https://cdn.pixabay.com/photo/2017/09/25/13/12/puppy-2785074__480.jpg',
  },
];

const FriendList = ({
  item,
  onPress,
  activeItem,
}: {
  item: {id: string; name: string; profileImageUrl: string};
  onPress: any;
  activeItem: boolean;
}) => {
  return (
    <Pressable onPress={onPress} style={styles.itemWrapper}>
      <View style={styles.imageNameWrapper}>
        <View>
          <Image style={styles.profileImage} source={{uri: item.profileImageUrl}} />
        </View>
        <View>
          <Text style={styles.nameText}>{item.name}</Text>
        </View>
      </View>
      <View>
        {activeItem ? (
          <CheckCircle width={20} height={20} />
        ) : (
          <CheckNotCircle width={20} height={20} />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  imageNameWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 150,
    height: 56,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 100,
    marginRight: 20,
  },
  nameText: {
    color: colors.text_1,
    fontSize: fonts.body2.fontSize,
  },
});

export {FriendList, DATA};
