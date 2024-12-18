import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useRecoilState, useResetRecoilState} from 'recoil';
import FilterButton, {IFilterButtonData} from './filterButton';
import {selectedIdState} from './store/selectedFilterId';

const filterList: IFilterButtonData[] = [
  {
    id: 'all',
    text: '전체',
  },
  {
    id: 'read',
    text: '읽음',
  },
  {
    id: 'unread',
    text: '읽지 않음',
  },
];

const FilterGroup = () => {
  const [selectedId, setSelectedId] = useRecoilState(selectedIdState);
  const resetSelectedId = useResetRecoilState(selectedIdState);

  const onPressFilterHandler = (id: string) => {
    setSelectedId(id);
  };

  useEffect(
    () => () => {
      resetSelectedId();
    },
    [resetSelectedId],
  );

  return (
    <View style={styles.FilterWrapper}>
      {filterList.map(filterData => {
        return (
          <FilterButton
            key={filterData.id}
            data={filterData}
            selectedId={selectedId}
            handleOnPress={onPressFilterHandler}
          />
        );
      })}
    </View>
  );
};

export default FilterGroup;

const styles = StyleSheet.create({
  FilterWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    marginTop: 14,
  },
});
