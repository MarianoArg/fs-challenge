import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import client from "~/lib/client";

import { requireUserJwt } from "~/session.server";
import type { Todo } from "~/types";

export const loader = async ({ params, request }: LoaderArgs) => {
  const token = await requireUserJwt(request);
  invariant(params.todoId, "todoId not found");

  try {
    const data: { todo: Todo } = await client(`todos/${params.todoId}`, {
      token,
    });

    return json({ todo: data.todo });
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }
};

export const action = async ({ params, request }: ActionArgs) => {
  const token = await requireUserJwt(request);
  invariant(params.todoId, "todoId not found");

  if (request.method.toLowerCase() === "delete") {
    try {
      await client(`todos/${params.todoId}`, {
        method: "DELETE",
        token,
      });

      return redirect("/todos");
    } catch (error) {
      return json(
        {
          errors: {
            response_error:
              error?.message ?? "Ups! Something happened. Please try again.",
          },
        },
        { status: 500 }
      );
    }
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const body = formData.get("body");
    const status = formData.get("status");

    const data = await client(`todos/${params.todoId}`, {
      method: "PATCH",
      token,
      body: {
        title: title ?? undefined,
        body: body ?? undefined,
        status: status ?? undefined,
      },
    });

    return json({ todo: data.todo });
  } catch (error) {
    return json(
      {
        errors: {
          response_error:
            error?.message ?? "Ups! Something happened. Please try again.",
        },
      },
      { status: 500 }
    );
  }
};

export default function TodoDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.todo.title}</h3>
      <p className="py-6">{data.todo.body}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Todo not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
