const COUNT_PER_PAGE = 15;

export async function fetchPokemon(page: number) {
  const limit = COUNT_PER_PAGE;
  const offset = (page - 1) * COUNT_PER_PAGE;
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
  );
  const pokemon = await response.json();
  return pokemon.results;
}

export async function fetchPokemonDetail(pokemonId: string) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
  );
  const pokemon = await response.json();
  return pokemon;
}
