"use client";
import { useEffect, useState } from "react";
import {
  readAuthorPapersAction,
  readReviewerPapersAction,
} from "@/app/actions";
import "./papers.css";
import Link from "next/link";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

export default function Papers() {
  const [papers, setPapers] = useState([]);
  const [isReviewer, setIsReviewer] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.role === "reviewer") {
      setIsReviewer(true);
      readReviewerPapersAction(user.userId).then((res) => {
        if (res.error === 0) {
          res.payload.sort((a, b) => {
            return a.isReviewed === b.isReviewed ? 0 : a.isReviewed ? 1 : -1;
          });
          setPapers(res.payload);
        }
      });
    } else if (user.role === "author") {
      setIsReviewer(false);
      readAuthorPapersAction(user.userId).then((res) => {
        if (res.error === 0) {
          res.payload.sort((a, b) => {
            return a.isReviewed === b.isReviewed ? 0 : a.isReviewed ? 1 : -1;
          });
          setPapers(res.payload);
        }
      });
    }
  }, []);

  return (
    <div className="p-10 flex flex-col gap-5 items-center">
      {isReviewer ? (
        <p className="text-xl">Your Assigned Papers</p>
      ) : (
        <>
          <p className="text-xl">Your Sumbitted Papers</p>
          <Link
            href="/forms/submit-paper"
            className="text-lg my-btn">
            Submit New Paper
          </Link>
        </>
      )}
      <div className="flex flex-col gap-2 p-2 lg:flex-row lg:max-w-screen-md lg:overflow-x-scroll xl:max-w-screen-lg">
        {papers.map((paper, i) => (
          <Paper
            paper={paper}
            isReviewer={isReviewer}
            key={"paper" + i}
          />
        ))}
      </div>
    </div>
  );
}

function Paper({ paper, isReviewer }) {
  const [statusBg, setStatusBg] = useState("");
  const [abstarctHidden, setAbstarctHidden] = useState(true);
  return (
    <div className="paper flex flex-col justify-between border-2 text-center max-w-[400px] lg:min-w-[350px] lg:max-w-[350px]">
      <div className="flex flex-col items-center gap-2 p-6">
        <p className="text-xl font-semibold px-10">{paper.title}</p>
        <div className="flex flex-wrap justify-center gap-1 my-2">
          <p>By:</p>
          <AuthorsList authors={paper.authors} />
        </div>
        <button
          className="hover:underline"
          onClick={() => {
            setAbstarctHidden((a) => {
              return !a;
            });
          }}>
          {abstarctHidden ? "Show" : "Hide"} Abstract
        </button>

        <div
          className={`${
            abstarctHidden ? "collapse" : "show"
          } overflow-y-scroll border-2 border-cp-indigo rounded-md px-2 w-[300px]`}>
          {paper.abstract}
        </div>

        <a
          className="my-btn text-lg"
          download={`${paper.title}_${paper.paperId}.pdf`}
          href={`http://localhost:3000/papers/${paper.paperId}.pdf`}>
          Download Paper
        </a>
      </div>
      <div
        className={`flex flex-col p-2 gap-2 items-center text-lg text-white ${
          isReviewer ? "" : statusBg
        }`}>
        {isReviewer ? (
          <ReviewerPaperFooter
            isReviewed={paper.isReviewed}
            paperId={paper.paperId}
            reviewerId={paper.reviewerId}
          />
        ) : (
          <AuthorPaperFooter
            isReviewed={paper.isReviewed}
            totalEvaluation={paper.totalEvaluation}
            setStatusBg={setStatusBg}
          />
        )}
      </div>
    </div>
  );
}

function ReviewerPaperFooter({ isReviewed, paperId, reviewerId }) {
  return (
    <>
      {isReviewed ? (
        <p className="flex justify-center items-center gap-2 text-green-700 font-semibold">
          <CheckCircleOutlined />
          Reviewed
        </p>
      ) : (
        <p className="flex justify-center items-center gap-2 text-gray-700 font-semibold">
          <ClockCircleOutlined />
          Waiting Your Review
        </p>
      )}
      <Link
        href={`/forms/review-paper?paperId=${paperId}&reviewerId=${reviewerId}`}
        className="bg-cp-indigo px-4
      hover:bg-cp-ghost-white hover:text-cp-indigo
      hover:border-cp-indigo hover:border-2">
        {isReviewed ? "Update" : "Start"} Review
      </Link>
    </>
  );
}

function AuthorPaperFooter({ isReviewed, totalEvaluation, setStatusBg }) {
  useEffect(() => {
    isReviewed
      ? totalEvaluation >= 2
        ? setStatusBg("bg-green-700")
        : setStatusBg("bg-red-700")
      : setStatusBg("bg-gray-700");
  }, []);

  return isReviewed ? (
    totalEvaluation >= 2 ? (
      <p className="flex justify-center items-center gap-2">
        <CheckCircleOutlined />
        Accepted
      </p>
    ) : (
      <p className="flex justify-center items-center gap-2">
        <CloseCircleOutlined />
        Rejected
      </p>
    )
  ) : (
    <p className="flex justify-center items-center gap-2">
      <ClockCircleOutlined />
      Pending Review
    </p>
  );
}

function AuthorsList({ authors }) {
  if (authors.length > 2) {
    return (
      <>
        {authors.map((a, i) =>
          i <= 1 ? (
            <p key={"author" + i}>
              {a.lastName + " " + a.firstName.charAt(0) + ","}
            </p>
          ) : (
            ""
          )
        )}
        <p>et al.</p>
      </>
    );
  }
  return authors.map((a, i, arr) => (
    <p key={"author" + i}>
      {a.lastName + " " + a.firstName.charAt(0)}
      {i === arr.length - 1 ? "" : ", "}
    </p>
  ));
}
