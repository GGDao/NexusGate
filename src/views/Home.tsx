import { useMemo, useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { ErrorMessage } from "../components/ErrorMessage";
import { Dropdown } from "../components/Dropdown";
import { useGelato } from "../contexts/gelatocontext";
import { LoginView } from "../views/LoginView";

export const Home = (props: {}) => {
  const error = useAppSelector((state) => state.error.message);
  const { currentChain, logout, web3AuthProvider } = useGelato();
  useEffect(() => {
    console.log(web3AuthProvider);
  }, [web3AuthProvider]);
  const render = useMemo(() => {
    return (
      <>
        {error && <ErrorMessage />}
        {web3AuthProvider && (
          <div className="flex justify-between p-5 gap-5 items-center bg-black">
            <button
              onClick={() => logout && logout()}
              className="px-4 py-1 border-2 border-[#b45f63] rounded-lg"
            >
              <p className="font-semibold text-white text-lg">Logout</p>
            </button>
          </div>
        )}
        <div
          className={`flex h-screen px-20 justify-left bg-cover bg-center ${"bg-[url('https://i.imgur.com/XzmM73B.jpg')]"}`}
        >
          <Dropdown chain={currentChain?.name!} />
          <LoginView />
        </div>
      </>
    );
  }, [web3AuthProvider, currentChain, error]);

  return <>{render}</>;
};
