const container = document.querySelector('.container')
const result = document.querySelector('#result')
const form = document.querySelector('#form')
const paginatorDiv = document.querySelector('#paginator')

const pokemonsPage = 6
let pokemonInitial = 0
let totalPages


form.addEventListener('submit', validate)
listPokemon()


 function validate (event)  {
    event.preventDefault()
    const pokemon = document.querySelector('#pokemon').value.toLowerCase()
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
    divLoader.innerHTML = `
        <p> loading... </p>
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


function showPokemons (pokemons) {
    clearHtml(result)
    pokemons.forEach( async (pokemon)=> {
        const {url} = pokemon
        const respuesta = await fetch(url)
        const resultado = await respuesta.json()
        showPokemon(resultado)
    })
    clearHtml(paginatorDiv)
    printPaginator()
}
                                                                                     
// 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17
// 1 2 ... 9 10
function printPaginator ()  {
    console.log(totalPages)
    for(let i = 1 ; i<totalPages+1 ; i++){
        console.log(i)
        const button = document.createElement('a')
        button.href = '#'
        button.textContent = i
        button.onclick = () =>{
            pokemonInitial = (i-1) * pokemonsPage
            listPokemon()
        }
        paginatorDiv.appendChild(button)
    }
    // iterador = paginator(totalPages)
    // while(true){
    //     const {value,done} = iterador.next()
    //     if(done) {
    //         return
    //     }
    //     console.log(value)
    //     const button = document.createElement('a')
    //     button.href = '#'
    //     button.textContent = value
    //     button.onclick = () => {
    //         pokemonInitial = (value-1)*pokemonsPage
    //         listPokemon()
    //     }
    //     paginatorDiv.appendChild(button)
    // }
}

// function *paginator(total ) {
//     for(let i = 1 ; i<= total ; i++){
//         yield i 
//     }   
// }

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
        progressBar.style.width = `${(base_stat/150)*100}%`
    })
    types.forEach((item) => {
        const { type : {name} } = item
        const text = document.querySelector(`.type${id}`)
        text.innerHTML += `${name} `
    })

}



