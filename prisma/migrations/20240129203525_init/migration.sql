-- CreateTable
CREATE TABLE "Embedding" (
    "_id" TEXT NOT NULL,
    "data" DOUBLE PRECISION[],
    "text" TEXT NOT NULL,

    CONSTRAINT "Embedding_pkey" PRIMARY KEY ("_id")
);
