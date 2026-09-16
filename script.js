const inputBusqueda = document.getElementById('inputBusqueda');
const btnBuscar = document.getElementById('btnBuscar');
const resultado = document.getElementById('resultado');

btnBuscar.addEventListener('click', consultarPokemon);
inputBusqueda.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') consultarPokemon();
});

async function consultarPokemon() {
  const query = inputBusqueda.value.trim().toLowerCase();

  if (!query) {
    alert('Por favor escribe un nombre o ID');
    return;
  }

  resultado.innerHTML =
    '<p style="text-align:center;">Buscando en la PokeAPI...</p>';
  resultado.classList.remove('hidden');

  try {
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);

    if (!respuesta.ok) {
      resultado.innerHTML = '<p class="error">❌ Pokémon no encontrado</p>';
      return;
    }

    const data = await respuesta.json();

    const tipos = data.types.map((t) => t.type.name).join(', ');
    const pesoKg = data.weight / 10;
    const alturaM = data.height / 10;
    const imagen = data.sprites.front_default;

    resultado.innerHTML = `
      <img src="${imagen}" alt="${data.name}">
      <h2>#${data.id} - ${data.name.toUpperCase()}</h2>
      <p><strong>Tipo(s):</strong> <span>${tipos}</span></p>
      <p><strong>Altura:</strong> <span>${alturaM} m</span></p>
      <p><strong>Peso:</strong> <span>${pesoKg} kg</span></p>
    `;
  } catch (error) {
    console.error('Error:', error);
    resultado.innerHTML =
      '<p class="error">Hubo un error al conectar con la API.</p>';
  }
}
