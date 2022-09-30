import { SWRConfiguration } from 'swr/dist/types';
import { UseEvmWalletTransactionsParams, UseEvmWalletTransactionsReturn } from './types'
import axios from 'axios'
import useSWR from 'swr';

export const useEvmWalletTransactions = (params: UseEvmWalletTransactionsParams, SWRConfig?: SWRConfiguration) => {
  const axiosFetcher = async (endpoint: string, fetcherParams: any) =>
    axios.post(`/api/moralis/${endpoint}`, fetcherParams).then((res) => res.data);

  const { data, error, mutate, isValidating } = useSWR<UseEvmWalletTransactionsReturn>(
    [`EvmApi/transaction/getWalletTransactions`, params],
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