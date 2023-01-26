export const getChainConfig = (
  chainId: string | null
): {
  chainId: number;
  target: string;
  apiKey: string;
  rpcUrl: string;
} => {
  if (chainId === "100") {
    return {
      apiKey: process.env.REACT_APP_SPONSOR_API_KEY_MAINNET!,
      chainId: 100,
      target: "0x2dd703a17170C1b03abC26C4D5dc56c9382c5292",
      rpcUrl: "https://rpc.gnosischain.com",
    };
  } else {
    return {
      apiKey: process.env.REACT_APP_SPONSOR_API_KEY!,
      chainId: 80001,
      target: "0xBf17E7a45908F789707cb3d0EBb892647d798b99",
      rpcUrl: "https://rpc-mumbai.maticvigil.com",
    };
  }
};