import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
  isRouteErrorResponse,
  ScrollRestoration,
} from "@remix-run/react";
import { getUser } from "./session.server";
import styles from "~/styles/tailwind.css";
import type { LoaderArgs } from "@remix-run/node/dist";
import { json } from "@remix-run/node/dist";

import { withEmotionCache } from "@emotion/react";
import { unstable_useEnhancedEffect as useEnhancedEffect } from "@mui/material";
import theme from "~/styles/theme";
import ClientStyleContext from "~/styles/ClientStyleContext";
import { useContext } from "react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Poppins:ital,wght@0,400;0,500;0,600;1,400;1,600;1,700&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.cdnfonts.com/css/mark-pro",
  },
];

export const meta: V2_MetaFunction = () => [
  {
    charset: "utf-8",
  },
  { title: "New Remix App" },
  { viewport: "width=device-width,initial-scale=1" },
];

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // eslint-disable-next-line no-underscore-dangle
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData.reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <html lang="en" className="h-full">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="theme-color" content={theme.palette.primary.main} />
          {title ? <title>{title}</title> : null}
          <Meta />
          <Links />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <meta
            name="emotion-insertion-point"
            content="emotion-insertion-point"
          />
        </head>
        <body className="h-full font-markPro">
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

// https://remix.run/docs/en/1.15.0/pages/v2#catchboundary-and-errorboundary
export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    let message;
    switch (error.status) {
      case 401:
        message = (
          <p>
            Oops! Looks like you tried to visit a page that you do not have
            access to.
          </p>
        );
        break;
      case 404:
        message = (
          <p>Oops! Looks like you tried to visit a page that does not exist.</p>
        );
        break;

      default:
        message = error.data.message;
    }
    console.log("error sttatus", error.status);
    return (
      <Document title={`${error.status} ${error.statusText}`}>
        <div>
          <h1>
            {error.status}: {error.statusText}
          </h1>
          {message}
        </div>
      </Document>
    );
  }

  let errorMessage = "Unknown error";

  return (
    <Document title="Error!">
      <div>
        <h1>Uh oh ...</h1>
        <p>Something went wrong.</p>
        <hr />
        <pre>{errorMessage}</pre>
      </div>
    </Document>
  );
}
