"use client";
import DialogCreateProject from "@/components/shared/dialog-create-project";
import CardProject from "@/components/shared/card-project";
import { Input } from "@/components/ui/input";
import { useGlobalStore } from "@/stores/global";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [search, setSearch] = useState("");
  const { projects } = useGlobalStore();

  const filteredProjects =
    projects &&
    projects?.filter((project) =>
      project.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="">
      <div className="flex items-center gap-3">
        <DialogCreateProject />
        <Input
          placeholder="Search Project"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="my-6 space-y-4">
        {filteredProjects &&
          filteredProjects.map((project, index) => (
            <CardProject key={index} project={project} />
          ))}
      </div>
    </div>
  );
}
