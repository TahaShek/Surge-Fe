import { useState } from "react";

import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/columns";
import { SearchFilter } from "@/components/table/SearchFilter";

function getData(count = 15) {
  const statuses = ["pending", "processing", "completed", "failed"];
  const domains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "prosigns.com",
    "company.io",
  ];

  const data = Array.from({ length: count }, (_, i) => ({
    id: Math.random().toString(36).substring(2, 10), // random 8-char ID
    amount: Math.floor(Math.random() * 900) + 100, // 100–1000 range
    status: statuses[Math.floor(Math.random() * statuses.length)],
    email: `user${i + 1}@${
      domains[Math.floor(Math.random() * domains.length)]
    }`,
  }));

  return data;
}

export default function DemoPage() {
  const data = getData();
  const [filter, setFilter] = useState("");

  if ("Notification" in window) {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("✅ Notification permission granted");
    } else {
      console.log("❌ Notification permission denied");
    }
  });
}
  // Here you can either filter data on the client OR
  // update the table’s internal filter state if needed
  const filteredData = data.filter((u) =>
    u.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <SearchFilter
        value={filter}
        onChange={setFilter}
        placeholder="Search by email..."
      />
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}
