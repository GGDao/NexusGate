import React from "react";
import { Loading } from "../components/Loading";
import { Eoa } from "../components/Eoa";
import { useGelato } from "../contexts/gelatocontext";
import { SmartWallet } from "../components/SmartWallet";

export const LoggedInView = () => {
  const { isDeployed, contractConfig, isLoading, user, wallet, smartWallet } =
    useGelato();

  if (isLoading || user === undefined || wallet === undefined)
    return <Loading />;

  return (
    <div className="flex flex-col h-full w-[700px] gap-2 py-10">
      <Eoa user={user} wallet={wallet} />
      {smartWallet?.isInitiated() && (
        <div className="flex justify-center flex-col gap-10">
          <SmartWallet
            address={smartWallet.getAddress()!}
            isDeployed={isDeployed}
            chainId={contractConfig?.chainId!}
          />
        </div>
      )}
    </div>
  );
};
