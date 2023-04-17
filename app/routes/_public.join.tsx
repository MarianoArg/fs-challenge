import { LoadingButton } from "@mui/lab";
import { Alert, Snackbar, TextField } from "@mui/material";
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

// import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserIdAndToken } from "~/session.server";
import type { User } from "~/types";
import { safeRedirect, validateEmail } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
  const userData = await getUserIdAndToken(request);
  if (userData?.userId) return redirect("/todos");
  return json({ userData });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const fullname = formData.get("fullname");
  const email = formData.get("email");
  const password1 = formData.get("password1");
  const password2 = formData.get("password2");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/todos");

  const baseErrors = {
    fullname: null,
    email: null,
    password1: null,
    password2: null,
  };

  if (typeof fullname !== "string") {
    return json(
      { errors: { ...baseErrors, fullname: "Full Name is required" } },
      { status: 400 }
    );
  }
  if (!validateEmail(email)) {
    return json(
      { errors: { ...baseErrors, email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password1 !== "string" || password1.length === 0) {
    return json(
      { errors: { ...baseErrors, password1: "Password is required" } },
      { status: 400 }
    );
  }
  if (!/[!@#$%&*]/.test(password1)) {
    return json(
      {
        errors: {
          ...baseErrors,
          password1:
            "Password should contain at least 1 special character (! @ # $ % & *)",
        },
      },
      { status: 400 }
    );
  }

  if (!/[a-z]/.test(password1)) {
    return json(
      {
        errors: {
          ...baseErrors,
          password1: "Password should contain at least 1 lowecase letter",
        },
      },
      { status: 400 }
    );
  }

  if (!/[A-Z]/.test(password1)) {
    return json(
      {
        errors: {
          ...baseErrors,
          password1: "Password should contain at least 1 uppercase letter",
        },
      },
      { status: 400 }
    );
  }

  if (!/[0-9]/.test(password1)) {
    return json(
      {
        errors: {
          ...baseErrors,
          password1: "Password should contain at least 1 number",
        },
      },
      { status: 400 }
    );
  }

  if (password1.length < 8) {
    return json(
      {
        errors: {
          ...baseErrors,
          password1: "Password is too short - should be 8 chars minimum.",
        },
      },
      { status: 400 }
    );
  }

  if (password1 !== password2) {
    return json(
      { errors: { ...baseErrors, password2: "Passwords don't match" } },
      { status: 400 }
    );
  }

  try {
    const data: { user: User; token: string } = await client("/auth/register", {
      body: {
        fullname,
        email,
        password1,
        password2,
      },
    });

    return createUserSession({
      redirectTo,
      remember: false,
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

export const meta: V2_MetaFunction = () => [{ title: "Sign Up" }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const fullnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const password1Ref = useRef<HTMLInputElement>(null);
  const password2Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.fullname) {
      fullnameRef.current?.focus();
    } else if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password1) {
      password1Ref.current?.focus();
    } else if (actionData?.errors?.password2) {
      password2Ref.current?.focus();
    }
  }, [actionData]);

  return (
    <Card withLogo title="Welcome back!" subtitle="Log in to continue.">
      <Form method="post" className="w-full max-w-[330px] pb-7">
        <div className="space-y-3">
          <TextField
            ref={fullnameRef}
            id="fullname"
            label="Full Name"
            name="fullname"
            type="text"
            required
            autoFocus={true}
            size="small"
            variant="standard"
            aria-invalid={actionData?.errors?.fullname ? true : undefined}
            error={actionData?.errors?.fullname ? true : undefined}
            aria-describedby="fullname-error"
            fullWidth
            helperText={actionData?.errors?.fullname}
          />
          <TextField
            ref={emailRef}
            id="email"
            label="Email"
            name="email"
            type="email"
            required
            size="small"
            variant="standard"
            aria-invalid={actionData?.errors?.email ? true : undefined}
            error={actionData?.errors?.email ? true : undefined}
            aria-describedby="email-error"
            fullWidth
            helperText={actionData?.errors?.email}
          />
          <TextField
            ref={password1Ref}
            id="password1"
            label="Password"
            name="password1"
            type="password"
            size="small"
            variant="standard"
            autoComplete="current-password"
            aria-invalid={actionData?.errors?.password1 ? true : undefined}
            error={actionData?.errors?.password1 ? true : undefined}
            aria-describedby="password-error"
            fullWidth
            helperText={actionData?.errors?.password1}
          />
          <TextField
            ref={password2Ref}
            id="password2"
            label="Repeat Password"
            name="password2"
            type="password"
            size="small"
            variant="standard"
            autoComplete="current-password"
            aria-invalid={actionData?.errors?.password2 ? true : undefined}
            error={actionData?.errors?.password2 ? true : undefined}
            aria-describedby="password-error"
            fullWidth
            helperText={actionData?.errors?.password2}
          />
        </div>

        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div className="text-darkBlueGray mt-5 w-[330px] text-left text-sm underline hover:font-semibold">
          <Link
            to={{
              pathname: "/login",
              search: searchParams.toString(),
            }}
          >
            Do have an account? Sign in.
          </Link>
        </div>
        <LoadingButton
          type="submit"
          variant="contained"
          fullWidth
          loading={navigation.state === "submitting"}
          loadingIndicator="Creating account"
          sx={{ textTransform: "none", marginTop: "48px" }}
        >
          Sign Up
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
