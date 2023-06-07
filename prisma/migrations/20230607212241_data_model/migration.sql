-- CreateTable
CREATE TABLE "Author" (
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("authorId")
);

-- CreateTable
CREATE TABLE "Reviewer" (
    "reviewerId" TEXT NOT NULL,

    CONSTRAINT "Reviewer_pkey" PRIMARY KEY ("reviewerId")
);

-- CreateTable
CREATE TABLE "Organizer" (
    "organizerId" TEXT NOT NULL,

    CONSTRAINT "Organizer_pkey" PRIMARY KEY ("organizerId")
);

-- CreateTable
CREATE TABLE "Paper" (
    "paperId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "totalEvaluation" INTEGER NOT NULL DEFAULT 0,
    "isReviewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("paperId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dateId" INTEGER NOT NULL,
    "locationId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "Presentation" (
    "paperId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "fromTime" TIMESTAMP(3) NOT NULL,
    "toTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Presentation_pkey" PRIMARY KEY ("paperId")
);

-- CreateTable
CREATE TABLE "PaperReview" (
    "paperId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "evaluation" INTEGER,
    "contribution" INTEGER,
    "strengths" TEXT,
    "weaknesses" TEXT,
    "isReviewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PaperReview_pkey" PRIMARY KEY ("paperId","reviewerId")
);

-- CreateTable
CREATE TABLE "PaperAuthor" (
    "paperAuthorId" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isPresenter" BOOLEAN NOT NULL DEFAULT false,
    "affiliationId" TEXT NOT NULL,

    CONSTRAINT "PaperAuthor_pkey" PRIMARY KEY ("paperAuthorId")
);

-- CreateTable
CREATE TABLE "Institution" (
    "institutionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("institutionId")
);

-- CreateTable
CREATE TABLE "Location" (
    "locationId" TEXT NOT NULL,
    "venueName" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("locationId")
);

-- CreateTable
CREATE TABLE "ConfDate" (
    "confDateId" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfDate_pkey" PRIMARY KEY ("confDateId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Institution_name_key" ON "Institution"("name");

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviewer" ADD CONSTRAINT "Reviewer_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organizer" ADD CONSTRAINT "Organizer_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Author"("authorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "ConfDate"("confDateId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("locationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Organizer"("organizerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presentation" ADD CONSTRAINT "Presentation_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("paperId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presentation" ADD CONSTRAINT "Presentation_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("sessionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperReview" ADD CONSTRAINT "PaperReview_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("paperId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperReview" ADD CONSTRAINT "PaperReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "Reviewer"("reviewerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperAuthor" ADD CONSTRAINT "PaperAuthor_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("paperId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperAuthor" ADD CONSTRAINT "PaperAuthor_affiliationId_fkey" FOREIGN KEY ("affiliationId") REFERENCES "Institution"("institutionId") ON DELETE RESTRICT ON UPDATE CASCADE;
