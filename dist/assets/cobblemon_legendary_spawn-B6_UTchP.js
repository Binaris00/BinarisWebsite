var e=`---
tags:
  - Fabric
  - Cobblemon
  - Server-Work
---
### Cobblemon Legendary Spawn

![Cobblemon Legendary Spawn](cobblemon_legendary_spawn_img.png)

Add news config to modify how/when a custom list of Pokémons (normally legendaries) will spawn, this handles things like flying/water spawn, special biome/weather conditions, and probability calculations, all inside a simple and fast config.

The server has an internal ticker (with configurable min. and max. time values) that, when concluded, selects a random player with a random "legendary Pokémon," checks if spawn probability is met (normally 20% of successful), and then checks if the player fulfills the wanted conditions, like being in a valid spawn and biome.

This includes a configurable time that the probabilities and spawn rates increase, called "boost", this could also be changed.

You can define the wanted Pokémon in a JSON file, defining the wanted biomes, daytime, location (some Pokémon should be in the sky, land, or water only), weather, and internal probability to spawn that Pokémon.

[YouTube video](https://www.youtube.com/watch?v=Hk8Sts2mECo)`;export{e as default};