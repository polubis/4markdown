import { parseErrorV2 } from './parse-error-v2';

const parseMessage = (message: string): { symbol: string; message: string } => {
  const parsedV2Error = parseErrorV2(message);

  if (parsedV2Error.symbol !== `unknown`) {
    return {
      symbol: parsedV2Error.symbol,
      message:
        typeof parsedV2Error.content === `string`
          ? parsedV2Error.content
          : JSON.stringify(parsedV2Error.content),
    };
  }

  const match = message.match(/\[(.*?)\]/g);

  if (Array.isArray(match) && match.length === 2) {
    return {
      symbol: match[0].replace(/[[\]]/g, ``),
      message: match[1].replace(/[[\]]/g, ``),
    };
  }

  return {
    symbol: `unknown`,
    message,
  };
};

export { parseMessage };
