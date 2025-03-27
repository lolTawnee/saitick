
import { generateText } from './generate_text.js';

import { generateHandler } from './main.js';

const args = process.argv.slice(2);



async function run() {
  console.log(args)
  const result = generateHandler();
  
  console.log("Результат:", result);
}


run().catch(error => {
  console.error("Ошибка:", error.message);
  process.exit(1);
});
    