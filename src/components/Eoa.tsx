import { UserInfo } from "@web3auth/base";
export const Eoa: React.FC<{
  user: Partial<UserInfo> | null;
  wallet: { address: string; chainId: number } | null;
}> = (props) => {
  const { user, wallet } = props;
  return (
    <div className="flex flex-col gap-3 px-10 py-8 bg-[#808080] bg-opacity-30 rounded-lg shadow-md">
      {user && (
        <div className="flex flex-col gap-1 justify-between">
          <div>
            <p className="text-3xl font-bold text-yellow-300">EOA:</p>
          </div>
          {user.email && (
            <div className="flex flex-col gap-1">
              <p className="text-base font-medium text-yellow-300">Email:</p>
              <p className="text-base font-bold text-yellow-300">{user?.email}</p>
            </div>
          )}
        </div>
      )}
      <div>
        <div className="flex flex-row gap-1 justify-start text-yellow-300">
          <p className="text-lg font-medium">Address:</p>
          <p className="text-lg font-bold">{wallet?.address}</p>
        </div>
        <div className="flex flex-row gap-1 justify-start text-yellow-300">
          <p className="text-lg font-medium">Chain Id:</p>
          <p className="text-lg font-bold">{wallet?.chainId}</p>
        </div>
      </div>
    </div>
  );
};
