import { Core, Camelize, Operation, DateInput } from '@moralisweb3/common-core';
import { EvmAddress, EvmAddressish, EvmChainish, EvmChainResolver } from '@moralisweb3/common-evm-utils';
import { operations } from '../generated/types';

type OperationId = 'requestChallengeEvm';

type BodyParams = operations[OperationId]['requestBody']['content']['application/json'];
type RequestParams = BodyParams;

type SuccessResponse = operations[OperationId]['responses']['201']['content']['application/json'];

// Exports

export interface EvmRequestChallengeRequest extends Camelize<Omit<RequestParams, 'address' | 'chainId' | 'expirationTime' | 'notBefore'>> {
  address: EvmAddressish;
  chain: EvmChainish;
  expirationTime?: DateInput;
  notBefore?: DateInput;
}

export type EvmRequestChallengeJSONRequest = ReturnType<typeof serializeRequest>;

export type EvmRequestChallengeJSONResponse = SuccessResponse;

export type EvmRequestChallengeResponse = ReturnType<typeof deserializeResponse>;

export const evmRequestChallengeOperation: Operation<
  EvmRequestChallengeRequest,
  EvmRequestChallengeJSONRequest,
  EvmRequestChallengeResponse,
  EvmRequestChallengeJSONResponse
  > = {
  method: 'POST',
  name: 'EvmRequestChallenge',
  id: 'EvmRequestChallenge',
  groupName: 'auth',
  urlPathPattern: '/challenge/request/evm',

  getRequestUrlParams,
  getRequestBody,
  serializeRequest,
  deserializeRequest,
  deserializeResponse,
};

// Methods

function getRequestUrlParams() {
  return {};
}

function getRequestBody(request: EvmRequestChallengeRequest, core: Core) {
  return {
    domain: request.domain,
    chainId: EvmChainResolver.resolve(request.chain, core).decimal.toString(),
    address: EvmAddress.create(request.address, core).checksum,
    statement: request.statement,
    uri: request.uri,
    expirationTime: request.expirationTime,
    notBefore: request.notBefore,
    resources: request.resources,
    timeout: request.timeout,
  };
}

function deserializeResponse(jsonResponse: EvmRequestChallengeJSONResponse) {
  return jsonResponse;
}

function serializeRequest(request: EvmRequestChallengeRequest, core: Core) {
  return {
    domain: request.domain,
    chainId: EvmChainResolver.resolve(request.chain, core).decimal.toString(),
    address: EvmAddress.create(request.address, core).checksum,
    statement: request.statement,
    uri: request.uri,
    expirationTime: request.expirationTime,
    notBefore: request.notBefore,
    resources: request.resources,
    timeout: request.timeout,
  };
}

function deserializeRequest(jsonRequest: EvmRequestChallengeJSONRequest, core: Core): EvmRequestChallengeRequest {
  return {
    domain: jsonRequest.domain,
    chain: EvmChainResolver.resolve(jsonRequest.chainId, core),
    address: EvmAddress.create(jsonRequest.address, core),
    statement: jsonRequest.statement,
    uri: jsonRequest.uri,
    expirationTime: jsonRequest.expirationTime,
    notBefore: jsonRequest.notBefore,
    resources: jsonRequest.resources,
    timeout: jsonRequest.timeout,
  };
}
