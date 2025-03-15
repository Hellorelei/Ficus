class Graph{
    constructor(nbVertices, links={}, passage_texts={} ){
        this.nbVertices = nbVertices;
        this.links = links;
        this.passage_texts = passage_texts
    }
    showVertices(){
        for(let i = 1; i<=this.nbVertices; i++){
            let vertice = document.createElement("h1")
            vertice.setAttribute("id", i)
            vertice.setAttribute("passage_text", this.passage_texts )
            vertice.addEventListener("click",()=>{
                let text_div = document.body.querySelector("div")
                text_div.textContent=this.passage_texts[i]
            })
            vertice.textContent = String(i)
            document.body.appendChild(vertice)
        }
    }
    async showGraph(){
        console.log("bjr")
        let blop = await this.showVertices()
        for(let i = 1; i<=this.nbVertices; i++){
            if(this.links[i]){
                for(let j in this.links[i]){
                    let salut = document.getElementById(String(i))
                    salut.setAttribute("class", "green")

                }
            }
        }
    }
}
graph = new Graph(90, {3:[1,5]}, {3: "Je suis le monsieur Gris et je te donne une épée.", 7: "Combat les monstres méchants"})
graph.showGraph()