import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { User } from "./types";
import client from "./lib/client";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userId";

export async function getUserByToken(jwt: string) {
  const data = await client("/users/me", {
    token: jwt,
  });
  return data?.user;
}

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserIdAndToken(
  request: Request
): Promise<{ userId: User["id"]; userJwt: string } | undefined> {
  const session = await getSession(request);
  const userData = session.get(USER_SESSION_KEY);

  return userData;
}

export async function getUser(request: Request) {
  const userData = await getUserIdAndToken(request);
  if (userData?.userJwt === undefined) return null;

  const user = await getUserByToken(userData.userJwt);
  if (user) return user;

  throw await logout(request);
}

export async function requireUserJwt(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userData = await getUserIdAndToken(request);

  if (!userData?.userJwt) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userData.userJwt;
}

export async function requireUser(request: Request) {
  const userJwt = await requireUserJwt(request);

  const user = await getUserByToken(userJwt);
  if (user) return user;

  throw await logout(request);
}

export async function createUserSession({
  request,
  userId,
  userJwt,
  remember,
  redirectTo,
}: {
  request: Request;
  userId: string;
  userJwt: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, { userId, userJwt });
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
