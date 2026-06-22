var e=`---
tags:
  - Fabric
  - Public-Work
---
### Biome Loot table

Dev test for Eufonia Studio a while ago.

Changes how the loot tables are being handled by the game. Adding server-side configs for modifying loot depending on which biome the player is in at that moment, also giving the possibility to select the loot table based on a config list.

The config created a config.json that will let you set biomes (as keys) and the loot tables that should appear. In case a player opens a chest in a biome that isn't defined, you can include a list of predefined loot tables that will act as defaults.

This uses 3 mixins:

- in the server init to load the config (we need the LootManager class that is here)
- in the chest block to check if the player puts a check to mark it as invalid (not able to generate loot)
- in the chest block entity to inject the loot table into the block

This "only chest logic" could be changed to be applied by all the container blocks too.

[GitHub repository](https://github.com/Binaris00/BiomeLootTable)`;export{e as default};