// Avec une constante, tous les passages possèderaient la même instance de TAGS
// Changer un tag d'un passage viendrait à changer tous les autres
// const TAGS = {"biomes":"", "personnages":"", "actions":""}
let cy_graph = null
const BIOMES = []

function propagation(passage_dico, passage, biome){
  if (!(BIOMES.includes(biome))){
    BIOMES.push(biome)
  }
  console.log(passage_dico)
  let to_list = passage_dico[String(passage)]["to"]
  passage_dico[String(passage)]["tags"]["biomes"]=biome
  cy_graph.nodes(`#${passage}`).style('background-color', `hsl(${(BIOMES.indexOf(biome)*20)%255}, 50%, 50%)`);
  for(let i = 0; i < to_list.length; i++){
    console.log(`passage : ${passage}, ${i}`)
    if(to_list[i]["sortie"] !== "x" && passage_dico[to_list[i]["sortie"]]["tags"]["biomes"] == ""){
      propagation(passage_dico, to_list[i]["sortie"], biome)
    }
  }
}

async function getCSV(url) {
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }
    let text_csv = await response.text();
    // let papa_results = []
    Papa.parse(text_csv, {
      header:true,
      skipEmptyLines: true, // Ignorer les lignes vides
      complete: (results) => {
        papa_results = results.data; // Afficher les données
      },
      error: (err) => {
        console.error('Erreur lors du parsing du CSV:', err);
      },
    });
    let results = {}
    for (let i = 0; i < papa_results.length; i++) {
      // En JS, les assignations d'un objet à une variable créent un pointeur en mémoire vers celui-ci plutôt qu'une
      // copie de ce dernier. Cette ligne permet d'en faire une copie, de laquelle il est possible de delete sans compromettre papa_results
      const obj = Object.assign({}, papa_results[i]);
      if(obj['numero_passage']==""){
        delete obj['numero_passage']
        let k = i-1
        while(papa_results[k]['numero_passage']==""){
          k-=1;
        }
        let id = papa_results[k]['numero_passage']
        results[id]["to"].push(obj)
      }else{
        let id = papa_results[i]['numero_passage']
        delete obj['numero_passage']
        console.log(`Ajout : ${id}`)
        results[id]={"text":"", "to":[obj], "from":[], "tags":{"biomes":"", "personnages":"", "actions":""}}
      }
    }
    console.log(results)
    
    
    
    //Problème lorsque le csv contient des retours à la lignes et des virgules
    //Abandonné : utilisation de Papaparse

    // let lines = text_csv.split('\n');
    // let headers = lines[0].split(',')
    // let result = {}
    // for (let i = 1; i < lines.length; i++) {
    //   const obj = {};
    //   const currentLine = lines[i].split(',');

    //   // Skip les lignes vides
    //   if (currentLine.length === headers.length) {
    //     obj["id"]=currentLine[1]
    //     for (let j = 2; j < headers.length; j++) {
    //       obj[headers[j].trim()] = currentLine[j].trim();
    //     }
    //     if(currentLine[0]==""){
    //       let k = i
    //       while(lines[k].split(',')[0]==""){
    //         k-=1;
    //       }
    //       let id = lines[k].split(',')[0] - 1
    //       console.log(id)
    //       result[id]["to"].push(obj)
    //     }else{
    //       console.log(`Ajout : ${currentLine[0]}`)
    //       result[currentLine[0]]={"text":"", "to":[obj], "from":[], "tags":TAGS}
    //     }
    // }
  // }
    return results;
  } catch (error){
    console.error('Erreur lors de la récupération ou du traitement du CSV:', error);
    return null;
  }
};
function createCyElementsFromDico(dico){
  cy_list = []
  for(let i = 1; i < Object.keys(dico)[0];i++){
    // dico[String(i)]={"text":"", "to":[], "from":[], "tags":{"biomes":"", "personnages":"", "actions":""}}
    cy_list.push({data: { id: String(i) }})
  }
  for(let keys in dico){
    cy_list.push({data : {id: String(keys)}})
  }
  for(let keys in dico){
    for (let i = 0; i < dico[keys]["to"].length; i++){
      if(String(dico[keys]["to"][i]["sortie"]) != "x" && String(dico[keys]["to"][i]["sortie"]) != "v"){
        cy_list.push({data : {id: `e${String(keys)}-${String(dico[keys]["to"][i]["sortie"])}`, source : String(keys), target : String(dico[keys]["to"][i]["sortie"])}})
      }
    }
  }
  return cy_list
}

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

async function createGraphe(url="A_COPIER_labyrinthe_de_la_mort - template_ldvelh.csv") {
  let csv = await getCSV(url)
  console.log(csv)
  cy_list = await createCyElementsFromDico(csv)
  console.log(cy_list)
  
  cy_graph = cytoscape({

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
  cy_graph.on('click', 'node', function(evt){
    console.log( 'clicked ' + this.id() );
    nodeID = this.id()
    cy_graph.nodes().style('background-color', '#FFFACD');
    cy_graph.nodes(`[id = "${nodeID}"]`).style('background-color', 'blue');
    newTabOnClick(nodeID)
  });
  
  
  cy_graph.on('click', function(event) {
    // Vérifie si l'élément cliqué est le fond (pas un node)
    if (event.target === cy_graph) {
        cy_graph.nodes().style('background-color', '#FFFACD');
        destroySideTab();
  
    }
  });
  
  cy_graph.on('click', 'node', function(event) {
    // Empêche l'exécution de maFonction si un node est cliqué
    event.stopPropagation();
    
  });
  csv["262"]["tags"]["biomes"]="forêt"
  propagation(csv,310, "montagne")
}
// gérer l'importation du CSV dans le graphe
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("csvModal");
  const openBtn = document.querySelector(".open-modal-btn");
  const closeBtn = document.querySelector(".close-btn");
  const fileInput = document.getElementById("csvFile");

  let importedCSV = null; // Variable pour stocker le fichier CSV

  openBtn.addEventListener("click", () => modal.style.display = "flex");
  closeBtn.addEventListener("click", () => modal.style.display = "none");

  fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0]; // Récupérer le fichier sélectionné
      if (file && file.type === "text/csv") {
          importedCSV = URL.createObjectURL(file); // Générer une URL temporaire du fichier
          console.log("Fichier CSV chargé :", importedCSV);
          createGraphe(importedCSV)
          
      } else {
          alert("Veuillez sélectionner un fichier CSV valide !");
          fileInput.value = ""; // Réinitialiser l'input si le fichier n'est pas un CSV
      }
  });
});



createGraphe()