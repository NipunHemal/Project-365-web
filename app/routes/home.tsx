import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Expense Tracker" },
    { name: "description", content: "Track your expenses easily" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">Expense Tracker</h1>
    </div>
  );
}
