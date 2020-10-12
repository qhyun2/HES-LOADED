import json
import pprint
import os

export = {}
rarity = json.load(open("../src/assets/items/value.json"))

for entry in os.scandir("../data/item_info/"):
    with open(entry.path) as a:
        item = json.loads(a.read())
        name = item.pop("shortname")

        to_delete = ["itemid", "quickDespawn", "parent"]

        for delete in to_delete:
            try:
                del item[delete]
            except:
                pass

        export[name] = item

        # add to value json if not already present
        if name not in rarity:
            rarity[name] = 0

with open("../src/assets/items/data.json", 'w') as data:
    json.dump(export, data, separators=(',', ':'))
with open("../src/assets/items/value.json", 'w') as data:
    json.dump(rarity, data, sort_keys=True, separators=(',\n', ': '))

