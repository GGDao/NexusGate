export const SUPPORTED_NETWORKS: { name: string; chainId: number }[] = [
  { name: "Mumbai", chainId: 80001 },
  { name: "Base Goerli", chainId: 84531 },
  { name: "Gnosis", chainId: 100 },
];

export const getChainConfig = (
  chainId: string | null
): {
  name: string;
  chainId: number;
  target: string;
  apiKey: string;
  rpcUrl: string;
} => {
  if (chainId === "100") {
    return {
      name: "Gnosis",
      apiKey: process.env.REACT_APP_SPONSOR_API_KEY_MAINNET!,
      chainId: 100,
      target: "0xCceb2cb52b27fdEC6211B705Cdb33345C3452143",
      rpcUrl: process.env.REACT_APP_GNOSIS_RPC_URL!,
    };
  } else if (chainId === "84531") {
    return {
      name: "Base Goerli",
      apiKey: process.env.REACT_APP_SPONSOR_API_KEY!,
      chainId: 84531,
      target: "0xFefDadb1c553a2d19ED43F6Aab0C7251470db1BA",
      rpcUrl: process.env.REACT_APP_BASEGOERLI_RPC_URL!,
    };
  } else {
    return {
      name: "Mumbai",
      apiKey: process.env.REACT_APP_SPONSOR_API_KEY!,
      chainId: 80001,
      target: "0x9228C7d6240D02EFBa841B84Ec667bfDc9E2EfDD",
      //target: "0x95C3C276C45FdDf0160139CfA9378160E1abe50A",
      rpcUrl: process.env.REACT_APP_MUMBAI_RPC_URL!,
    };
  }
};
