import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/artist")({
  beforeLoad: () => {
    throw redirect({ to: "/artist/$slug", params: { slug: "priya-desai" } });
  },
  component: () => null,
});
