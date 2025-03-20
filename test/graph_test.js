// main.js

// Modules pour la gestion de l'appli et la création de la BrowserWindow native browser window
const { app, BrowserWindow } = require('electron')
const path = require('node:path')

const createWindow = () => {
  // Création de la browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // et chargement de l'index.html de l'application.
  mainWindow.loadFile('index.html')

  // Ouvrir les outils de développement.
  // mainWindow.webContents.openDevTools()
}

// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // Sur macOS il est commun de re-créer une fenêtre  lors 
    // du click sur l'icone du dock et qu'il n'y a pas d'autre fenêtre ouverte.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quitter quand toutes les fenêtres sont fermées, sauf sur macOS. Dans ce cas il est courant
// que les applications et barre de menu restents actives jusqu'à ce que l'utilisateur quitte 
// de manière explicite par Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})



// Dans ce fichier vous pouvez inclure le reste du code spécifique au processus principal. Vous pouvez également le mettre dans des fichiers séparés et les inclure ici.
cy_list = [{data: { id: -1}}]
for(let i = 0; i<400;i++){
  cy_list.push({data: { id: String(i) }})
}
for(let i = 0; i<600;i++){
  cy_list.push({data: { id: `e${String(i)}`, source: `${Math.round(Math.random()*399)}`, target: `${Math.round(Math.random()*399)}` }})
}

var cy = cytoscape({

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