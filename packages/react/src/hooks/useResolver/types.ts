import { MoralisError } from '@moralisweb3/core';
import { IDefaultCallbacks } from '../types';
export interface IResolverCallbacks<TResponse> extends IDefaultCallbacks<TResponse> {
  _onComplete?: (response: TResponse | null) => void;
  _onError?: (error: MoralisError | null) => void;
  _onSuccess?: (response: TResponse) => void;
  _throwOnError?: boolean;
}

export interface IResolverParams {
  <TResponse = null>(func: () => Promise<TResponse>, params?: IResolverCallbacks<TResponse>): Promise<TResponse | null>;
}