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
    "shadow" INTEGER NOT NULL,
    "huang" INTEGER NOT NULL,
    "normal" INTEGER NOT NULL,
    "dlcName" TEXT NOT NULL,
    "coinType" TEXT NOT NULL,
    "notice" TEXT NOT NULL
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

-- CreateTable
CREATE TABLE "Weapon" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "rank" INTEGER NOT NULL,
    "rare" TEXT NOT NULL,
    "attribute" TEXT NOT NULL,
    "leftHand" BOOLEAN NOT NULL,
    "level" INTEGER NOT NULL,
    "phyAtk" INTEGER NOT NULL,
    "magAtk" INTEGER NOT NULL,
    "crit" TEXT NOT NULL,
    "skill1" TEXT NOT NULL,
    "skill2" TEXT NOT NULL,
    "skill3" TEXT NOT NULL,
    "skill4" TEXT NOT NULL,
    "skill5" TEXT NOT NULL,
    "skill6" TEXT NOT NULL,
    "rawMaterials" TEXT NOT NULL,
    "base" TEXT NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Ring" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "rank" INTEGER NOT NULL,
    "rare" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "phyAtk" INTEGER NOT NULL,
    "magAtk" INTEGER NOT NULL,
    "crit" TEXT NOT NULL,
    "skill1" TEXT NOT NULL,
    "skill2" TEXT NOT NULL,
    "skill3" TEXT NOT NULL,
    "skill4" TEXT NOT NULL,
    "skill5" TEXT NOT NULL,
    "skill6" TEXT NOT NULL,
    "rawMaterials" TEXT NOT NULL,
    "base" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Equipment" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "part" TEXT NOT NULL,
    "phyDef" INTEGER NOT NULL,
    "magDef" INTEGER NOT NULL,
    "inscription" TEXT NOT NULL,
    "notice" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "pro" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "rare" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "rawMaterials" TEXT NOT NULL,
    "base" TEXT NOT NULL
);
