const container = document.querySelector('.container')
const result = document.querySelector('#result')
const form = document.querySelector('#form')
const messageError  = document.querySelector('.message-error')
const inputPokemon = document.querySelector('#inputPokemon')
const paginatorDiv = document.querySelector('#paginator')
const optiones = document.querySelector('#optiones')

let pokemonsPage = 3 // cuantos pokemones por pagina se van a mostrar
let pokemonInitial = 0 // apartir de que pokemon listamos
let totalPages 

form.addEventListener('submit', validate)
inputPokemon.addEventListener('keydown',filter)

showPokemons()

async function validate (event)  {
    event.preventDefault()
    const pokemon = inputPokemon.value.toLowerCase()
    if(pokemon === ''){
        showError("Campo vacío 🙄")
    }else{
        try{
            const pokemonsearch = await fetchPokemon(pokemon)
            clearHtml(result)
            showPokemon(pokemonsearch)}
        catch{
            showError("no hay")
        }
    }
}

async function  fetchPokemon  (nameOrId) {
    const url = `https://pokeapi.co/api/v2/pokemon/${nameOrId}`
    const respuesta = await fetch(url)
    const resultado = await respuesta.json()
    return resultado
}
async function fetchPokemons (pokemonInitial,pokemonsPage) {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${pokemonInitial}&limit=${pokemonsPage}`
    const respuesta = await fetch(url)
    const resultado = await respuesta.json()
    totalPages = pages(151)
    return resultado.results
}
async function filter(event) {
    clearHtml(optiones)
    const pokemons =  await fetchPokemons(0,151)
    const  text = event.target.value.toLowerCase().trim()
        for (let pokemon of pokemons){
            let name = pokemon.name
            if(name.indexOf(text) === 0  && text.length > 0){
                const optionPokemon = document.createElement('option')
                optionPokemon.value = `${name}`
                optiones.appendChild(optionPokemon)
            }
        }
}                                              

async function showPokemons() {
    loader()
    const pokemons =  await fetchPokemons(pokemonInitial,pokemonsPage)
    clearHtml(result)
    for ( let i = 0 ; i<pokemons.length;i++){
            const {url,name} = pokemons[i]
            const pokemon = await fetchPokemon(name)
            showPokemon(pokemon)
        
    }
    clearHtml(paginatorDiv)
    printPaginator()
}
function  showPokemon (datos) {
    const {name, sprites :{other:{dream_world:{ front_default}}} , types , height,weight,stats,id} = datos
    result.innerHTML  += `<div class="column is-4 card">
                            <div class=" image is-5by4 card__header">
                                <div>#${id}</div>
                                <img src="${front_default}" alt="">
                            </div>
                            <div class=" card__body">
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
function printPaginator ()  {   
    const arrowBack = document.createElement('a')
    arrowBack.innerHTML = 'Atrás'
    arrowBack.classList.add('pagination-previous')
    if(pokemonInitial > 0){
        arrowBack.href = '#'
        arrowBack.onclick = () =>{
            pokemonInitial = pokemonInitial - pokemonsPage
            showPokemons()
            }
        }
    paginatorDiv.appendChild(arrowBack)

    const arrowNext = document.createElement('a')
    arrowNext.innerHTML = 'Siguiente'
    arrowNext.classList.add('pagination-next')
    arrowNext.onclick = () =>{
        pokemonInitial = pokemonInitial + pokemonsPage
        showPokemons()
    }   
    paginatorDiv.appendChild(arrowNext)   
}

function showError (message)  {
    const confirm = document.querySelector('.message')
    if(!confirm){
        const text = document.createElement('p')
        text.innerHTML = `<strong> ${message}</strong>`
        text.classList.add('message','is-danger')
        messageError.appendChild(text)
        setTimeout(()=> {
            text.remove()
        },3000)

    }
}
function  clearHtml (block) {
    while(block.firstChild){
        block.removeChild(block.firstChild)
    }
}
function  loader() {
    const divLoader = document.createElement('div')
    divLoader.innerHTML = `<img  class="loader"src="./img/pokebola.svg" alt="loading">`
    result.appendChild(divLoader)
}
function  pages (total)  {
    return parseInt(Math.ceil(total / pokemonsPage))
}

