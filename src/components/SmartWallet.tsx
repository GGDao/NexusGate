import { BlockExplorerDataType, getBlockExplorerUrl } from "../utils";

export const SmartWallet: React.FC<{
  address: string;
  isDeployed: boolean;
  chainId: number;
}> = (props) => {
  return (
    <div className="flex flex-col gap-1 my-5 px-10 py-8 bg-[#808080] bg-opacity-90 border-neutral-100 rounded-lg shadow-md">
      <div className="flex flex-col gap-3 justify-start items-start">
        <p className="text-3xl font-semibold text-yellow-300">
          Smart Wallet Address:
        </p>
        <a
          href={`${getBlockExplorerUrl(
            props.chainId,
            props.address,
            BlockExplorerDataType.Address
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="text-xl font-semibold text-yellow-300">{props.address}</p>
        </a>
        <p className="text-sm text-yellow-300">
          {props.isDeployed ? "Deployed" : "Not Deployed Yet"}
        </p>
      </div>
    </div>
  );
};
