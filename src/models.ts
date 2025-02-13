import * as jsonfile from "jsonfile";
import * as path from 'path';
// El siguiente import no se usa pero es necesario
import "./pelis.json";
/* de esta forma Typescript se entera que tiene que incluir
el .json y pasarlo a la carpeta /dist
si no, solo usandolo desde la libreria jsonfile, no se dá cuenta

no modificar estas propiedades, agregar todas las que quieras*/
class Peli {
  id: number;
  title: string;
  tags: string[];
}

// Opciones de búsqueda por título o etiqueta
class SearchOptions {
  title?: string;
  tag?: string;
}

class PelisCollection {
  // Obtener todas las películas
  async getAll(): Promise<Peli[]> {
    try {
      const filePath = path.join(__dirname, "pelis.json");
      const allPelis1 = await jsonfile.readFile(filePath);
      return allPelis1;
    } catch (error) {
      console.error("Error leyendo el archivo de películas:", error);
      return [];
    }
  }

  // Obtener una película por su ID
  async getById(id: number): Promise<Peli | undefined> {
    const pelis = await this.getAll();
    return pelis.find((peli) => peli.id === id);
  }

  // Agregar una nueva película
  async add(peli: Peli): Promise<boolean> {
    const peliExistente = await this.getById(peli.id);
    if (peliExistente) {
      console.log(`Error: Ya existe una película con el ID ${peli.id}`);
      return false;
    } else {
      const pelis = await this.getAll();
      pelis.push(peli);
      try {
        await jsonfile.writeFile("./pelis.json", pelis);
        return true;
      } catch (error) {
        console.error("Error guardando el archivo de películas:", error);
        return false;
      }
    }
  }

// Buscar películas por título o etiqueta
async search(options: SearchOptions): Promise<Peli[]> {
  const pelis = await this.getAll();
  return pelis.filter((peli) => {
    let matches = false;
    if (options.title) {
      matches = peli.title.toLowerCase().includes(options.title.toLowerCase());
    }
    if (options.tag) {
      matches = matches || peli.tags.includes(options.tag);
    }
    return matches;
    });
  }
}
export { PelisCollection, Peli };
