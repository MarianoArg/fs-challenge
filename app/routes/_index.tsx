import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireUserJwt } from "~/session.server";

export const meta: V2_MetaFunction = () => [{ title: "Simpledo Challenge" }];

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserJwt(request);
  return redirect(`/todos`);
};
