import * as jsonfile from 'jsonfile';

interface Peli {
  id: number;
  title: string;
  tags: string[];
}

class PelisCollection {
    getById: any;
    getAll: any;
    search: any;
    async add(peli: Peli): Promise<boolean> {
        try {
          const existingPeli = await this.getById(peli.id);
          if (existingPeli) {
            return false;
          }
          const data = await jsonfile.readFile("./pelis.json");
          data.push(peli);
          await jsonfile.writeFile("./pelis.json", data);
          return true;
        } catch (error) {
          console.error("Error adding movie:", error);
          return false;
        }
      }
      
  }
  

export { PelisCollection, Peli };
