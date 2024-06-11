import fetch from "node-fetch";

export const getServerSession = async (url: string, cookie?: string) => {
  if(!cookie) return;
  console.log("COOKIE: ", cookie)
  const res = await fetch(`${url}/api/auth/session`,{
    headers: { cookie: cookie.replace("Bearer ", "") },
  });
  const session = await res.json();
  console.log("SESSION: ", url ,session)
  
  return session;
};