const fs = require("fs-extra");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const USERS_PATH = path.join(process.cwd(), "/data/users.json");
const INSTITUTIONS_PATH = path.join(process.cwd(), "/data/institutions.json");
const PAPERS_PATH = path.join(process.cwd(), "/data/papers.json");
const SCHEDULE_PATH = path.join(process.cwd(), "/data/schedule.json");
const LOCATIONS_PATH = path.join(process.cwd(), "/data/locations.json");
const DATES_PATH = path.join(process.cwd(), "/data/dates.json");

async function main() {
  try {
    const users = await fs.readJSON(USERS_PATH);
    const papers = await fs.readJSON(PAPERS_PATH);
    const institutions = await fs.readJSON(INSTITUTIONS_PATH);
    const locations = await fs.readJSON(LOCATIONS_PATH);
    const dates = await fs.readJSON(DATES_PATH);
    const schedule = await fs.readJSON(SCHEDULE_PATH);

    for (let institution of institutions) {
      await prisma.institution.create({
        data: { name: institution },
      });
    }

    for (let location of locations) {
      await prisma.location.create({
        data: location,
      });
    }

    for (let date of dates) {
      await prisma.confDate.create({
        data: { date: date },
      });
    }

    for (let user of users) {
      const newUser = await prisma.user.create({
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          role: user.role,
        },
      });

      if (user.role === "author") {
        await prisma.author.create({
          data: {
            authorId: newUser.userId,
          },
        });
      } else if (user.role === "reviewer") {
        await prisma.reviewer.create({
          data: {
            reviewerId: newUser.userId,
          },
        });
      } else if (user.role === "organizer") {
        await prisma.organizer.create({
          data: {
            organizerId: newUser.userId,
          },
        });
      }
    }

    for (let paper of papers) {
      let creator = users.find((user) => user.id === paper.creatorID);
      creator = await prisma.user.findUnique({
        where: { email: creator.email },
      });

      const newPaper = await prisma.paper.create({
        data: {
          paperId: paper.id,
          title: paper.title,
          abstract: paper.abstract,
          creatorId: creator.userId,
        },
      });

      for (let author of paper.authors) {
        const institution = await prisma.institution.findUnique({
          where: { name: author.affiliation },
        });

        await prisma.paperAuthor.create({
          data: {
            paperId: newPaper.paperId,
            firstName: author.firstName,
            lastName: author.lastName,
            email: author.email,
            isPresenter: author.isPresenter,
            affiliationId: institution.institutionId,
          },
        });
      }

      for (let review of paper.reviews) {
        let reviewer = users.find((user) => user.id === review.reviewerID);

        reviewer = await prisma.user.findUnique({
          where: { email: reviewer.email },
        });

        await prisma.paperReview.create({
          data: {
            paperId: newPaper.paperId,
            reviewerId: reviewer.userId,
            evaluation: review.evaluation,
            contribution: review.contribution,
            strengths: review.strength,
            weaknesses: review.weakness,
            isReviewed: review.isReviewed,
          },
        });

        if (review.isReviewed) {
          const totEval = await prisma.paperReview.groupBy({
            by: ["paperId"],
            _count: true,
            _sum: {
              evaluation: true,
            },
            where: {
              paperId: newPaper.paperId,
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
            where: { paperId: newPaper.paperId },
            data,
          });
        }
      }
    }

    for (let session of schedule) {
      let creator = users.find((user) => user.id === session.creatorID);
      creator = await prisma.user.findUnique({
        where: { email: creator.email },
      });

      const location = await prisma.location.findUnique({
        where: { code: session.location },
      });

      const newSession = await prisma.session.create({
        data: {
          title: session.title,
          dateId: session.date,
          locationId: location.locationId,
          creatorId: creator.userId,
        },
      });

      for (let presentation of session.presentations) {
        await prisma.presentation.create({
          data: {
            paperId: presentation.paperID,
            sessionId: newSession.sessionId,
            fromTime: presentation.fromTime,
            toTime: presentation.toTime,
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
    return { error: error.message };
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
