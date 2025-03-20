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