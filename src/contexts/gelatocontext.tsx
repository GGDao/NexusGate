import React, {
  ReactNode,
  useEffect,
  useContext,
  createContext,
  useState,
} from "react";

import { addError } from "../store/slices/errorSlice";
import { useAppDispatch } from "../store/hooks";
import { COUNTER_CONTRACT_ABI } from "../constants";

import { ethers } from "ethers";
import { SafeEventEmitterProvider, UserInfo } from "@web3auth/base";
import {
  GaslessOnboarding,
  GaslessWalletConfig,
  GaslessWalletInterface,
  LoginConfig,
} from "@gelatonetwork/gasless-onboarding";
import { getChainConfig } from "../utils";

type GelatoType = {
  contractConfig?: {
    chainId: number;
    target: string;
  };
  currentChain?: {
    id: number;
    name: string;
  };
  gelatoLogin?: GaslessOnboarding | undefined;
  isLoading: boolean;
  counter: string;
  ethersInstance?: any;
  web3AuthProvider?: SafeEventEmitterProvider | null;
  smartWallet?: GaslessWalletInterface | null;
  counterContract?: ethers.Contract | null;
  user?: Partial<UserInfo> | null;
  wallet?: {
    address: string;
    balance: string;
    chainId: number;
  } | null;
  isDeployed: boolean;
  login?: Function;
  logout?: Function
};

// Create a new context
export const GelatoContext = createContext<GelatoType>({
  isLoading: false,
  counter: "0",
  isDeployed: false,
});

export const useGelato = () => {
  return useContext(GelatoContext);
};

type Props = {
  children: ReactNode;
};

// Create a provider component
export const GelatoProvider = ({ children }: Props) => {
  // Define your state variables here
  //

  const dispatch = useAppDispatch();

  const [contractConfig, setContractConfig] = useState<{
    chainId: number;
    target: string;
  }>();
  const [currentChain, setCurrentChain] = useState<{
    id: number;
    name: string;
  }>();
  const [gelatoLogin, setGelatoLogin] = useState<
    GaslessOnboarding | undefined
  >();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [counter, setCounter] = useState<string>("0");
  const [ethersInstance, setEthersInstance] = useState<any>();
  const [web3AuthProvider, setWeb3AuthProvider] =
    useState<SafeEventEmitterProvider | null>(null);
  const [smartWallet, setSmartWallet] = useState<GaslessWalletInterface | null>(
    null
  );
  const [counterContract, setCounterContract] =
    useState<ethers.Contract | null>(null);
  const [user, setUser] = useState<Partial<UserInfo> | null>(null);
  const [wallet, setWallet] = useState<{
    address: string;
    balance: string;
    chainId: number;
  } | null>(null);
  const [isDeployed, setIsDeployed] = useState<boolean>(false);

  useEffect(() => {
    console.log('running')
    const init = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const chainIdParam = queryParams.get("chainId");
        console.log(chainIdParam)
        const { apiKey, chainId, target, rpcUrl, name } =
          getChainConfig(chainIdParam);
        setCurrentChain({ name, id: chainId });

        const smartWalletConfig: GaslessWalletConfig = { apiKey };
        const loginConfig: LoginConfig = {
          domains: [window.location.origin],
          chain: {
            id: chainId,
            rpcUrl,
          },
          ui: {
            theme: "dark",
          },
          openLogin: {
            redirectUrl: `${window.location.origin}/?chainId=${chainId}`,
          },
        };
        const gelatoLogin = new GaslessOnboarding(
          loginConfig,
          smartWalletConfig
        );
        setContractConfig({ chainId, target });
        await gelatoLogin.init();
        setGelatoLogin(gelatoLogin);
        const provider = gelatoLogin.getProvider();
        if (provider) {
          setWeb3AuthProvider(provider);
        }
      } catch (error) {
        dispatch(addError((error as Error).message));
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!gelatoLogin || !web3AuthProvider) {
        return;
      }
      setIsLoading(true);
      const web3Provider = new ethers.providers.Web3Provider(web3AuthProvider!);
      setEthersInstance(web3Provider);
      const signer = web3Provider.getSigner();
      setWallet({
        address: await signer.getAddress(),
        balance: (await signer.getBalance()).toString(),
        chainId: await signer.getChainId(),
      });
      const user = await gelatoLogin.getUserInfo();
      setUser(user);
      const gelatoSmartWallet = gelatoLogin.getGaslessWallet();
      setSmartWallet(gelatoSmartWallet);
      setIsDeployed(await gelatoSmartWallet.isDeployed());
      const counterContract = new ethers.Contract(
        contractConfig?.target!,
        COUNTER_CONTRACT_ABI,
        new ethers.providers.Web3Provider(web3AuthProvider!).getSigner()
      );
      setCounterContract(counterContract);
      const fetchStatus = async () => {
        if (!counterContract || !gelatoSmartWallet) {
          return;
        }
        const counter = (await counterContract.counter()).toString();
        setCounter(counter);
        setIsDeployed(await gelatoSmartWallet.isDeployed());
      };
      await fetchStatus();
      const interval = setInterval(fetchStatus, 5000);
      setIsLoading(false);
      return () => clearInterval(interval);
    };
    init();
  }, [web3AuthProvider]);

  const login = async () => {
    if (!gelatoLogin) {
      return;
    }
    const web3authProvider = await gelatoLogin.login();
    setWeb3AuthProvider(web3authProvider);
  };

  const logout = async () => {
    if (!gelatoLogin) {
      return;
    }
    await gelatoLogin.logout();
    setWeb3AuthProvider(null);
    setWallet(null);
    setUser(null);
    setSmartWallet(null);
    setCounterContract(null);
  };

  // Define the value object that will be passed down to consumers
  const contextValue = {
    isLoading,
    counter,
    isDeployed,
    currentChain,
    ethersInstance,
    login,
    logout,
    smartWallet,
    user,
    wallet,
    counterContract,
    web3AuthProvider
  };

  // Render the provider with the context value and children
  return (
    <GelatoContext.Provider value={contextValue}>
      {children}
    </GelatoContext.Provider>
  );
};
