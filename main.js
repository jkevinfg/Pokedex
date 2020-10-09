const container = document.querySelector('.container')
const result = document.querySelector('#result')
const form = document.querySelector('#form')
const paginatorDiv = document.querySelector('#paginator')

const pokemonsPage = 6
let pokemonInitial = 0
let totalPages

form.addEventListener('submit', (event)=> {
    event.preventDefault()
    const pokemon = document.querySelector('#pokemon').value
    if(pokemon === ''){
        showError("Campo vacio")
    }
    searchPokemon(pokemon)
})
const showError = (message) => {
    clearHtml(result)
    const confirm = document.querySelector('.message')
    if(!confirm){
        pokemonInitial = 0
        const text = document.createElement('p')
        text.innerHTML = `<strong> ${message}</strong>`
        text.classList.add('message')
        result.appendChild(text)
        setTimeout(()=> {
            text.remove()
            listPokemon()
        },5000)
    }
}

const listPokemon = () => {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${pokemonInitial}&limit=${pokemonsPage}`
    console.log(url)
    fetch(url).then(datos => {
        return datos.json()
    }).then(datos => {
        totalPages = pages(datos.count)
        showPokemons(datos.results)
    })
}
listPokemon()

const pages = (total) => {
    return parseInt(Math.ceil(total / pokemonsPage))
}
const showPokemons = (pokemons) => {
    console.log(pokemons)
    clearHtml(result)
    pokemons.forEach((pokemon)=> {
        const {name} = pokemon
        pokemonInitial = pokemonInitial + 1     
        const imgPokemon = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonInitial}.png`
        result.innerHTML += `<div class="card" > <h2 class="pokemonName">${name}</h2> <img  class = "pokemonImg"src="${imgPokemon}">  </div>  `
    })
    clearHtml(paginatorDiv)
    printPaginator()
}
                                                                                     
const clearHtml = (block) => {
    while(block.firstChild){
        block.removeChild(block.firstChild)
    }
}

const printPaginator= () => {
    iterador = paginator(totalPages)
    while(true){
        const {value,done} = iterador.next()
        if(done) {
            return
        }
        const button = document.createElement('a')
        button.href = '#'
        button.textContent = value
        button.onclick = () => {
            pokemonInitial = (value-1)*pokemonsPage
            listPokemon()
        }
        paginatorDiv.appendChild(button)
    }
}

function *paginator(total ) {
    for(let i = 1 ; i<= total ; i++){
        yield i 
    }   
}

const searchPokemon= (name) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`
    console.log(url)
    fetch(url).then(datos => {
        return datos.json()
    }).then(datos => {
        showPokemon(datos)
    })
}

const showPokemon = (datos) => {
    const {name, sprites :{other:{dream_world:{ front_default}}} } = datos
    result.innerHTML = `<div class="card" > <h2 class="pokemonName">${name}</h2> <img  class = "pokemonImg"src="${front_default}">  </div>  `
}



function saludar(){
    console.log("pruebaass!!!")
}


