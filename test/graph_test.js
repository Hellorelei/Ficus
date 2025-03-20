async function getCSV(url) {
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }
    let text_csv = await response.text();
    let lines = text_csv.split('\n');
    let headers = lines[0].split(',')
    let result = []
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentLine = lines[i].split(',');

      // Assurer que la ligne n'est pas vide
      if (currentLine.length === headers.length) {
        for (let j = 0; j < headers.length; j++) {
          if(currentLine[0]==""){

          }
          obj[headers[j].trim()] = currentLine[j].trim();
        }
        result.push(obj);
      }
    }
    return result;
  } catch (error){
    console.error('Erreur lors de la récupération ou du traitement du CSV:', error);
    return null;
  }
};

function createSampleCy(){
  cy_list = [{data: { id: -1}}]
  for(let i = 0; i<100;i++){
    cy_list.push({data: { id: String(i) }})
  }
  for(let i = 0; i<180;i++){
    cy_list.push({data: { id: `e${String(i)}`, source: `${Math.round(Math.random()*99)}`, target: `${Math.round(Math.random()*99)}` }})
  }
  return cy_list
}

function destroySideTab() {
  const element = document.getElementById("sideTab");
  if (element) {
    element.remove();
  }
}

function newTabOnClick(nodeID) {
  console.log("Salut" + nodeID)
  
  destroySideTab()

  const div = document.createElement("div");
    div.id = "sideTab" ;
    div.className = "sideTab";
    document.body.appendChild(div);
}

cy_list=createSampleCy()

console.log("Bonjour")
let csv = getCSV("A_COPIER_labyrinthe_de_la_mort - template_ldvelh.csv")
console.log(csv)

let cy = cytoscape({

  container: document.getElementById('cy'), // container to render in

  elements: cy_list,

  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#FFFACD',
        'border-width':'1',
        'border-color': 'black',
        'border-opacity':'1',
        'label': 'data(id)',
        'text-valign':'center',
        'text-halign':'center',
        // 'font-size':10,
        // 'font-family':'Serif'
      }
    },

    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier'
      }
    }
  ],

  layout: {
    name: 'cose',
    rows: 1
  }

});
//event listener on node click
cy.on('click', 'node', function(evt){
  console.log( 'clicked ' + this.id() );
  nodeID = this.id()
  newTabOnClick(nodeID)
});


cy.on('click', function(event) {
  // Vérifie si l'élément cliqué est le fond (pas un node)
  if (event.target === cy) {
      destroySideTab();
  }
});

cy.on('click', 'node', function(event) {
  // Empêche l'exécution de maFonction si un node est cliqué
  event.stopPropagation();
});


