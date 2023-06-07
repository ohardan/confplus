"use client";
import { readPaperReviewAction, updatePaperReviewAction } from "@/app/actions";
import { LeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReviewPaper({ searchParams: { paperId, reviewerId } }) {
  const [review, setReview] = useState({});

  const evaluations = [
    { value: 2, text: "Strong Accept" },
    { value: 1, text: "Accept" },
    { value: 0, text: "Borderline" },
    { value: -1, text: "Reject" },
    { value: -2, text: "Strong Reject" },
  ];

  const contributions = [
    { value: 5, text: "A Major And Significant Contribution" },
    { value: 4, text: "A Clear Contribution" },
    { value: 3, text: "Minor Contribution" },
    { value: 2, text: "No Obvious Contribution" },
    { value: 1, text: "No Obvious Contribution" },
  ];

  useEffect(() => {
    readPaperReviewAction(paperId, reviewerId).then((result) => {
      if (result.error === 0) {
        setReview(result.payload);
      }
    });
  }, []);

  return (
    <main className="grid place-items-center p-4">
      <form
        className="flex flex-col gap-4 p-10 bg-cp-ghost-white lg:grid lg:gap-x-16 lg:px-20 lg:grid-cols-2"
        action={updatePaperReviewAction}>
        <input
          hidden
          readOnly
          name="reviewerId"
          value={reviewerId}
        />
        <input
          hidden
          readOnly
          name="paperId"
          value={paperId}
        />
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Overall Evaluation:</h2>
          {evaluations.map((evaluation) => {
            return (
              <label className="flex gap-1 items-center">
                <input
                  type="radio"
                  className="accent-cp-indigo"
                  name="evaluation"
                  value={evaluation.value}
                  required
                  checked={review.evaluation === evaluation.value}
                  onChange={(e) => {
                    setReview((prev) => ({
                      ...prev,
                      evaluation: evaluation.value,
                    }));
                  }}
                />
                {evaluation.text}
              </label>
            );
          })}
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Paper Contribution:</h2>
          {contributions.map((contribution) => {
            return (
              <label className="flex gap-1 items-center">
                <input
                  type="radio"
                  className="accent-cp-indigo"
                  name="contribution"
                  value={contribution.value}
                  required
                  checked={review.contribution === contribution.value}
                  onChange={(e) => {
                    setReview((prev) => ({
                      ...prev,
                      contribution: contribution.value,
                    }));
                  }}
                />
                {contribution.text}
              </label>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Paper Strengths:</h2>
          <textarea
            name="strengths"
            cols="30"
            rows="10"
            placeholder="type here..."
            value={review.strengths}
            onChange={(e) => {
              setReview((prev) => ({ ...prev, strengths: e.target.value }));
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Paper Weaknesses:</h2>
          <textarea
            name="weaknesses"
            cols="30"
            rows="10"
            placeholder="type here..."
            value={review.weaknesses}
            onChange={(e) => {
              setReview((prev) => ({ ...prev, weaknesses: e.target.value }));
            }}
          />
        </div>

        <div className="flex justify-between col-span-2 place-items-end">
          <Link
            href="/pages/my-papers"
            className="flex items-center px-2 h-[40px] my-btn">
            <LeftOutlined />
          </Link>
          <input
            type="submit"
            value="Submit"
            className="cursor-pointer text-lg h-[40px] my-btn"
          />
        </div>
      </form>
    </main>
  );
}
