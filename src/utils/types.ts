export type Pokemon = {
  name: string;
  url: string;
};

export type PokemonType = {
  slot: number;
  type: {
    name: string;
    url: string;
  };
};

export type PokemonAbility = {
  slot: number;
  is_hidden: boolean;
  ability: {
    name: string;
    url: string;
  };
};
