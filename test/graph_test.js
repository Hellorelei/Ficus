// var cy = cytoscape({

//   container: document.getElementById('cy'), // container to render in

//   elements: [ // list of graph elements to start with
//     {data:{id: "-1"}},
//     {data:{id: "0"}},
//     {data:{id: "1"}},
//     {data:{id: "2"}},
//     {data:{id: "3"}},
//     {data:{id : "e1", source : "1", target : "2"}},
//     {data:{id : "e2", source : "-1", target : "3"}},
//     {data:{id : "e3", source : "0", target : "1"}},
//     {data:{id : "e4", source : "1", target : "-1"}},
//   ],

//   style: [ // the stylesheet for the graph
//     {
//       selector: 'node',
//       style: {
//         'background-color': '#666',
//         'label': 'data(id)'
//       }
//     },

//     {
//       selector: 'edge',
//       style: {
//         'width': 3,
//         'line-color': '#ccc',
//         'target-arrow-color': '#ccc',
//         'target-arrow-shape': 'triangle',
//         'curve-style': 'bezier'
//       }
//     }
//   ],

//   layout: {
//     name: 'circle',
//     rows: 1
//   }

// });
// class Graph{
//     constructor(nbVertices, links={}, passage_texts={} ){
//         this.nbVertices = nbVertices;
//         this.links = links;
//         this.passage_texts = passage_texts
//     }
//     showVertices(){
//         for(let i = 1; i<=this.nbVertices; i++){
//             let vertice = document.createElement("h1")
//             vertice.setAttribute("id", i)
//             vertice.setAttribute("passage_text", this.passage_texts )
//             vertice.addEventListener("click",()=>{
//                 let text_div = document.body.querySelector("div")
//                 text_div.textContent=this.passage_texts[i]
//             })
//             vertice.textContent = String(i)
//             document.body.appendChild(vertice)
//         }
//     }
//     async showGraph(){
//         console.log("bjr")
//         let blop = await this.showVertices()
//         for(let i = 1; i<=this.nbVertices; i++){
//             if(this.links[i]){
//                 for(let j in this.links[i]){
//                     let salut = document.getElementById(String(i))
//                     salut.setAttribute("class", "green")

//                 }
//             }
//         }
//     }
// }
// graph = new Graph(90, {3:[1,5]}, {3: "Je suis le monsieur Gris et je te donne une épée.", 7: "Combat les monstres méchants"})
// graph.showGraph()
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
        'background-color': 'blue',
        'label': 'data(id)'
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