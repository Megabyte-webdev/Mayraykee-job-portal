//This is the Auth token, you will use it to generate a meeting and connect to it
export const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI3MzQ2ZmY0NS1kOTMzLTRiMjktYWY1Ny0xOGNmMmQwM2M1NDMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcyNTg5MjY3MiwiZXhwIjoxNzMzNjY4NjcyfQ.izmn9n9lhSHNls1jXyNAhrOw-o0o70D5oRVbndDLyUc';
// API call to create a meeting
export const createMeeting = async ({ token }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  //Destructuring the roomId from the response
  const { roomId } = await res.json();
  return roomId;
};