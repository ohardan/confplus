"use server";
import * as repo from "@/utilities/repository.js";
import { redirect } from "next/navigation";

export async function loginAction(formdata) {
  const email = formdata.get("email");
  const password = formdata.get("password");
  return await repo.authenticateUser(email, password);
}

export async function readReviewerPapersAction(reviewerId) {
  return await repo.readReviewerPapers(reviewerId);
}

export async function readAuthorPapersAction(authorId) {
  return await repo.readAuthorPapers(authorId);
}

export async function readPaperReviewAction(paperId, reviewerId) {
  return await repo.readPaperReview(paperId, reviewerId);
}

export async function updatePaperReviewAction(formdata) {
  const paperId = formdata.get("paperId");
  const reviewerId = formdata.get("reviewerId");
  const review = {
    evaluation: Number(formdata.get("evaluation")),
    contribution: Number(formdata.get("contribution")),
    strengths: formdata.get("strengths"),
    weaknesses: formdata.get("weaknesses"),
  };

  const result = await repo.updatePaperReview(paperId, reviewerId, review);

  if (result.error === 0) {
    redirect("/pages/my-papers");
  }
}

export async function readAffiliationsAction() {
  return await repo.readInstitutions();
}

export async function createPaperAction(formdata) {
  const paper = {
    title: formdata.get("title"),
    abstract: formdata.get("abstract"),
    creatorId: formdata.get("creatorId"),
  };
  const paperPDF = formdata.get("paperPDF");
  const authorsCount = Number(formdata.get("authorsCount"));

  const authors = [];
  for (let i = 0; i < authorsCount; i++) {
    const author = {
      firstName: formdata.get(`firstName${i}`),
      lastName: formdata.get(`lastName${i}`),
      email: formdata.get(`email${i}`),
      affiliationId: formdata.get(`affiliationId${i}`),
      isPresenter: false,
    };

    if (formdata.get(`presenter`) == i) {
      author.isPresenter = true;
    }
    authors.push(author);
  }

  const result = await repo.createPaper(paper);
  if (result.error !== 0) {
    throw new Error("Database Error");
  }

  const newPaper = result.payload;

  for (let author of authors) {
    await repo.createPaperAuthor(newPaper.paperId, author);
  }

  const reviewers = await repo.getRandomReviewers();
  for (let reviewerId of reviewers) {
    await repo.createPaperReview(newPaper.paperId, reviewerId);
  }

  await repo.createPaperPDF(newPaper.paperId, paperPDF);

  redirect("/pages/my-papers");
}

export async function getSummaryAction() {
  return await repo.getSummary();
}
