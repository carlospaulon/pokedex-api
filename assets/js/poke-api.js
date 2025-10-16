const pokeApi = {};

function convertPokemonApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();

  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;
  pokemon.types = types;
  pokemon.type = type;

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

  return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
  return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokemonApiDetailToPokemon);
};

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonsDetails) => pokemonsDetails)
    .catch((error) => console.error(error))
    .finally(() => console.log("Requisição Concluída")); //opcional
};

pokeApi.getPokemonFullDetails = (pokemonId) => {
  const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
  const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
  

  return Promise.all([
    fetch(pokemonUrl).then((res) => res.json()),
    fetch(speciesUrl).then((res) => res.json()),
  ]).then(([pokemon, species]) => {

    const genusEn = species.genera.find((g) => g.language.name === "en")?.genus || "Unknown";
    const cleanedGenus = genusEn.replace("Pokémon", "").trim();

    return {
      number: pokemon.id,
      name: pokemon.name,
      types: pokemon.types.map((t) => t.type.name),
      stats: pokemon.stats,
      photo: pokemon.sprites.other.dream_world.front_default,
      abilities: pokemon.abilities,
      height: pokemon.height,
      weight: pokemon.weight,
      moves: pokemon.moves.slice(0, 10), // primeiros 10
      genus: cleanedGenus,
      evolutionUrl: species.evolution_chain.url,
    };
  });
};
