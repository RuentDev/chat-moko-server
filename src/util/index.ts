import fetch from "node-fetch";

export const getServerSession = async (cookie?: string) => {
  if(!cookie) return;
  const res = await fetch(`${process.env.BASE_URL}/api/auth/session}`,{
    headers: { cookie: cookie },
  });
  const session = await res.json();
  return session;
};