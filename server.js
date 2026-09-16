const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.static('.'));

const readData = () => {
  try {
    const data = fs.readFileSync('./db.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer db.json:', error);
    return { pokemon: [] };
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync('./db.json', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error al escribir db.json:', error);
  }
};

app.get('/pokemon', (req, res) => {
  const data = readData();
  res.json(data.pokemon);
});

app.get('/pokemon/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const pokemon = data.pokemon.find((p) => p.id === id);

  if (!pokemon) {
    return res.status(404).json({ message: 'Pokémon no encontrado' });
  }
  res.json(pokemon);
});

app.post('/pokemon', (req, res) => {
  const data = readData();
  const newPokemon = {
    id:
      data.pokemon.length > 0
        ? Math.max(...data.pokemon.map((p) => p.id)) + 1
        : 1,
    ...req.body,
  };

  data.pokemon.push(newPokemon);
  writeData(data);
  res.status(201).json(newPokemon);
});

app.put('/pokemon/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.pokemon.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Pokémon no encontrado' });
  }

  data.pokemon[index] = { ...data.pokemon[index], ...req.body };
  writeData(data);
  res.json({
    message: 'Pokémon actualizado con éxito',
    pokemon: data.pokemon[index],
  });
});

app.delete('/pokemon/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const index = data.pokemon.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Pokémon no encontrado' });
  }

  const deletedPokemon = data.pokemon.splice(index, 1);
  writeData(data);
  res.json({ message: 'Pokémon eliminado con éxito', pokemon: deletedPokemon });
});

app.listen(PORT, () => {
  console.log(`Servidor Express listo en puerto ${PORT}`);
});
