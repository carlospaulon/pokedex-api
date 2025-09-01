let currentPokemon = null;

function loadPokemonDetails(pokemonId) {
  pokeApi.getPokemonFullDetails(pokemonId).then((pokemon) => {
    currentPokemon = pokemon;
    renderPokemonHeader(pokemon);
    showTab("about");
  });
}

function renderPokemonHeader(pokemon) {
  document.querySelector(".pokemonName").textContent = pokemon.name;

  document.getElementById("pokemonNumber").textContent = `#${pokemon.number}`;

  const typesContainer = document.getElementById("pokemonTypes");
  typesContainer.innerHTML = `${pokemon.types
    .map((type) => `<li class="type ${type} detail">${type}</li>`)
    .join("")}`; //estilo + revisar

  document.getElementById("pokemonPhoto").src = pokemon.photo;
  document.getElementById("pokemonPhoto").alt = pokemon.name;

  const detailsView = document.getElementById("detailsView");
  detailsView.className = `pokemon-details ${pokemon.types[0]}`;
}

function showTab(tabName) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

  const content = document.getElementById("tabContent");
  switch (tabName) {
    case "about":
      content.innerHTML = renderAbout(currentPokemon);
      break;
    case "stats":
      content.innerHTML = renderStats(currentPokemon);
      break;
    case "evolution":
      content.innerHTML = "<p>Evolution em desenvolvimento...</p>";
      break;
    case "moves":
      content.innerHTML = renderMoves(currentPokemon);
      break;
  }
}

function renderAbout(pokemon) {
  return `
<div class="about-info">
      <p>Species: ${pokemon.genus}</p>
      <p>Height: ${pokemon.height / 10}m</p>
      <p>Weight: ${pokemon.weight / 10}kg</p>
      <p>Abilities: ${pokemon.abilities
        .map((a) => a.ability.name)
        .join(", ")}</p>
    </div>
    `;
}

function renderStats(pokemon) {
  return `
    <div class="stats-container">
    ${pokemon.stats
      .map(
        (stat) => `
      <div class="stat-row">
        <span class="stat-name">${stat.stat.name}</span> 
        <span class="stat-value">${stat.base_stat}</span>
        <div class="stat-bar">
          <div class="stat-fill" style="width: ${stat.base_stat / 2}%"></div>
        </div>
      </div>
    `
      )
      .join("")}
    </div>
  `;
}

function renderEvolution(pokemon) {

}

function renderMoves(pokemon) {
  return `
    <div class="moves-list">
     
      ${pokemon.moves.map((move) => `<p class="moves">${move.move.name}</p>`).join("")}
    </div>
  `;
}

document.querySelector(".tabs").addEventListener("click", (e) => {
  if (e.target.classList.contains("tab")) {
    showTab(e.target.dataset.tab);
  }
});
