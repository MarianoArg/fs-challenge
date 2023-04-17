import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import client from "~/lib/client";
import { Outlet } from "~/components/OutletWithContext";
import ky from "ky-universal";

import { requireUserJwt } from "~/session.server";
import Header from "~/components/Header";

export const loader = async ({ request }: LoaderArgs) => {
  const token = await requireUserJwt(request);
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);
  try {
    const todoList = await client
      .get(`todos?status=${search.get("q")}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .json();
    return json({ todoListItems: todoList?.todos });
  } catch (error) {
    console.log("error here", error);
    throw new Response("Server Error", { status: 500 });
  }
};

export default function TodosPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <main className="flex h-full bg-white">
        <div className="flex flex-1 items-center justify-center p-6">
          <Outlet data={data.todoListItems} />
        </div>
      </main>
    </div>
  );
}
