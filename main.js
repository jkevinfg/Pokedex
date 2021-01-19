const container = document.querySelector('.container')
const result = document.querySelector('#result')
const form = document.querySelector('#form')
const messageError  = document.querySelector('.message-error')
const inputPokemon = document.querySelector('#inputPokemon')
const paginatorDiv = document.querySelector('#paginator')
const optiones = document.querySelector('#optiones')

let pokemonsPage = 6 // cuantos pokemones por pagina se van a mostrar
let pokemonInitial = 0 // apartir de que pokemon listamos
let totalPages  // total de paginas 


window.onload = () => {
    form.addEventListener('submit', validate)
    inputPokemon.addEventListener('keydown',filter)
    showPokemons()
};


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
    return resultado.results
}
//

async function validate (event)  {
    event.preventDefault()
    const pokemon = inputPokemon.value.toLowerCase()
    if(pokemon === ''){
        showError("Campo vacío 🙄")
    }else{
        try{
            const pokemonsearch = await fetchPokemon(pokemon)
            clearHtml(result)
            clearHtml(paginatorDiv)
            inputPokemon.value = ''
            const boton = document.createElement('a')
            boton.href = '#'
            boton.textContent = 'Volver al listado general'
            boton.onclick = () =>{
                showPokemons()
            }
            paginatorDiv.appendChild(boton)
            showPokemon(pokemonsearch)}
        catch{
            showError("Este pokemon no existe 🙄")
        }
    }
}
async function filter(event) {
    clearHtml(optiones)
    const pokemons =  await fetchPokemons(0,150)
    const  text = event.target.value.toLowerCase()
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
    result.innerHTML  += `             
                         <div class="col-10 offset-1 col-md-4 offset-md-0 ">
                             <div class="card" >                              
                              <img src="${front_default}" class="card-img-top mx-auto img-fluid " alt="...">
                              <div class="card-body">
                                <h5 class="card-title">${name}</h5>
                                            <p  class="card-text" >Height : ${height/10}m</p>
                                            <p  class="card-text">Weight :  ${weight/10}kg</p>
                                    <div class="card__body__text__type type${id}">  Type :</div>
                                    <div class="card__stats_stat stats${id} "></div>  
                              </div>
                             </div>
                       
                        </div>
                        `
    types.forEach((item) => {
        const { type : {name} } = item
        const text = document.querySelector(`.type${id}`)
        text.innerHTML += `${name} `
    })
    stats.forEach((stat) => {
        const  {base_stat, stat : {name}}  =  stat
        const text2 = document.querySelector(`.stats${id}`)
        text2.innerHTML += `<div class="card-text card__stats_stat__name" > ${name}        
                            </div>                 
                        <div class="progress">
                                <div class="progress-bar  ${name}${id}" role="progressbar" style="width: 0%" >
                                 ${base_stat}
                                </div>
                        </div>
          
                        `
        // hp bg-sucess
        // attack bg-info
        // defense bg-warning
        // special-atack bg-danger
        // special - defense "sin nada"
        // speed

        const progressBar = document.querySelector(`.${name}${id}`)



        progressBar.classList.add('bg-danger')
        progressBar.style.width = `${(base_stat/130)*100}%`
    })


}




function printPaginator ()  {   
    totalPages = pages(150)

    for (let i = 1 ; i< totalPages+1; i++){
        const item = document.createElement('a')
        item.innerHTML = `${i}`
        item.classList.add('pagination-link',`page${i}`)
        item.onclick = () => {
            pokemonInitial = (i-1)*pokemonsPage
            item.classList.add('is-current')
            showPokemons()
        }
        paginatorDiv.appendChild(item)   
    }
    const pageactual = pokemonInitial/pokemonsPage + 1;
    const actual = document.querySelector(`.page${pageactual}`)
    actual.style.background = "red";

}
function  pages (total)  {
    return parseInt(Math.ceil(total / pokemonsPage))
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
    divLoader.innerHTML = `Cargando...`
    result.appendChild(divLoader)
}
