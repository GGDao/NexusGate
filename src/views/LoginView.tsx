import React from "react";
import { useGelato } from "../contexts/gelatocontext";
import { Spinner } from "reactstrap";
import { useNavigate } from "react-router-dom";

export const LoginView = (props: {}) => {
  const { web3AuthProvider, isLoading, login } = useGelato();
  const navigate = useNavigate();
  return (
    <div className="flex justify-center flex-col h-full w-full gap-10">
      <p className="text-3xl font-extrabold text-yellow-300">Welcome to,</p>
      <p className="text-5xl font-extrabold text-yellow-300">Nexus Gateway</p>
      <p className="text-md font-extrabold text-yellow-300 max-w-md">
        The ultimate platform for tokenizing e-sports teams and empowering
        players, teams, and fans alike. Our platform provides a wide range of
        functionality and benefits that elevate the e-sports experience to new
        heights.
      </p>
      {isLoading && <Spinner />}
      {!isLoading && (
        <div className="h-12">
          <button
            onClick={() => {
              if (!web3AuthProvider) {
                if (login) login();
              } else {
                navigate('/dashboard')
              }

            }}
            className="px-4 border-2 border-[#30838c] bg-yellow-300 rounded-lg"
          >
            <p className="px-4 py-1 font-semibold text-gray-800 text-lg">
              {!web3AuthProvider ? 'Login' : 'Enter'}
            </p>
          </button>
        </div>
      )}
    </div>
  );
};
