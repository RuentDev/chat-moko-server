import fetch from "node-fetch";

export const getServerSession = async (url: string, cookie?: string) => {
  if(!cookie) return;
  console.log("SESSION: ", url ,cookie)
  // console.log(new Date(), "COOKIE: ", cookie)
  const res = await fetch(`${url}/api/auth/session`,{
    headers:  {
      "Cookie": cookie.replace("Bearer ", ""),
    },
  });
  const session = await res.json();
  console.log("SESSION: ", url ,session)
  
  return session;
};