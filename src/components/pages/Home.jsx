import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import QuestionList from "@/components/organisms/QuestionList";
import Sidebar from "@/components/organisms/Sidebar";

const Home = () => {
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sort") || "newest";
  const tagFilter = searchParams.get("tag");
  const searchTerm = searchParams.get("search");

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1">
        <QuestionList 
          sortBy={sortBy}
          tagFilter={tagFilter}
          searchTerm={searchTerm}
        />
      </div>

      {/* Sidebar */}
      <div className="lg:w-80 flex-shrink-0">
        <div className="lg:sticky lg:top-24">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;