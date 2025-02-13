const minimist = require('minimist');
import { PelisController } from './controllers';

const argv = minimist(process.argv.slice(2));

const controller = new PelisController();

async function main() {
    if (argv._.includes('add')) {
      // Lógica para agregar una película
      const result = await controller.add({
        id: argv.id,
        title: argv.title,
        tags: argv.tags.split(',')
      });
      console.log(result ? 'Película agregada' : 'Error al agregar película');
    } else if (argv._.includes('get')) {
      // Lógica para obtener una película por ID
      const peli = await controller.getOne({ id: Number(argv._[1]) });
          console.log(peli);
    } else if (argv._.includes('search')) {
      // Lógica para buscar películas
      const options = {
        search: {
          title: argv.title,
          tag: argv.tag
        }
      };
      const pelis = await controller.get(options);
      console.log(pelis);
    } else {
      // Si no hay comandos, mostrar todas las películas
      const allPelis = await controller.get();
      console.log(allPelis);
    }
  }
  
  main().catch(console.error);
  
