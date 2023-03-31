import { useEffect, useState, useMemo, useCallback } from "react";
import { Box, Container } from "@mui/system";
import { Input, Button } from "@mui/material";
import createTeam from "../utils/createTeam";
import { useGelato } from "../contexts/gelatocontext";

function validateEmail(email: string) {
  let res = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return res.test(email);
}

export const CreateTeam = (props: {}) => {
  const [teamData, setTeamData] = useState<Record<string, any>>();
  const [teamMemberInputs, setTeamMemberInputs] =
    useState<Record<string, string>>();
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [creatorAddress, setCreatorAddress] = useState<string>();

  const { user, ethersInstance, wallet } = useGelato();

  const handleAddTeamMember = useCallback(
    (index: string) => {
      console.log(teamMemberInputs, index);
      if (!teamMemberInputs) return;
      const val = teamMemberInputs[index];
      if (!validateEmail(val))
        return alert("Please input a valid email address");
      setTeamMembers([...teamMembers, val]);
    },
    [teamMemberInputs]
  );

  useEffect(() => {
    const load = async () => {
      const network = await ethersInstance.getNetwork();
      const account = await ethersInstance.listAccounts();
      console.log(account)
      setCreatorAddress(account[0]);
    };
    if (ethersInstance) load();
  }, [ethersInstance]);

  const handleSubmit = useCallback(async () => {
    console.log(user, creatorAddress, teamMembers, wallet);
    if (!user || !creatorAddress || teamMembers.length === 0 || !wallet)
      return alert("missing info!");

    const newTeam = {
      team_name: teamData?.name,
      team_token_name: teamData?.tokenName,
      team_token_symbol: teamData?.tokenSymbol,
      creator_email: user.email,
      creator_address: creatorAddress,
      pending_invites: teamMembers,
      network: wallet.chainId,
    };

    await createTeam(newTeam);
    alert("submitted");
  }, [user, creatorAddress, teamData, teamMembers, wallet]);

  const renderMemeberInput = useMemo(() => {
    const res = [];
    for (let i = 0; i <= teamMembers.length - 1; i++) {
      if (i === teamMembers.length - 1) {
        res.push(
          <>
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Input
                autoFocus
                name={`${i}`}
                value={teamMembers[i]}
                onChange={(e) =>
                  setTeamMemberInputs({
                    ...teamMemberInputs,
                    [e.target.name]: e.target.value,
                  })
                }
                placeholder="Enter Member Email"
                sx={{ mr: 1, fontWeight: "fontWeightBold" }}
              />
            </Box>

            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Input
                autoFocus
                name={`${i + 1}`}
                onChange={(e) =>
                  setTeamMemberInputs({
                    ...teamMemberInputs,
                    [e.target.name]: e.target.value,
                  })
                }
                placeholder="Enter Member Email"
                sx={{ mr: 1, fontWeight: "fontWeightBold" }}
              />
              <span onClick={() => handleAddTeamMember(`${i + 1}`)}>
                plus icon{" "}
              </span>
            </Box>
          </>
        );
      } else {
        res.push(
          <Box sx={{ my: 1.5, px: 2.5 }}>
            <Input
              autoFocus
              name={`${i}`}
              onChange={(e) =>
                setTeamMemberInputs({
                  ...teamMemberInputs,
                  [e.target.name]: e.target.value,
                })
              }
              value={teamMembers[i]}
              placeholder="Enter Member Email"
              sx={{ mr: 1, fontWeight: "fontWeightBold" }}
            />
          </Box>
        );
      }
    }

    if (res.length === 0) {
      return (
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Input
            autoFocus
            type="email"
            name={`${0}`}
            onChange={(e) => {
              setTeamMemberInputs({
                ...teamMemberInputs,
                [e.target.name]: e.target.value,
              });
            }}
            placeholder="Enter Member Email"
            sx={{ mr: 1, fontWeight: "fontWeightBold" }}
          />
          <span onClick={() => handleAddTeamMember(`${0}`)}>plus icon </span>
        </Box>
      );
    }
    return res;
  }, [teamMembers, teamMemberInputs]);

  const handleChange = (e: any) => {
    setTeamData({
      ...teamData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Container sx={{ my: 5 }}>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Input
            autoFocus
            onChange={handleChange}
            fullWidth
            name="name"
            placeholder="Enter Team Name"
            sx={{ mr: 1, fontWeight: "fontWeightBold" }}
          />
        </Box>

        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Input
            autoFocus
            onChange={handleChange}
            fullWidth
            name="tokenName"
            placeholder="Enter Team Token Name"
            sx={{ mr: 1, fontWeight: "fontWeightBold" }}
          />
        </Box>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Input
            autoFocus
            onChange={handleChange}
            fullWidth
            name="tokenSymbol"
            placeholder="Enter Team Token Symbol"
            sx={{ mr: 1, fontWeight: "fontWeightBold" }}
          />
        </Box>
      </Container>

      <Container sx={{ my: 5 }}>{renderMemeberInput}</Container>

      <Container>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Button onClick={handleSubmit} focusRipple color="primary">
            Submit
          </Button>
        </Box>
      </Container>
    </>
  );
};
