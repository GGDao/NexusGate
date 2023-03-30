
const createTeam = async (newTeam: any) => {

  return fetch("http://localhost:9000/api/teams/create_team", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...newTeam }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
};

export default createTeam;
