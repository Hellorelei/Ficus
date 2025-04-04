// Avec une constante, tous les passages possèderaient la même instance de TAGS
// Changer un tag d'un passage viendrait à changer tous les autres
// const TAGS = {"biomes":"", "personnages":"", "actions":""}
let cy_graph = null
let LAST_DEFAULT_TAG = 31  //the number of default columns
const BIOMES = []
SORTIES_INV = ["x","v","p","r"]
let CSV_OBJ = {}

class passageTag{
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}

function refreshGraph(layout="cose"){
  cy_graph.layout({name:layout}).run()
}

function lancerPropagation(passage_dico){
  function propagation(passage_dico, passage, biome){
    if (!(BIOMES.includes(biome))){
      BIOMES.push(biome)
    }
    let to_list = passage_dico[String(passage)]["to"]
    passage_dico[String(passage)]["tags"]["biomes"]["value"]=biome
    passage_dico[String(passage)]["tags"]["biomes"]["propa"]=true
    requestAnimationFrame(()=>{
      cy_graph.nodes(`#${passage}`).style('background-color', `hsl(${(BIOMES.indexOf(biome)*30)%255}, 70%, 65%)`); // Couleur à modifier?
    })
    for(let i = 0; i < to_list.length; i++){
      if(!SORTIES_INV.includes(to_list[i]["sortie"]) && !passage_dico[to_list[i]["sortie"]]["tags"]["biomes"]["entry"] && !passage_dico[to_list[i]["sortie"]]["tags"]["biomes"]["propa"] ){
        propagation(passage_dico, to_list[i]["sortie"], biome)
      }
    }
  }
  const entries = Object.keys(passage_dico)
    .filter(key => passage_dico[key].tags?.biomes?.entry)
    .map(key => ({ id: key, biome: passage_dico[key].tags.biomes.value }));

  const uniqueBiomes = new Set(BIOMES);

  requestAnimationFrame(()=>{
    entries.forEach(entry => {
      if (!uniqueBiomes.has(entry.biome)) {
        uniqueBiomes.add(entry.biome);
        BIOMES.push(entry.biome);
      }
      propagation(passage_dico, entry.id, entry.biome);
    })
  })


  // for(id in entries){
  //   console.log(`Propagation du biome ${entries[id]}`)
  //   propagation(passage_dico, id, entries[id])
  // }
  // return new Promise((resolve)=>{resolve()})
}

function exportCSV(obj){
  // Fonction pour échapper les valeurs contenant des virgules et faussant le csv sinon
  function escapeCSVValue(value) {
    // Si ce n'est pas une string, on retourne la valeur telle quelle
    if (typeof value !== 'string') return value;
    
    // Si la valeur est déjà entourée de guillemets, on la retourne telle quelle
    if (/^".*"$/.test(value)) return value;
    
    // Si la valeur contient des virgules ou des guillemets, on l'entoure de guillemets
    // et on double les guillemets existants (règle CSV)
    if (value.includes(',') || value.includes('"')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    
    // Sinon, on retourne la valeur sans modification
    return value;
  }
  // Initialise les headers
  const first_key = Object.keys(obj)[0]
  let csv_array = [["numero_passage",]]
  csv_array[0] = csv_array[0].concat(Object.keys(obj[first_key]["to"][0]))
  csv_array[0] = csv_array[0].concat(Object.keys(obj[first_key]["tags"]))
  // loop sur l'objet de données
  for(i in obj){
    // loop sur les sorties / lignes
    for(let j = 0; j < obj[String(i)]["to"].length; j++){
      let line_csv = [""]
      // loop sur le dico des sorties
      for(k in obj[String(i)]["to"][j]){
        line_csv.push(escapeCSVValue(obj[String(i)]["to"][j][k]));
      }
      // rajoute le numéro de passage uniquement si c'est la 1ère sortie
      if(j===0){
        line_csv[0]=String([i])
        // loop sur les tags, et le rajoute au csv
        for(l in obj[String(i)]["tags"]){
          line_csv.push(escapeCSVValue(obj[String(i)]["tags"][l]["value"]))
        }
      }
      csv_array.push(line_csv)
    }
  }
  let csv_txt = ''
  console.log(csv_array)
  csv_array.forEach(row =>{
    csv_txt += row.join(',') + '\n'
  })
  const blob = new Blob([csv_txt], { type: 'text/csv;charset=utf-8,' })
  const objUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', objUrl)
  link.setAttribute('download', 'File.csv')
  link.textContent = 'Click to Download'
  
  // Trouver l'élément avec l'ID 'downloadCSV' et y ajouter le lien
  const downloadCSVButton = document.getElementById('downloadCSV');
  if (downloadCSVButton) {
    downloadCSVButton.addEventListener('click', () => {
      link.click();  // Simuler le clic sur le lien pour télécharger
    });
  }
  
  return csv_txt
  
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
    let lastValidId = null

    for (let i = 0; i < papa_results.length; i++) {
      let obj = papa_results[i]
      const id = obj.numero_passage || lastValidId

      if (!results[id]){
        results[id] = {
          text: "",
          to: [],
          from: [],
          tags: { biomes: {}, personnages: {}, actions: {} }
        };
      }

      if(obj.numero_passage){
        lastValidId = obj.numero_passage
        // let added_tags = {"biomes":"", "personnages":"", "actions":""}
        for(l in Object.fromEntries(Object.entries(obj).slice(LAST_DEFAULT_TAG, 100))){
          results[id].tags[l] = {"value" : obj[l], "entry" : Boolean(obj[l])}
        }
        results[id]["to"].push(Object.fromEntries(Object.entries(obj).slice(1, LAST_DEFAULT_TAG)))
      }else{
        results[id]["to"].push(Object.fromEntries(Object.entries(obj).slice(1, LAST_DEFAULT_TAG)))
      }
    }
    console.log(results)
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
      if(!SORTIES_INV.includes(String(dico[keys]["to"][i]["sortie"])) && String(dico[keys]["to"][i]["sortie"]) != "v"){
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
  if (cy_graph) {
    cy_graph = null;
  }
  await new Promise(resolve => {
    if (document.readyState === 'complete') {
        resolve();
    } else {
        document.addEventListener('DOMContentLoaded', resolve);
    }
  });

  // Libérer la mémoire
  CSV_OBJ = {};
  BIOMES.length = 0;
  CSV_OBJ = await getCSV(url)
  console.log(CSV_OBJ)
  cy_list = await createCyElementsFromDico(CSV_OBJ)
  console.log(cy_list)
  CSV_OBJ["172"]["tags"]["biomes"]={"value":"forêt","entry":true}
  CSV_OBJ["162"]["tags"]["biomes"]={"value":"océan","entry":true}
  CSV_OBJ["250"]["tags"]["biomes"]={"value":"vallée","entry":true}
  CSV_OBJ["87"]["tags"]["biomes"]={"value":"glace","entry":true}
  CSV_OBJ["301"]["tags"]["biomes"]={"value":"chemin","entry":true}
  CSV_OBJ["402"]["tags"]["biomes"]={"value":"château","entry":true}
  CSV_OBJ["53"]["tags"]["biomes"]={"value":"marais","entry":true}
  // console.log(exportCSV(CSV_OBJ))
  cy_graph = cytoscape({

    container: document.getElementById('cy'), // container to render in
  
    elements: cy_list,
  
    style: [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'background-color': '#FFFACD', // Couleur temporaire
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
  console.log(CSV_OBJ)
  const progressBar = document.querySelector(".progress-bar");
  return new Promise(async (resolve)=>{
    progressBar.style.width = "64%";
    progressBar.innerHTML = "64%"
    await lancerPropagation(CSV_OBJ)
    resolve()
  })
}
// gérer l'importation du CSV dans le graphe
document.addEventListener("DOMContentLoaded", function () {
  let isImportating = false
  const modal = document.getElementById("csvModal");
  const openBtn = document.querySelector(".open-modal-btn");
  const closeBtn = document.querySelector(".close-btn");
  const closeCross = document.querySelector(".btn-close");
  const fileInput = document.getElementById("csvFile");
  const progress = document.querySelector(".progress");
  const progressBar = document.querySelector(".progress-bar");
  const numInput = document.getElementById("csvColumns");

  let importedCSV = null; // Variable pour stocker le fichier CSV

  openBtn.addEventListener("click", () => {
    if(!isImportating){
      modal.style.display = "flex"
    }
  });
  closeBtn.addEventListener("click", () => {
    if(!isImportating){
      modal.style.display = "none"
      progressBar.style.display = "none"
      progressBar.style.width = "17%";
      progressBar.innerHTML = "17%"
    }
  });
  closeCross.addEventListener("click", () => {
    if(!isImportating){
      modal.style.display = "none"
      progressBar.style.display = "none"
      progressBar.style.width = "17%";
      progressBar.innerHTML = "17%"
    }
  });

  fileInput.addEventListener("change", (event) => {
    LAST_DEFAULT_TAG = numInput.value
    isImportating = true
      const file = event.target.files[0]; // Récupérer le fichier sélectionné
      progressBar.style.width = "17%";
      progressBar.innerHTML = "17%"
      if (file && file.type === "text/csv") {
        // modal.style.display = "none"
        importedCSV = URL.createObjectURL(file); // Générer une URL temporaire du fichier
        console.log("Fichier CSV chargé :", importedCSV);
        progress.style.display = "flex";
        progressBar.style.display = "flex";
        createGraphe(importedCSV).then(()=>{          
          setTimeout(() => {
            progressBar.style.width = "89%";
            progressBar.innerHTML = "89%"
            setTimeout(() => {
              progressBar.style.width = "100%";
              progressBar.innerHTML = "100%"
              isImportating = false
            }, 4000);
          }, 4000);
        })
      } else {
          alert("Veuillez sélectionner un fichier CSV valide !");
          fileInput.value = ""; // Réinitialiser l'input si le fichier n'est pas un CSV
      }
  });
});

createGraphe("pirate_des_sept_mers_export.csv")