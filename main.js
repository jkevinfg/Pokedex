const container = document.querySelector('.container')
const result = document.querySelector('#result')
const form = document.querySelector('#form')
const inputPokemon = document.querySelector('#inputPokemon')
const paginatorDiv = document.querySelector('#paginator')
const opciones = document.querySelector('.opciones')

let pokemonsPage = 3
let pokemonInitial = 0
let totalPages


form.addEventListener('submit', validate)
inputPokemon.addEventListener('input',filter)



async function filter(event) {
    opciones.innerHTML = ''
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1050`
    const respuesta = await fetch(url)
    const resultado = await respuesta.json()
    const  text = event.target.value.toLowerCase().trim()
    if (text.length > 1){
        for (let pokemon of resultado.results){
            let name = pokemon.name
            if(name.indexOf(text) === 0 ){
                opciones.innerHTML += `${name} `   
            }
        }
    }
}
 function validate (event)  {
    event.preventDefault()
    const pokemon = inputPokemon.value.toLowerCase()
    console.log(pokemon)
    if(pokemon === ''){
        showError("Empty field 🙄")
    }
    searchPokemon(pokemon)
}

async function  searchPokemon  (nameOrId) {
    const url = `https://pokeapi.co/api/v2/pokemon/${nameOrId}`
    loader()
    try{
        const respuesta = await fetch(url)
        const resultado = await respuesta.json()
        result.innerHTML = ''
        showPokemon(resultado)
    }catch{
        showError(`${nameOrId}  is not a pokemon  😟` ) 
    }
}



function showError (message)  {
    const confirm = document.querySelector('.message')
    if(!confirm){
        pokemonInitial = 0
        const text = document.createElement('p')
        text.innerHTML = `<strong> ${message}</strong>`
        text.classList.add('message')
        form.appendChild(text)
        setTimeout(()=> {
            text.remove()
            listPokemon()
        },3000)

    }
}

function  clearHtml (block) {
    while(block.firstChild){
        block.removeChild(block.firstChild)
    }
}


function  loader() {
    clearHtml(result)
    const divLoader = document.createElement('div')
    divLoader.innerHTML = `<img  class="loader"src="./img/pokebola.svg" alt="loading"> loading
    `
    result.appendChild(divLoader)
}
 

async function  listPokemon () {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${pokemonInitial}&limit=${pokemonsPage}`
    loader()
    const respuesta = await fetch(url)
    const resultado = await respuesta.json()
    totalPages = pages(resultado.count)
    showPokemons(resultado.results)
}


function  pages (total)  {
    return parseInt(Math.ceil(total / pokemonsPage))
}


 async function showPokemons(pokemons) {
    clearHtml(result)
    for ( let i = 0 ; i<pokemons.length;i++){
        const {url} = pokemons[i]
        const respuesta = await fetch(url)
        const resultado = await respuesta.json()
        showPokemon(resultado)
    }
    clearHtml(paginatorDiv)
    printPaginator()
}
                                                                                     
function printPaginator ()  {
    
    const arrowBack = document.createElement('a')
    arrowBack.innerHTML= `<img class = "arrow" src="./img/back.svg" alt="atras">`
    if(pokemonInitial > 0){
        arrowBack.href = '#'
        arrowBack.onclick = () =>{
            pokemonInitial = pokemonInitial - pokemonsPage
            listPokemon()
            }
        }
    paginatorDiv.appendChild(arrowBack)

    for(let i = 1 ; i<totalPages+1 ; i++){
        const button = document.createElement('a')
        if (i < 4 || i> totalPages - 4){
            button.href = '#'
            button.innerHTML = ` ${i}`
            button.onclick = () =>{
                pokemonInitial = (i-1) * pokemonsPage
                listPokemon()
            }
            paginatorDiv.appendChild(button)
        }
    }
        
    const arrowNext = document.createElement('a')
    arrowNext.href = '#'
    arrowNext.innerHTML= `<img class = "arrow" src="./img/next.svg" alt="siguiente">`
    arrowNext.onclick = () =>{
        pokemonInitial = pokemonInitial + pokemonsPage
        listPokemon()
    }
    paginatorDiv.appendChild(arrowNext)
}

function  showPokemon (datos) {
    const {name, sprites :{other:{dream_world:{ front_default}}} , types , height,weight,stats,id} = datos
    result.innerHTML  += `<div class="card">
                            <div class="card__header">
                                <img src="${front_default}" alt="">
                            </div>
                            <div class="card__body">
                                <div class="card__body__name">
                                Name : ${name}
                                </div>
                                <div class="card__body__text">
                                    <div class="card__body__text__type type${id}">
                                     Type :
                                    </div>
                                    <div class="card__body__text__dimensions">
                                        <p>Height : ${height/10}m</p>
                                        <p>Weight :  ${weight/10}kg</p>
                                    </div>
                                </div>
                            </div>
                                <div class="card__stats_stat stats${id} "></div>   
                        </div>`
    stats.forEach((stat) => {
        const  {base_stat, stat : {name}}  =  stat
        const text2 = document.querySelector(`.stats${id}`)
        text2.innerHTML += `<div class="card__stats_stat__name" > ${name}        
                            </div>
                            <div class="card__stats_stat__value progressBar${name}  ${name}${id}"> 
                                 ${base_stat}
                             </div>`
        const progressBar = document.querySelector(`.${name}${id}`)
        progressBar.style.width = `${(base_stat/160)*100}%`
    })
    types.forEach((item) => {
        const { type : {name} } = item
        const text = document.querySelector(`.type${id}`)
        text.innerHTML += `${name} `
    })

}




listPokemon()
