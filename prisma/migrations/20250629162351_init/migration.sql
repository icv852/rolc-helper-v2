-- CreateTable
CREATE TABLE "Dlc" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Map" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "rank" INTEGER NOT NULL,
    "maxLv" INTEGER NOT NULL,
    "dlcName" TEXT NOT NULL,
    CONSTRAINT "Map_dlcName_fkey" FOREIGN KEY ("dlcName") REFERENCES "Dlc" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "copper" INTEGER NOT NULL,
    "silver" INTEGER NOT NULL,
    "gold" INTEGER NOT NULL,
    "dlcName" TEXT NOT NULL,
    CONSTRAINT "Item_dlcName_fkey" FOREIGN KEY ("dlcName") REFERENCES "Dlc" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Task" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "day" BOOLEAN NOT NULL,
    "dayS" BOOLEAN NOT NULL,
    "evening" BOOLEAN NOT NULL,
    "eveningS" BOOLEAN NOT NULL,
    "night" BOOLEAN NOT NULL,
    "nightS" BOOLEAN NOT NULL,
    "difficulty" TEXT NOT NULL,
    "mapName" TEXT NOT NULL,
    "dlcName" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    CONSTRAINT "Task_mapName_fkey" FOREIGN KEY ("mapName") REFERENCES "Map" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_dlcName_fkey" FOREIGN KEY ("dlcName") REFERENCES "Dlc" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_itemName_fkey" FOREIGN KEY ("itemName") REFERENCES "Item" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
