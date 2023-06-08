import { promises as fs } from "fs";
const PAPERS_PDF_PATH = "public/papers";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function authenticateUser(email, password) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return { error: 2, message: "Email Not Found." };
    }

    if (user.password === password) {
      delete user.password;
      return { error: 0, payload: user };
    } else {
      return { error: 3, message: "Wrong Password" };
    }
  } catch (error) {
    console.error(error.message);
    return { error: 1, message: "Database Error" };
  }
}

export async function createUser(user) {
  try {
    const newUser = await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        role: user.role,
      },
    });

    return { error: 0, payload: newUser };
  } catch (error) {
    console.error(error.message);
    return { error: 1, message: "Database Error" };
  }
}

export async function readUser(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!user) {
      return { error: 2, message: "User Not Found." };
    }

    return { error: 0, payload: user };
  } catch (error) {
    console.error(error.message);
    return { error: 1, message: "Database Error" };
  }
}

export async function readUsers(role) {
  try {
    const query = {};

    if (role) {
      query.where = { role: role };
    }

    const users = await prisma.user.findMany(query);

    return { error: 0, payload: users };
  } catch (error) {
    console.error(error.message);
    return { error: 1, message: "Database Error" };
  }
}

export async function createPaper(paper, paperPDF) {
  try {
    const newPaper = await prisma.paper.create({
      data: paper,
    });

    return { error: 0, payload: newPaper };
  } catch (error) {
    console.error(error.message);
    return { error: 1, message: "Database Error" };
  }
}

export async function createPaperPDF(id, paperPDF) {
  try {
    await fs.writeFile(
      PAPERS_PDF_PATH + "/" + id + ".pdf",
      Buffer.from(await paperPDF.arrayBuffer())
    );
    return { error: 0, message: "Success" };
  } catch (error) {
    console.error(error.message);
    return { error: 1, message: "Database Error" };
  }
}

export async function createPaperAuthor(paperId, author) {
  try {
    const newPaperAuthor = await prisma.paperAuthor.create({
      data: {
        paperId: paperId,
        firstName: author.firstName,
        lastName: author.lastName,
        email: author.email,
        affiliationId: author.affiliationId,
        isPresenter: author.isPresenter,
      },
    });

    return { error: 0, payload: newPaperAuthor };
  } catch (error) {
    console.error(error.message);
    return { error: 1, message: "Database Error" };
  }
}

export async function createPaperReview(paperId, reviewerId) {
  try {
    await prisma.paperReview.create({
      data: {
        paperId: paperId,
        reviewerId: reviewerId,
        evaluation: null,
        contribution: null,
        strengths: null,
        weaknesses: null,
      },
    });
  } catch (error) {
    console.error(error.message);
    return { error: 1, message: "Database Error" };
  }
}

export async function readInstitutions() {
  try {
    const institutions = await prisma.institution.findMany();
    return { error: 0, payload: institutions };
  } catch (error) {
    console.error(error.message);
    return { error: 1, message: "Database Error" };
  }
}

export async function readLocations() {
  try {
    const locations = await prisma.location.findMany();
    return { error: 0, payload: locations };
  } catch (error) {
    console.error(error.message);
    return { error: 1, message: "Database Error" };
  }
}

export async function readDates() {
  try {
    const dates = await prisma.confDate.findMany();
    return { error: 0, payload: dates };
  } catch (error) {
    console.error(error.message);
    return { error: 1, message: "Database Error" };
  }
}

export async function getRandomReviewers() {
  const reviewers = (await readUsers("reviewer")).payload;

  let randomIndices = new Set();
  while (randomIndices.size !== 2) {
    randomIndices.add(Math.floor(Math.random() * reviewers.length));
  }
  randomIndices = [...randomIndices];
  const reviewer1 = reviewers[randomIndices[0]].userId;
  const reviewer2 = reviewers[randomIndices[1]].userId;
  return [reviewer1, reviewer2];
}

export async function readPaperReview(paperId, reviewerId) {
  try {
    const result = await prisma.paperReview.findUnique({
      where: {
        paperId_reviewerId: {
          paperId: paperId,
          reviewerId: reviewerId,
        },
      },
    });

    if (!result) {
      return {
        error: 2,
        message: `No Review Found for paper (${paperId}) by reviewer (${reviewerId})`,
      };
    }

    return { error: 0, payload: result };
  } catch (error) {
    console.error(error.message);
    return { error: 1, message: "Database Error" };
  }
}

export async function updatePaperReview(paperId, reviewerId, review) {
  try {
    const result = await prisma.paperReview.update({
      where: {
        paperId_reviewerId: {
          paperId: paperId,
          reviewerId: reviewerId,
        },
      },
      data: {
        ...review,
        isReviewed: true,
      },
    });

    await updatePaperTotEval(paperId);

    return { error: 0, payload: result };
  } catch (error) {
    console.error(error.message);
    return { error: 1, message: "Database Error" };
  }
}

export async function updatePaperTotEval(paperId) {
  try {
    const totEval = await prisma.paperReview.groupBy({
      by: ["paperId"],
      _count: true,
      _sum: {
        evaluation: true,
      },
      where: {
        paperId: paperId,
        isReviewed: true,
      },
    });

    const data = {
      totalEvaluation: totEval[0]._sum.evaluation,
    };
    if (totEval[0]._count === 2) {
      data.isReviewed = true;
    }

    await prisma.paper.update({
      where: { paperId: paperId },
      data,
    });
  } catch (error) {
    console.error(error.message);
    return { error: 1, message: "Database Error" };
  }
}

export async function readReviewerPapers(reviewerId) {
  try {
    let result = await prisma.paperReview.findMany({
      where: {
        reviewerId: reviewerId,
      },
      include: {
        paper: {
          include: { authors: true },
        },
      },
    });

    if (!result) {
      return {
        error: 2,
        message: `No Papers Found for reviewer (${reviewerId})`,
      };
    }

    result = result.map((review) => {
      review.paper.isReviewed = review.isReviewed;
      review.paper["reviewerId"] = review.reviewerId;
      return review.paper;
    });

    return { error: 0, payload: result };
  } catch (error) {
    console.error(error.message);
    return { error: 1, message: "Database Error" };
  }
}

export async function readAuthorPapers(authorId) {
  try {
    const result = await prisma.author.findUnique({
      where: {
        authorId: authorId,
      },
      include: {
        createdPapers: {
          include: { authors: true },
        },
      },
    });

    if (!result) {
      return {
        error: 2,
        message: `Author (${authorId}) Not Found`,
      };
    }

    return { error: 0, payload: result.createdPapers };
  } catch (error) {
    console.error(error.message);
    return { error: 1, message: "Database Error" };
  }
}

export async function readSchedule() {
  try {
    const result = await prisma.confDate.findMany({
      include: {
        sessions: {
          include: {
            location: true,
            presentations: {
              include: { paper: { include: { authors: true } } },
            },
          },
        },
      },
    });

    if (!result) {
      return {
        error: 2,
        message: `No Schedule Found`,
      };
    }

    return { error: 0, payload: result };
  } catch (error) {
    console.error(error.message);
    return { error: 1, message: "Database Error" };
  }
}

export async function getSummary() {
  try {
    const submittedPapersCount = (
      await prisma.paper.aggregate({
        _count: true,
      })
    )._count;

    const acceptedPapersCount = (
      await prisma.paper.aggregate({
        _count: true,
        where: {
          isReviewed: true,
          totalEvaluation: {
            gte: 2,
          },
        },
      })
    )._count;

    const rejectedPapersCount = (
      await prisma.paper.aggregate({
        _count: true,
        where: {
          isReviewed: true,
          totalEvaluation: {
            lt: 2,
          },
        },
      })
    )._count;

    const avgAuthorsPerPaper = (
      await prisma.paperAuthor.groupBy({
        by: ["paperId"],
        _count: true,
      })
    ).reduce((avg, val, _, array) => avg + val._count / array.length, 0);

    const sessionCount = (
      await prisma.session.aggregate({
        _count: true,
      })
    )._count;

    const avgPresentationsPerSession = (
      await prisma.presentation.groupBy({
        by: ["sessionId"],
        _count: true,
      })
    ).reduce((avg, val, _, array) => avg + val._count / array.length, 0);

    const summary = {
      submittedPapersCount,
      acceptedPapersCount,
      rejectedPapersCount,
      avgAuthorsPerPaper,
      sessionCount,
      avgPresentationsPerSession,
    };

    return { error: 0, payload: summary };
  } catch (error) {
    console.error(error.message);
    return { error: 1, message: "Database Error" };
  }
}
