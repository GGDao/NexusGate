import React, {
  ReactNode,
  useEffect,
  useContext,
  createContext,
  useState,
} from "react";

import { addError } from "../store/slices/errorSlice";
import { useAppDispatch } from "../store/hooks";
import { TOKEN_ABI } from "../constants";

import { addTask } from "../store/slices/taskSlice";
import { ethers } from "ethers";
import { SafeEventEmitterProvider, UserInfo } from "@web3auth/base";
import {
  GaslessOnboarding,
  GaslessWalletConfig,
  GaslessWalletInterface,
  LoginConfig,
} from "@gelatonetwork/gasless-onboarding";
import { getChainConfig } from "../utils";
//Adding safe libraries
import Safe, { SafeFactory } from "@safe-global/safe-core-sdk";
import EthersAdapter from "@safe-global/safe-ethers-lib";

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
  logout?: Function;
  deployTeamSafe?: Function;
  tokenDeploy?: Function;
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
    console.log("running");
    const init = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const chainIdParam = queryParams.get("chainId");
        console.log(chainIdParam);
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
      // const counterContract = new ethers.Contract(
      //   "0xa6b71e26c5e0845f74c812102ca7114b6a896ab2",
      //   SAFE_CONTRACT_ABI,
      //   new ethers.providers.Web3Provider(web3AuthProvider!).getSigner()
      // );
      const counterContract = new ethers.Contract(
        contractConfig?.target!,
        TOKEN_ABI,
        new ethers.providers.Web3Provider(web3AuthProvider!).getSigner()
      );
      setCounterContract(counterContract);
      const fetchStatus = async () => {
        if (!counterContract || !gelatoSmartWallet) {
          return;
        }

        setCounter("0");
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

  const deployTeamSafe = async () => {
    // if (!smartWallet || !counterContract) {
    //   return;
    // }
    const signerWallet = new ethers.providers.Web3Provider(
      web3AuthProvider!
    ).getSigner();
    console.log("signerWallet", signerWallet);
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signerWallet,
    });

    setIsLoading(true);
    if (!smartWallet || !currentChain || !counterContract) return;
    try {
      console.log("TESTING");
      //await smartWallet.deployTeamSafe(counterContract.address);

      // console.log("safeFactory", safeFactory);
      // console.log(Object.keys(safeFactory));
      let singleton = "0x3E5c63644E683549055b9Be8653de26E0B4CD36E";
      let initializer =
        "0xb63e800d0000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000180000000000000000000000000f48f2b2d2a534e402487b3ee7c18c33aec0fe5e40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000e2b8651bf50913057ff47fc4f02a8e12146083b80000000000000000000000008c4827ebc999a0daa89e01c27de4a82426c8df240000000000000000000000000e481a40edc9f37280c1f1b2c703657052681b020000000000000000000000000000000000000000000000000000000000000000";
      let salt = "1680052484376511";
      console.log(counterContract);
      let { data } =
        await counterContract.populateTransaction.createProxyWithNonce(
          singleton,
          initializer,
          salt
        );
      console.log(data, "DATA");

      if (!data) return;
      const { taskId } = await smartWallet.sponsorTransaction(
        "0xa6b71e26c5e0845f74c812102ca7114b6a896ab2",
        data
      );
      console.log("taskId", taskId);
      console.log(smartWallet.getAddress())
      const safeFactory = await SafeFactory.create({ ethAdapter });
      const safeSdk = await safeFactory.deploySafe({
        safeAccountConfig: {
          threshold: 2,
          owners: [
            "0xe2b8651bF50913057fF47FC4f02A8e12146083B8",
            "0x8C4827Ebc999a0daa89E01C27dE4A82426C8df24",
            "0x0E481a40Edc9F37280c1f1B2C703657052681B02",
          ],
        },
        options: { 
          from: smartWallet.getAddress()
        }
      });
      console.log("safeSdk 2nd part", safeSdk);
      

      //dispatch(addTask(taskId));

      // let safeAddress = safeSdk.getAddress();
      // console.log("safeSdk address", safeAddress);
      setIsDeployed(true);
    } catch (error) {
      dispatch(addError((error as Error).message));
    } finally {
      setIsLoading(false);
    }
  };

  // const increment = async () => {
  //   if (!counterContract) {
  //     return dispatch(addError("Counter Contract is not initiated"));
  //   }
  //   let { data } = await counterContract.populateTransaction.increment();
  //   if (!data) {
  //     return dispatch(
  //       addError("Counter Contract Transaction Data could not get populated")
  //     );
  //   }
  //   if (!smartWallet) {
  //     return dispatch(addError("Smart Wallet is not initiated"));
  //   }
  //   try {
  //     const { taskId } = await smartWallet.sponsorTransaction(
  //       contractConfig?.target!,
  //       data
  //     );
  //     dispatch(addTask(taskId));
  //   } catch (error) {
  //     dispatch(addError((error as Error).message));
  //   }
  // };

  const tokenDeploy = async () => {
    if (!counterContract) {
      return dispatch(addError("Counter Contract is not initiated"));
    }
    let { data } = await counterContract.populateTransaction.create("Test", "TST");
    if (!data) {
      return dispatch(
        addError("Counter Contract Transaction Data could not get populated")
      );
    }
    if (!smartWallet) {
      return dispatch(addError("Smart Wallet is not initiated"));
    }
    try {
      const { taskId } = await smartWallet.sponsorTransaction(
        contractConfig?.target!,
        data
      );
      dispatch(addTask(taskId));
    } catch (error) {
      dispatch(addError((error as Error).message));
    }
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
    deployTeamSafe,
    tokenDeploy,
    smartWallet,
    user,
    wallet,
    counterContract,
    web3AuthProvider,
  };

  // Render the provider with the context value and children
  return (
    <GelatoContext.Provider value={contextValue}>
      {children}
    </GelatoContext.Provider>
  );
};
