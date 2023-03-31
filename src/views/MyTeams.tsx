import { useMemo, useEffect, useState } from "react";
import axios from "axios";
import { useGelato } from "../contexts/gelatocontext";
import { Box } from "@mui/system";
import { Container, Typography, Button } from "@mui/material";

export const MyTeams = () => {
  const { user, wallet, deployTeamSafe } = useGelato();
  const [createdTeams, setCreatedTeams] = useState<any>();
  const [invitedTeams, setInvitedTeams] = useState<any>();
  const [threshold, setThreshold] = useState<number>();
  const [myTeam, setMyTeam] = useState<any>();

  useEffect(() => {
    const load = async () => {
      const allTeams = await axios.get(
        "http://localhost:9000/api/teams/allTeams"
      );
      const {
        data: { payload },
      } = allTeams;
      console.log(payload);
      const { email } = user || {};
      const myCreatedTeams = payload.filter(
        (p: any) => p.creator_email === email
      );
      const myTeams = payload.filter((p: any) =>
        p.team_members.some((t: any) => {
          return t.email === email;
        })
      );
      const invites = payload.filter(
        (p: any) =>
          p.pending_invites.includes(email) &&
          !p.team_members.some((t: any) => {
            return t.email === email;
          })
      );
      setMyTeam(myTeams);
      setCreatedTeams(myCreatedTeams);
      setInvitedTeams(invites);
    };
    if (user) load();
  }, [user]);

  const acceptInvite = async (team: any) => {
    const { email, name } = user || {};
    const { _id } = team;
    const { address } = wallet || {};
    try {
      await axios.post("http://localhost:9000/api/teams/acceptInvite", {
        id: _id,
        email,
        name,
        address,
      });
      alert("Invitation accepted");
    } catch (e) {
      alert("There was an error");
    }
  };

  const renderInvites = useMemo(() => {
    if (!invitedTeams) return;
    return (
      <>
        <h1>Pending Invites</h1>
        {invitedTeams.map((team: any, index: number) => {
          const { team_name, creator_email } = team;
          return (
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                Team Name: {team_name}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                Team Creator: {creator_email}
              </Typography>

              <Container sx={{ my: 5 }}>
                <Button>Decline</Button>
                <Button onClick={() => acceptInvite(team)}>Accept</Button>
              </Container>
            </Box>
          );
        })}
      </>
    );
  }, [invitedTeams]);

  const renderMyTeams = useMemo(() => {
    if (!myTeam) return;
    return (
      <>
        <h1>My Teams</h1>
        {myTeam.map((team: any, index: number) => {
          const { team_members, team_name, creator_email } = team;
          return (
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                Team Name: {team_name}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                Team Creator: {creator_email}
              </Typography>
              <Box sx={{ my: 1.5, px: 2.5 }}>
                <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                  Team Members
                </Typography>
                <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                  {creator_email}
                </Typography>
                {team_members.map((member: any) => {
                  const { email } = member;
                  return (
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "text.primary" }}
                    >
                      {email}
                    </Typography>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </>
    );
  }, [myTeam]);

  const renderCreatedTeams = useMemo(() => {
    if (!createdTeams) return;

    return (
      <>
        <h1>My Created Team</h1>
        {createdTeams.map((team: any, index: number) => {
          const { team_members, pending_invites, team_name, creator_email } =
            team;
          const confirmedInvite = pending_invites.filter((pi: any) =>
            team_members.some((t: any) => t.email === pi)
          );

          const confirmedInviteCount = confirmedInvite.length;
          const teamMemberCount = team_members.length;

          const emails = team_members.map((m:any) => m.email)

          return (
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                Team Name: {team_name}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                Team Creator: {creator_email}
              </Typography>
              <Box sx={{ my: 1.5, px: 2.5 }}>
                {confirmedInviteCount === teamMemberCount ? (
                  <>
                    <Button onClick={() => deployTeamSafe && deployTeamSafe(emails,2)}>Create Safe</Button>
                  </>
                ) : null}
              </Box>
            </Box>
          );
        })}
      </>
    );
  }, [createdTeams]);

  return (
    <Box sx={{ my: 1.5, px: 2.5 }}>
      <div>{renderInvites}</div>
      <div>{renderMyTeams}</div>
      <div>{renderCreatedTeams}</div>
    </Box>
  );
};
