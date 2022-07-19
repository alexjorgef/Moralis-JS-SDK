import { AnyConnector, EvmAddress, EvmChain, EvmConnectionData, EvmProvider, MoralisError } from '@moralisweb3/core';
import { IEvmConnect } from './types';
import { IDefaultCallbacks } from '../../types';
import { useResolver } from '../../useResolver';
import { useState, useCallback, useEffect } from 'react';
import Evm from '@moralisweb3/evm';

export const _useMoralisEvm = () => {
  const resolver = useResolver();

  const [account, setAccount] = useState<EvmAddress | null>(null);
  const [chain, setChain] = useState<EvmChain | null>(null);
  const [connector, setConnector] = useState<AnyConnector | null>(null);
  const [error, setError] = useState<MoralisError | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [provider, setProvider] = useState<EvmProvider | null>(null);

  useEffect(() => {
    const handleConnect = ({ chain, account, connector, provider }: EvmConnectionData) => {
      setChain(chain);
      setAccount(account);
      setConnector(connector);
      setProvider(provider);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setChain(null);
      setAccount(null);
      setConnector(null);
      setProvider(null);
    };

    const handleChainChanged = (chain: EvmChain) => {
      setChain(chain);
    };

    const unsubAccountChanged = Evm.onAccountChanged(({ account }) => setAccount(account));
    const unsubChainChanged = Evm.onChainChanged(({ chain }) => handleChainChanged(chain));
    const unsubConnect = Evm.onConnected(handleConnect);
    const unsubDisconnect = Evm.onDisconnected(handleDisconnect);

    return () => {
      unsubAccountChanged();
      unsubChainChanged();
      unsubConnect();
      unsubDisconnect();
    };
  }, [Evm]);

  const connect = useCallback<IEvmConnect>(
    (connector, { onComplete, onError, onSuccess, throwOnError = false, ...rest } = {}) => {
      return resolver(
        () => {
          setIsConnecting(true);
          return Evm.connect(connector, rest);
        },
        {
          _onComplete: () => setIsConnecting(false),
          _onError: setError,
          _onSuccess: () => setIsConnected(true),
          onComplete,
          onError,
          onSuccess,
          throwOnError,
        },
      );
    },
    [],
  );

  const disconnect = useCallback(
    async ({ onComplete, onError, onSuccess, throwOnError = false }: IDefaultCallbacks<void>) => {
      return resolver(
        () => {
          setIsDisconnecting(true);
          return Evm.disconnect();
        },
        {
          _onComplete: () => setIsDisconnecting(false),
          _onError: setError,
          _onSuccess: () => setIsConnected(false),
          onComplete,
          onError,
          onSuccess,
          throwOnError,
        },
      );
    },
    [],
  );

  return {
    account,
    chain,
    connect,
    connector,
    disconnect,
    error,
    isConnected,
    isConnecting,
    isDisconnecting,
    provider,
  };
};