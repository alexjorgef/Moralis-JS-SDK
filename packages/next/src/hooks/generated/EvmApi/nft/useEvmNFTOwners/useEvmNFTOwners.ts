import { SWRConfiguration } from 'swr/dist/types';
import { UseEvmNftOwnersParams, UseEvmNftOwnersReturn } from './types'
import axios from 'axios'
import useSWR from 'swr';

export const useEvmNFTOwners = (params: UseEvmNftOwnersParams, SWRConfig?: SWRConfiguration) => {
  const axiosFetcher = async (endpoint: string, fetcherParams: any) =>
    axios.post(`/api/moralis/${endpoint}`, fetcherParams).then((res) => res.data);

  const { data, error, mutate, isValidating } = useSWR<UseEvmNftOwnersReturn>(
    [`EvmApi/nft/getNFTOwners`, params],
    axiosFetcher,
    SWRConfig,
  );

  return {
    data,
    error,
    refetch: async () => mutate(),
    isValidating,
  };
};