"use client";
import Counter from "@/app/components/Counter.js";
import { getSummaryAction } from "@/app/actions.js";
import { useEffect, useState } from "react";

export default function Statistics() {
  const [stats, setStats] = useState({
    submittedPapersCount: 0,
    acceptedPapersCount: 0,
    rejectedPapersCount: 0,
    avgAuthorsPerPaper: 0,
    sessionCount: 0,
    avgPresentationsPerSession: 0,
  });

  useEffect(() => {
    getSummaryAction().then((result) => {
      if (result.error === 0) {
        setStats(result.payload);
      }
    });
  }, []);

  const boxStyle = "bg-cp-purple-bg p-5 rounded-xl h-[175px] w-[350px] grid";
  return (
    <main className="text-2xl flex flex-col items-center gap-10 p-10">
      <h1 className="text-4xl font-medium">Statistics</h1>
      <div className="grid lg:grid-cols-3 lg:grid-rows-2 text-white gap-5">
        <div className={boxStyle}>
          <p className="text-lg absolute">Number of Submitted Papers</p>
          <span className="place-self-center text-5xl">
            <Counter value={stats.submittedPapersCount}></Counter>
          </span>
        </div>

        <div className={boxStyle}>
          <p className="text-lg absolute">Number of Accepted Papers</p>
          <span className="place-self-center text-5xl">
            <Counter value={stats.acceptedPapersCount}></Counter>
          </span>
        </div>

        <div className={boxStyle}>
          <p className="text-lg absolute">Number of Rejected Papers</p>
          <span className="place-self-center text-5xl">
            <Counter value={stats.rejectedPapersCount}></Counter>
          </span>
        </div>

        <div className={boxStyle}>
          <p className="text-lg absolute">Average Authors Count Per Paper</p>
          <span className="place-self-center text-5xl">
            <Counter value={stats.avgAuthorsPerPaper}></Counter>
          </span>
        </div>

        <div className={boxStyle}>
          <p className="text-lg absolute">Number of Sessions</p>
          <span className="place-self-center text-5xl">
            <Counter value={stats.sessionCount}></Counter>
          </span>
        </div>

        <div className={boxStyle}>
          <p className="text-lg absolute">
            Average Presentation Count Per Session
          </p>
          <span className="place-self-center text-5xl">
            <Counter value={stats.avgPresentationsPerSession}></Counter>
          </span>
        </div>
      </div>
    </main>
  );
}
