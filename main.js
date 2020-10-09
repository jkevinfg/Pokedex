const container = document.querySelector('.container')
const result = document.querySelector('#result')
const form = document.querySelector('#form')
const paginatorDiv = document.querySelector('#paginator')

const pokemonsPage = 30
let pokemonInitial = 0
let totalPages

form.addEventListener('submit', (event)=> {
    event.preventDefault()
    const pokemon = document.querySelector('#pokemon').value.toLowerCase()
    if(pokemon === ''){
        showError("Campo vacio 🙄")
    }
    searchPokemon(pokemon)
})
const showError = (message) => {
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
const clearHtml = (block) => {
    while(block.firstChild){
        block.removeChild(block.firstChild)
    }
}

const loader = () => {
    clearHtml(result)
    const divLoader = document.createElement('div')
    divLoader.innerHTML = `
        <p> Cargando... </p>
    `
    result.appendChild(divLoader)
}


const listPokemon = () => {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${pokemonInitial}&limit=${pokemonsPage}`
    loader()
    fetch(url).then(datos => {
        return datos.json()
    }).then(datos => {
        totalPages = pages(datos.count)
        showPokemons(datos.results)
    })
}

const pages = (total) => {
    return parseInt(Math.ceil(total / pokemonsPage))
}
const showPokemons = (pokemons) => {
    console.log(pokemons)
    clearHtml(result)
    pokemons.forEach((pokemon)=> {
        const {name} = pokemon
        pokemonInitial = pokemonInitial + 1
        const imgPokemon = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonInitial}.svg`
        result.innerHTML += `<div class="card" > <h2 class="pokemonName">${name}</h2> <img  class = "pokemonImg"src="${imgPokemon}">  </div>  `
    })
    clearHtml(paginatorDiv)
    printPaginator()
}
                                                                                     
// 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17
// 1 2 ... 9 10
const printPaginator= () => {
    iterador = paginator(totalPages)
    while(true){
        const {value,done} = iterador.next()
        if(done) {
            return
        }
        const button = document.createElement('a')
        button.href = '#'
        console.log(value)
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
    loader()
    fetch(url).then(datos => {
        return datos.json()
    }).then(datos => {
        showPokemon(datos)
    }).catch(datos => {
        showError(`${name} no es un pokemon  😟` ) 
    })
}

const showPokemon = (datos) => {
    const {name, sprites :{other:{dream_world:{ front_default}}} } = datos
    result.innerHTML = `<div class="card" > <h2 class="pokemonName">${name}</h2> <img  class = "pokemonImg"src="${front_default}">  </div>  `
}


listPokemon()




