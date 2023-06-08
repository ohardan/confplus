"use client";
import { readScheduleAction } from "@/app/actions.js";
import { useEffect, useState } from "react";

export default function Schedule() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    readScheduleAction().then((result) => {
      if (result.error === 0) {
        setSchedule(result.payload);
      }
    });
  }, []);

  return (
    <main className="flex flex-col items-center gap-10 p-10 text-xl">
      <h1 className="font-bold text-3xl">Schedule</h1>
      <div className="flex flex-col gap-5">
        {schedule.map((date, index) => (
          <Date
            date={date}
            key={"date" + index}
          />
        ))}
      </div>
    </main>
  );
}

function Date({ date }) {
  return (
    <div className="flex flex-col gap-2 border-2 rounded-lg p-5 items-center">
      <h2 className="font-semibold">{"Day " + date.confDateId}</h2>
      {date.sessions.map((session, index) => (
        <Session
          session={session}
          key={"sessoin" + index}
        />
      ))}
    </div>
  );
}

function Session({ session }) {
  return (
    <div className="border-2 p-2 items-center flex flex-col justify-start bg-gray-200 w-[500px]">
      <h3 className="font-semibold">{"Title: " + session.title}</h3>
      <h3>
        {"Location: " +
          session.location.code +
          ", " +
          session.location.venueName}
      </h3>
      {session.presentations.map((presentation, index) => (
        <>
          <p className="text-xl">Session {index + 1}</p>
          <Presentation
            presentation={presentation}
            key={"presentation" + index}
          />
        </>
      ))}
    </div>
  );
}

function Presentation({ presentation }) {
  const presenter = presentation.paper.authors.find(
    (author) => author.isPresenter
  );
  return (
    <div className="border-2 flex flex-col gap-2 p-2 justify-start bg-cp-ghost-white w-[400px]">
      <h4 className="font-medium">{"Title: " + presentation.paper.title}</h4>
      <p className="">
        From:
        {presentation.fromTime.getHours() +
          ":" +
          presentation.fromTime.getMinutes()}
      </p>
      <p className="">
        To:
        {presentation.toTime.getHours() +
          ":" +
          presentation.toTime.getMinutes()}
      </p>
      <p>{"Presenter: " + presenter.firstName + " " + presenter.lastName}</p>
    </div>
  );
}
