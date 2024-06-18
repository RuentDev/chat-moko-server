import fetch from "node-fetch";

export const getServerSession = async (url: string, cookie?: string) => {
  if(!cookie) return;
  
  const res = await fetch(`${url}/api/auth/session`,{
    headers:  {
      "Cookie": cookie.replace("Bearer ", ""),
    },
  });

  const session = await res.json();
  
  return session;
};