-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "maximum_attendeess" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");
