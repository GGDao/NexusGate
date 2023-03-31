import React, { useEffect, useState } from "react";
import { useGelato } from "../contexts/gelatocontext";
import { Tasks } from "../components/Tasks";
import { useAppSelector } from "../store/hooks";
import { SAFE_CONTRACT_ABI, JSON_ABI } from "../constants";
import { ethers } from "ethers";

export const Profile = (props: {}) => {
  const { isLoading, user, ethersInstance, deployTeamSafe, tokenDeploy, teamSafe } =
    useGelato();
  console.log(user);
  const tasks = useAppSelector((state) => state.tasks.tasks);

  const [eoaAccounts, setEoaAccounts] = useState<string[]>([]);

  useEffect(() => {
    console.log(ethersInstance);
    const load = async () => {
      const accounts = await ethersInstance.listAccounts();
      setEoaAccounts(accounts);
    };
    load();
  }, [ethersInstance]);

  useEffect(() => {
    if (!ethersInstance || !tasks || tasks.length === 0) return;

    const load = async () => {
      const res = tasks.map(async (task) => {
        console.log(task);
        if (!task.details) return;

        const tx = await ethersInstance.getTransactionReceipt(
          task.details.txHash
        );
        if (tx.status === 1) {
          // Check if the transaction was successful
          const logs = tx.logs;
          if (logs.length > 0) {
            // Check if there are any logs
            const returnedData = logs[0].data;
            console.log(returnedData);
            const iface = new ethers.utils.Interface(JSON_ABI);
            const decodedData = iface.decodeFunctionResult(
              "createProxyWithNonce",
              returnedData
            );
            console.log(decodedData);
          }
        }
      });
    };
    load();
  }, [tasks, ethersInstance]);

  const safeLoadingView = (
    <div className="flex justify-center flex-col h-full w-full mt-5 gap-10">
      <div className="h-12">
        <>
          <p className="animate-pulse font-bold">
            This Safe Transaction Sponsored by GUStakes
          </p>
        </>
      </div>
    </div>
  );

  const buttonView = (
    <div className="flex justify-center flex-row items-center h-full w-1/3 mt-5 gap-5">
      <button
        className="w-1/2 bg-donut bg-blue-400 rounded-full px-12 py-2  text-black font-bold  md:mb-0"
        onClick={() => {
          if (!deployTeamSafe) return;
          deployTeamSafe();
        }}
      >
        Safe
      </button>
      <button
        className="w-1/2 bg-donut bg-blue-400 rounded-full px-12 py-2  text-black font-bold  md:mb-0"
        onClick={() => {
          if (!tokenDeploy) return;
          tokenDeploy();
        }}
      >
        Token Deploy
      </button>
    </div>
  );

  return (
    <div>
      {eoaAccounts.map((account) => {
        return (
          <>
            <h1>Account: {account}</h1>
            <h1>Name: {user?.name}</h1>
            <h1>Email: {user?.email}</h1>
            <button
              className="w-1/2 bg-donut bg-yellow-600 rounded-full px-12 py-2  text-black font-bold  md:mb-0"
              onClick={() => {
                if (!tokenDeploy) return;
                tokenDeploy();
              }}
            >
              Token Deploy
            </button>
            {!teamSafe ? null : <h1>Team Safe: {teamSafe}</h1> }
            <div>{!isLoading ? buttonView : safeLoadingView}</div>
            <Tasks />
          </>
        );
      })}
    </div>
  );
};
