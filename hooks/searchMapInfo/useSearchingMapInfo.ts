import {kakoApiServiceAxiosInstance} from '@/utils/axiosinstances';
import {useQuery} from '@tanstack/react-query';
import {useMemo} from 'react';
import {getParamsString} from '../../utils/utils';

export interface GetMapInfoParams {
  query: string | null;
  page?: number;
  size?: number;
}

export interface GetSearchByAddressParams {
  query: string;
  analyze_type?: 'similar' | 'exact';
  page?: number;
  size?: number;
}

export interface GetSearchByKeywordParams {
  query: string;
  page?: number;
  size?: number;
}

export interface GetSearchByAddressResponse {
  documents: SearchByAddressDocument[];
}

export interface GetSearchByKeywordResponse {
  documents: SearchByKeywordDocument[];
}

type ADDRESS_TYPE = 'REGION' | 'ROAD' | 'REGION_ADDR' | 'ROAD_ADDR';

export interface SearchByAddressDocument {
  address_name: string;
  address_type: ADDRESS_TYPE;
  x: string;
  y: string;
  address: LocalSearchAddress | null;
  road_address: LocalSearchRoadAddress | null;
}

export interface SearchByKeywordDocument {
  id: string;
  place_name: string;
  category_name: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
}

interface LocalSearchAddress {
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_3depth_h_name: string;
  h_code: string;
  b_code: string;
  mountain_yn: 'Y' | 'N';
  main_address_no: string;
  sub_address_no: string;
  x: string;
  y: string;
}

interface LocalSearchRoadAddress {
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  road_name: string;
  underground_yn: 'Y' | 'N';
  main_building_no: string;
  sub_building_no: string;
  building_name: string;
  zone_no: string;
  x: string;
  y: string;
}

export interface RefinedMapInfo {
  addressPrimary: string;
  addressSecondary: string;
  x: number;
  y: number;
}

function generateSearchMapInfoByAddress(params: GetMapInfoParams) {
  return ['searchMapInfoByAddress', params.query, params.page, params.size];
}

function generateSearchMapInfoByKeyword(params: GetMapInfoParams) {
  return ['searchMapInfoByKeyword', params.query, params.page, params.size];
}

async function getSearchByAddress(params: GetMapInfoParams) {
  const {data} = await kakoApiServiceAxiosInstance.get<GetSearchByAddressResponse>(
    `local/search/address?${getParamsString(params)}`,
  );

  return data;
}

async function getSearchByKeyword(params: GetMapInfoParams) {
  const {data} = await kakoApiServiceAxiosInstance.get<GetSearchByKeywordResponse>(
    `local/search/keyword?query=${params.query}&`,
  );

  return data;
}

function useSearchingMapInfoByAddress(params: GetMapInfoParams) {
  const {
    data: searchByKeywordData,
    isLoading,
    isError,
  } = useQuery(generateSearchMapInfoByKeyword(params), () => {
    if (params.query) {
      return getSearchByKeyword(params);
    }

    return null;
  });

  const {data: searchByAddressData} = useQuery(generateSearchMapInfoByAddress(params), () => {
    if (params.query) {
      return getSearchByAddress(params);
    }

    return null;
  });

  const refinedData: RefinedMapInfo[] | null = useMemo(() => {
    const tempData: RefinedMapInfo[] = [];

    // 키워드 검색결과
    if (searchByKeywordData && searchByKeywordData.documents) {
      searchByKeywordData.documents.forEach(document => {
        tempData.push({
          addressPrimary: document.place_name,
          addressSecondary: document.address_name,
          x: parseFloat(document.x),
          y: parseFloat(document.y),
        } as RefinedMapInfo);
      });
    }

    // 주소 검색결과
    if (searchByAddressData && searchByAddressData.documents) {
      searchByAddressData.documents.forEach(document => {
        if (document.road_address) {
          const {
            building_name,
            address_name,
            x,
            y,
            region_1depth_name,
            region_2depth_name,
            region_3depth_name,
            main_building_no,
            sub_building_no,
          } = document.road_address;

          tempData.push({
            addressPrimary: building_name ? building_name : address_name,
            addressSecondary:
              region_1depth_name +
              ' ' +
              region_2depth_name +
              ' ' +
              region_3depth_name +
              ' ' +
              main_building_no +
              ' ' +
              sub_building_no,
            x: parseFloat(x),
            y: parseFloat(y),
          });
        }
      });
    }

    return tempData.length > 0 ? tempData : null;
  }, [searchByKeywordData, searchByAddressData]);

  return {
    data: refinedData,
    isLoading,
    isError,
  };
}

export default useSearchingMapInfoByAddress;
