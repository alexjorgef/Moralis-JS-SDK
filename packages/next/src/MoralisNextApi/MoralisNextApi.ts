import { MoralisNextApiParams, MoralisNextHandlerParams } from './types';
import { RequestHandlerResolver } from './RequestHandlerResolver';
import Moralis from 'moralis';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOperationNames, moralisNextAuthHandler } from '../auth/moralisNextAuthHandler';
import { getModuleByName } from './Modules';

async function MoralisNextHandler({ req, res, authentication, core }: MoralisNextHandlerParams) {
  const [moduleName, operationName] = req.query.moralis as string[];

  try {
    const module = getModuleByName(moduleName);
    const operation = module.getOperationByName(operationName);
    const requestHandler = RequestHandlerResolver.tryResolve(module, operation);
    const deserialisedRequest = operation.deserializeRequest(req.body, core);

    let response;

    if (authOperationNames.includes(operationName)) {
      response = await moralisNextAuthHandler({ req, res, authentication, requestHandler, operation, core });
    } else {
      response = await requestHandler.fetch(deserialisedRequest);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ error: (e as Error).message });
  }
}

const MoralisNextApi = ({ authentication, ...config }: MoralisNextApiParams) => {
  if (!Moralis.Core.isStarted) {
    Moralis.start(config);
  }

  return async (req: NextApiRequest, res: NextApiResponse) =>
    MoralisNextHandler({ req, res, authentication, core: Moralis.Core });
};

export default MoralisNextApi;
