import minimist from "minimist";
import * as jsonfile from "jsonfile";
import { PelisController } from './controllers';

const controller = new PelisController();

// Esta funcion permite 
function parseaParams(argv: string[]) {
  const resultado = minimist(argv);
  console.log("resultado: ", resultado);
  // Convertir tags a un array si es necesario
  if (resultado.tags && typeof resultado.tags === 'string') {
    resultado.tags = resultado.tags.split(',');
    console.log("resultado tags: " + resultado.tags)
  }

  return resultado;
}

async function addPelicula(params: any) {
  if (!params.id || !params.title) {
    console.error('Error: Para agregar una película, se necesita un "id" y un "title".');
    return;
  }

  const newPeli = {
    id: params.id,
    title: params.title,
    tags: params.tags || [],
  };

  try {
    const result = await controller.add(newPeli);
    console.log(result ? 'Película agregada con éxito.' : 'No se pudo agregar la película.');
  } catch (error) {
    console.error('Error agregando película:', error.message);
  }
}

async function getPelicula(params: any) {
  const id = params._[1];
  if (!id) {
    console.error('Error: Se necesita un "id" para obtener una película.');
    return;
  }

  try {
    const peli = await controller.getOne({ id: parseInt(id) });
    console.log(peli ? peli : 'No se encontró la película.');
  } catch (error) {
    console.error('Error obteniendo película:', error.message);
  }
}

async function getAll() {
  const controlador = await controller.get();
  console.log("Listado de peliculas: \n")
  console.log(controlador);
  // return controlador;
}

async function searchPeliculas(params: any) {
  if (!params.title && !params.tag) {
    console.error('Error: Para buscar, se necesita un "title" o un "tag".');
    return;
  }

  const searchOptions: any = {};
  if (params.title) searchOptions.search = { title: params.title };
  if (params.tag) searchOptions.search = { ...searchOptions.search, tag: params.tag };

  try {
    const peliculas = await controller.get(searchOptions);
    console.log(peliculas.length > 0 ? peliculas : 'No se encontraron películas.');
  } catch (error) {
    console.error('Error buscando películas:', error.message);
  }
}

async function main() {
  const params = parseaParams(process.argv.slice(2));
  const command = params._[0];
  console.log("params: " + params, "command: " + command);
  switch (command) {
    case 'add':
      await addPelicula(params);
      break;

    case 'get':
      await getPelicula(params);
      break;

    case 'search':
      await searchPeliculas(params);
      break;

    default:
      if (!command) {
        // const peliculas = await getAll();}
        getAll()
        // console.log("peliculas", peliculas);
      } else {
        console.log("Comando no reconocido. Usa 'add', 'get' o 'search'.");
      }
      break;
  }
}


main();
