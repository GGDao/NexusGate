import React, { useEffect, useState } from "react";
import { useGelato } from "../contexts/gelatocontext";

export const Profile = (props: {}) => {
  const { isLoading, user, ethersInstance } = useGelato();
  console.log(user);

  const [eoaAccounts, setEoaAccounts] = useState<string[]>([]);

  useEffect(() => {
    console.log(ethersInstance);
    const load = async () => {
      const accounts = await ethersInstance.listAccounts();
      setEoaAccounts(accounts);
    };
    load();
  }, [ethersInstance]);

  return (
    <div>
      {eoaAccounts.map((account) => {
        return (
          <>
            <h1>Account: {account}</h1>
            <h1>Name: {user?.name}</h1>
            <h1>Email: {user?.email}</h1>
          </>
        );
      })}
    </div>
  );
};
