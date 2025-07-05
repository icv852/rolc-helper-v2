// seed.ts
import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '../../generated/prisma';

interface CSVRow {
  [key: string]: string;
}

// Helper function to read CSV files and return a Promise with an array of rows
function readCSV(filePath: string): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    const results: CSVRow[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: CSVRow) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err: Error) => reject(err));
  });
}

// Helper function to convert a CSV string value to boolean
function parseBoolean(value: string): boolean {
  return value.trim() === "1" ||
         value.trim().toLowerCase() === "true" ||
         value.trim().toLowerCase() === "yes";
}

// Helper function to trim strings
function trimValue(value: string): string {
  return value.trim();
}

function safeParseInt(value: string): number {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
}

function parseEquipmentInt(value: string): number {
  if (!value || value.trim() === '' || value.trim() === '?') {
    return 0;
  }
  return safeParseInt(value);
}

export default async function seed(prisma: PrismaClient): Promise<void> {
  try {
    // 1. Import DLC entries from dlc.csv
    const dlcRows = await readCSV('data/dlc.csv');
    for (const row of dlcRows) {
      await prisma.dlc.upsert({
        where: { name: trimValue(row.name) },
        create: { name: trimValue(row.name) },
        update: {} // No update if the record already exists.
      });
    }
    console.log('DLC data imported.');

    // 2. Import Map entries from map.csv
    const mapRows = await readCSV('data/map.csv');
    for (const row of mapRows) {
      await prisma.map.upsert({
        where: { name: trimValue(row.name) },
        create: {
          name: trimValue(row.name),
          rank: safeParseInt(row.rank),
          maxLv: safeParseInt(row.maxLv),
          dlcName: trimValue(row.dlcName)
        },
        update: {}
      });
    }
    console.log('Map data imported.');

    // 3. Import Item entries from item.csv
    const itemRows = await readCSV('data/item.csv');
    for (const row of itemRows) {
      await prisma.item.upsert({
        where: { name: trimValue(row.name) },
        create: {
          name: trimValue(row.name),
          dlcName: trimValue(row.dlcName),
          copper: safeParseInt(row.copper),
          silver: safeParseInt(row.silver),
          gold: safeParseInt(row.gold),
          shadow: safeParseInt(row.shadow),
          huang: safeParseInt(row.huang),
          normal: safeParseInt(row.normal),
          coinType: row.coinType,
          notice: row.notice
        },
        update: {}
      });
    }
    console.log('Item data imported.');

    // 4. Import Weapon entries from "weapon.csv"
    const weaponRows = await readCSV('data/weapon.csv')
    for (const row of weaponRows) {
      await prisma.weapon.upsert({
        where: { name: trimValue(row.name) },
        create: {
          name: trimValue(row.name),
          rank: safeParseInt(row.rank),
          rare: row.rare,
          attribute: row.attribute,
          leftHand: parseBoolean(row.leftHand),
          level: safeParseInt(row.level),
          phyAtk: safeParseInt(row.phyAtk),
          magAtk: safeParseInt(row.magAtk),
          crit: row.crit,
          skill1: row.skill1,
          skill2: row.skill2,
          skill3: row.skill3,
          skill4: row.skill4,
          skill5: row.skill5,
          skill6: row.skill6,
          rawMaterials: row.rawMaterials,
          base: row.base,
          type: row.type
        },
        update: {}
      })
    }
    console.log('Weapon data imported.');

    // 5. Import Weapon entries from "weapon.csv"
    const ringRows = await readCSV('data/ring.csv')
    for (const row of ringRows) {
      await prisma.ring.upsert({
        where: { name: trimValue(row.name) },
        create: {
          name: trimValue(row.name),
          rank: safeParseInt(row.rank),
          rare: row.rare,
          level: safeParseInt(row.level),
          phyAtk: safeParseInt(row.phyAtk),
          magAtk: safeParseInt(row.magAtk),
          crit: row.crit,
          skill1: row.skill1,
          skill2: row.skill2,
          skill3: row.skill3,
          skill4: row.skill4,
          skill5: row.skill5,
          skill6: row.skill6,
          rawMaterials: row.rawMaterials,
          base: row.base
        },
        update: {}
      })
    }
    console.log('Ring data imported.');

    // 6. Import Equipment entries from "equipment.csv"
    const equipmentRows = await readCSV('data/equipment.csv');
    for (const row of equipmentRows) {
      await prisma.equipment.upsert({
        where: { name: trimValue(row.name) },
        create: {
          name: trimValue(row.name),
          part: trimValue(row.part),
          phyDef: safeParseInt(row.phyDef),
          magDef: safeParseInt(row.magDef),
          inscription: row.inscription ? trimValue(row.inscription) : '',
          // Note: The CSV column order is assumed to be:
          // name, part, phyDef, magDef, inscription, base, rawMaterials, notice, level, rank, rare, type, pro
          // In our Equipment model, the field mapping is:
          // - base comes last, rawMaterials comes before it.
          // Adjust accordingly if needed.
          base: row.base ? trimValue(row.base) : '',
          rawMaterials: row.rawMaterials ? trimValue(row.rawMaterials) : '',
          notice: row.notice ? trimValue(row.notice) : '',
          // The CSV ordering for level and rank might be swapped.
          // According to your Equipment model, we use:
          level: parseEquipmentInt(row.level),
          rank: parseEquipmentInt(row.rank),
          rare: row.rare ? trimValue(row.rare) : '',
          type: row.type ? trimValue(row.type) : '',
          pro: row.pro ? trimValue(row.pro) : ''
        },
        update: {}
      });
    }
    console.log('Equipment data imported.');

    // 7. Import Task entries from task.csv
    // Note: The CSV file header uses "diffculty" for the difficulty column.
    const taskRows = await readCSV('data/task.csv');
    for (const row of taskRows) {
      // Trim and extract key values.
      const taskName = trimValue(row.name);
      const mapName = trimValue(row.mapName);
      const dlcName = trimValue(row.dlcName);
      const itemName = trimValue(row.reward); // "reward" should correspond to Item.name

      // Verify that the parent records exist.
      const mapRecord = await prisma.map.findUnique({ where: { name: mapName } });
      const dlcRecord = await prisma.dlc.findUnique({ where: { name: dlcName } });
      const itemRecord = await prisma.item.findUnique({ where: { name: itemName } });

      if (!mapRecord || !dlcRecord || !itemRecord) {
        console.error(`Skipping task "${taskName}" due to missing parent data:`, {
          mapRecord,
          dlcRecord,
          itemRecord,
        });
        continue; // Skip this task insertion if a referenced record is missing.
      }

      await prisma.task.upsert({
        where: { name: taskName },
        create: {
          name: taskName,
          mapName: mapName,
          dlcName: dlcName,
          itemName: itemName,
          day: parseBoolean(row.day),
          dayS: parseBoolean(row.dayS),
          evening: parseBoolean(row.evening),
          eveningS: parseBoolean(row.eveningS),
          night: parseBoolean(row.night),
          nightS: parseBoolean(row.nightS),
          difficulty: trimValue(row.difficulty),
          notBoss: parseBoolean(row.notBoss),
        },
        update: {}
      });
    }
    console.log('Task data imported.');
    console.log('All seeding operations completed successfully.');
  } catch (error) {
    console.error('An error occurred during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}