import { Inventory } from "./Inventory";
import * as _ from "lodash";
import { Item } from "./Item";

let lootData: any;

export async function loadLootTables() {
  lootData = {};
  const data = (await (await fetch("./items/LootTables.json")).json()).LootTables;

  for (const key in data) {
    const newKey = key.split("/").pop()?.replace(".prefab", "")!;
    lootData[newKey] = data[key];
  }
}

export function addLoot(inv: Inventory, type: string) {
  const lootTable = lootData[type];
  const itemCount = _.random(lootTable.ItemsMin, lootTable.ItemsMax);

  for (let i = 0; i < itemCount; i++) {
    const item = _.sample(Object.keys(lootTable.ItemList))!;
    const amount = _.random(lootTable.ItemList[item].Min, lootTable.ItemList[item].Max);
    inv.addItemLoot(new Item(inv.stage, item, amount));
    console.log(item);
  }

  console.log(lootTable.Scrap);

  if (lootTable.Scrap) {
    inv.addItemLootStack(new Item(inv.stage, "scrap", lootTable.Scrap));
  }
}

export function generateLoot(inv: Inventory) {
  for (const key in lootData) {
    console.log(key);
  }
  addLoot(inv, "loot-barrel-1");
}
