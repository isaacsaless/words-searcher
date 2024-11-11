import { JSDOM } from "jsdom";
import fs from "fs"

const letras = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];
let pagina = 1;
const palavras = [] as any;

async function getWords(letra: string, pagina: number = 1) {
    const response = await fetch(
        `https://vocabularyserver.com/brased/index.php?letra=${letra}&p=${pagina}`
      );
      const html = await response.text();
    
      const dom = new JSDOM(html);
      const document = dom.window.document;
      const divListaLetras = document.querySelector('#listaLetras');

        if (!divListaLetras) {
            console.log('Div com a lista de letras não encontrada.');
            return;
        }
      const olElement = divListaLetras.querySelector('ol');
    
      if (olElement) {
          const listItems = olElement.querySelectorAll('li');
          const itemsArray = Array.from(listItems).map(item => item.textContent!.trim());
  
          palavras.push(...itemsArray);
      } else {
          console.log("A lista ordenada não foi encontrada.");
      }

        const nextButton = document.querySelector('a.next-off');
        if (nextButton) {
            pagina++;
            getWords(letra, pagina)
            console.log('Próxima página');
        } else {
            pagina = 1;
            console.log('Fim da lista');
        }
}

function salvarPalavrasEmArquivo() {
    const conteudo = palavras.join('\n');
    fs.writeFileSync('palavras.txt', conteudo, 'utf8');
    console.log('Arquivo palavras.txt salvo com sucesso!');
}

(async () => {
    for (const letra of letras) {
        await getWords(letra);
    }
    salvarPalavrasEmArquivo();
})();