-- CreateTable
CREATE TABLE "summaries" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "summary" TEXT NOT NULL,
    "tags" TEXT[],
    "openaiResponse" JSONB NOT NULL,
    "tweetCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "summaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "summaries_username_key" ON "summaries"("username");

-- CreateIndex
CREATE INDEX "summaries_username_idx" ON "summaries"("username");
