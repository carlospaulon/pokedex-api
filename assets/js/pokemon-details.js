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

async function getEvolutionChain(evolutionUrl) {
  const response = await fetch(evolutionUrl);
  const data = await response.json();
  return data;
}

function processEvolutionChain(evolutionData) {
  const evolutionChain = [];
  let currentStage = evolutionData.chain;

  while (currentStage) {
    const speciesUrl = currentStage.species.url;
    const parts = speciesUrl.split("/");
    const id = parts[parts.length - 2];
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;

    evolutionChain.push({
      name: currentStage.species.name,
      image: imageUrl,
    });

    if (currentStage.evolves_to.length > 0) {
      currentStage = currentStage.evolves_to[0];
    } else {
      break;
    }
  }
  console.log(evolutionChain);

  return evolutionChain;
}

//opções
async function showTab(tabName) {
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
      const evolutionData = await getEvolutionChain(
        currentPokemon.evolutionUrl
      );
      const processedChain = processEvolutionChain(evolutionData);
      content.innerHTML = renderEvolution(processedChain);
      break;
    case "moves":
      content.innerHTML = renderMoves(currentPokemon);
      break;
  }
}

//funções das opções de detalhes
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

function renderEvolution(evolutionChain) {
  return `
    <div class="evolution-chain">
      ${evolutionChain
        .map(
          (evolution, index) => `
        <div class="evolution-stage">
          <img src="${evolution.image}" alt="${evolution.name}">
          <p>${evolution.name}</p>
        </div>
        ${index < evolutionChain.length - 1 ? '<span class="arrow">→</span>' : ""}
        `
        )
        .join("")}
    </div>
  `;
}

function renderMoves(pokemon) {
  return `
    <div class="moves-list">
     
      ${pokemon.moves
        .map((move) => `<p class="moves">${move.move.name}</p>`)
        .join("")}
    </div>
  `;
}

document.querySelector(".tabs").addEventListener("click", (e) => {
  if (e.target.classList.contains("tab")) {
    showTab(e.target.dataset.tab);
  }
});
