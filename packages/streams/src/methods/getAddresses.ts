import { PaginatedOperationResolver } from '@moralisweb3/api-utils';
import { StreamNetwork } from '../utils/StreamNetwork';
import { IncorrectNetworkError } from '../utils/IncorrectNetworkError';
import {
  getAddressesEvmOperation,
  GetAddressesEvmRequest,
  GetAddressesEvmResponseAdapter,
} from '@moralisweb3/common-streams-utils';
import Core from '@moralisweb3/common-core';
import { CommonStreamNetworkOptions } from '../utils/commonNetworkOptions';

export interface GetAddressesEvmOptions extends GetAddressesEvmRequest, CommonStreamNetworkOptions {}

export type GetAddressesOptions = GetAddressesEvmOptions;

export const makeGetAddresses = (core: Core, baseUrl: string) => {
  const evmFetcher = new PaginatedOperationResolver(getAddressesEvmOperation, baseUrl, core).fetch;

  return ({ networkType, ...options }: GetAddressesOptions): Promise<GetAddressesEvmResponseAdapter> => {
    switch (networkType) {
      case StreamNetwork.EVM:
        return evmFetcher({ ...options });
      default:
        if (networkType === undefined) {
          return evmFetcher({ ...options });
        }
        throw new IncorrectNetworkError(networkType);
    }
  };
};
