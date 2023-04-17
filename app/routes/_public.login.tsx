import { LoadingButton } from "@mui/lab";
import { Alert, Button, Checkbox, Snackbar, TextField } from "@mui/material";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import Card from "~/components/Card";
import client from "~/lib/client";

import { createUserSession, getUserIdAndToken } from "~/session.server";
import type { User } from "~/types";
import { safeRedirect, validateEmail } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
  const userData = await getUserIdAndToken(request);
  if (userData?.userId) return redirect("/todos");
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  }

  try {
    const data: { user: User; token: string } = await client("/auth/login", {
      body: {
        email,
        password,
      },
    });

    if (!data) {
      return json(
        { errors: { email: "Invalid email or password", password: null } },
        { status: 400 }
      );
    }
    return createUserSession({
      redirectTo,
      remember: remember === "on" ? true : false,
      request,
      userId: data?.user?.id,
      userJwt: data?.token,
    });
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

export const meta: V2_MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/todos";
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Card withLogo title="Welcome back!" subtitle="Log in to continue.">
      <Form method="post" className="w-full max-w-[330px] pb-7">
        <div className="space-y-3">
          <TextField
            ref={emailRef}
            id="email"
            label="Email"
            name="email"
            type="email"
            required
            autoFocus={true}
            size="small"
            variant="standard"
            aria-invalid={actionData?.errors?.email ? true : undefined}
            error={actionData?.errors?.email ? true : undefined}
            aria-describedby="email-error"
            fullWidth
            helperText={actionData?.errors?.email}
          />
          <TextField
            ref={passwordRef}
            id="password"
            label="Password"
            name="password"
            type="password"
            size="small"
            variant="standard"
            autoComplete="current-password"
            aria-invalid={actionData?.errors?.password ? true : undefined}
            error={actionData?.errors?.password ? true : undefined}
            aria-describedby="password-error"
            fullWidth
            helperText={actionData?.errors?.password}
          />
        </div>
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div className="text-darkBlueGray mt-5 w-[330px] text-left text-sm underline hover:font-semibold">
          <Link
            to={{
              pathname: "/join",
              search: searchParams.toString(),
            }}
          >
            Don't have an account? Sign up
          </Link>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox
              id="remember"
              name="remember"
              size="small"
              sx={{ padding: 0 }}
            />

            <label
              htmlFor="remember"
              className="ml-1 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>
        </div>
        <LoadingButton
          type="submit"
          variant="contained"
          fullWidth
          loading={navigation.state === "submitting"}
          loadingIndicator="Logging in "
          sx={{ textTransform: "none", marginTop: "48px" }}
        >
          Log in
        </LoadingButton>
      </Form>
      <Snackbar
        open={actionData?.errors?.response_error}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {actionData?.errors?.response_error}
        </Alert>
      </Snackbar>
    </Card>
  );
}
