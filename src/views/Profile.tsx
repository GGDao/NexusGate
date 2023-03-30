import React, { useEffect, useState } from "react";
import { useGelato } from "../contexts/gelatocontext";
import { Tasks } from "../components/Tasks";
import { useAppSelector } from "../store/hooks";
import { SAFE_CONTRACT_ABI, JSON_ABI } from "../constants";
import { ethers } from "ethers";

export const Profile = (props: {}) => {
  const { isLoading, user, ethersInstance, deployTeamSafe, tokenDeploy } = useGelato();
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
            const decodedData = iface.decodeFunctionResult('createProxyWithNonce', returnedData);
            console.log(decodedData);
        
          }
        }
      });
    };
    load();
  }, [tasks, ethersInstance]);

  return (
    <div>
      {eoaAccounts.map((account) => {
        return (
          <>
            <h1>Account: {account}</h1>
            <h1>Name: {user?.name}</h1>
            <h1>Email: {user?.email}</h1>
            <button
              onClick={() => {
                if (!deployTeamSafe) return;
                deployTeamSafe();
              }}
            >
              Safe
            </button>
            <button
              onClick={() => {
                if (!tokenDeploy) return;
                tokenDeploy();
              }}
            >
              Token Deploy
            </button>
            <Tasks />
          </>
        );
      })}
    </div>
  );
};
