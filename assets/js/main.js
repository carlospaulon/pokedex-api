const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const maxRecords = 442;
const limit = 5;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
    <li class="pokemon ${pokemon.type}" data-pokemon-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            
          <div class="detail">
            <ol class="types">
                ${pokemon.types
                  .map((type) => `<li class="type ${type}">${type}</li>`)
                  .join("")}
            </ol>

            <img
              src="${pokemon.photo}"
              alt="${pokemon.name}"
            />
          </div>
        </li>
  `;
}

function loadPokemonItems(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

//Lista
function showList() {
  document.getElementById("listView").classList.remove("hidden");
  document.getElementById("detailsView").classList.add("hidden");
}

//Detalhes
function showDetails(pokemonId) {
  document.getElementById("listView").classList.add("hidden");
  document.getElementById("detailsView").classList.remove("hidden");
  loadPokemonDetails(pokemonId);
  console.log("mostrando os detalhes do pokemon", pokemonId);
}

//Navegação SPA

//clicks nos cards
pokemonList.addEventListener("click", (e) => {
  const pokemonCard = e.target.closest(".pokemon");
  if (pokemonCard) {
    const pokemonId = pokemonCard.dataset.pokemonId; //analisar se isto está pegando o id
    showDetails(pokemonId);
  }
});

//voltar
document.addEventListener("DOMContentLoaded", () => {
  const backBtn = document.querySelector(".backBtn");
  if (backBtn) backBtn.addEventListener("click", showList);
});

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordNextPage = offset + limit;

  if (qtdRecordNextPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItems(offset, newLimit);
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItems(offset, limit);
  }
});
