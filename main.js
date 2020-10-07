const container = document.querySelector('.container')
const result = document.querySelector('#result')
const form = document.querySelector('#form')

const pokemonsPage = 20
let pokemonInitial = 40
let totalPages

const listPokemon = () => {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${pokemonInitial}&limit=${pokemonsPage}`
    fetch(url).then(datos => {
        return datos.json()
    }).then(datos => {
        totalPages = pages(datos.count)
        console.log(totalPages)
        showPokemons(datos.results)
    })
}

const showPokemons = (pokemons) => {
    console.log(pokemons)
    pokemons.forEach((pokemon)=> {
        const {name} = pokemon
        pokemonInitial = pokemonInitial + 1
        const imgPokemon = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonInitial}.png`
        result.innerHTML += `<div> <h2>${name}</h2> <img src="${imgPokemon}">  </div>  `
    })
    printPaginator()

}






function *paginator(total ) {
    for(let i = 1 ; i<= total ; i++){
        yield i
    }   
}

const pages = (total) => {
    return parseInt(Math.ceil(total / pokemonsPage))
}

listPokemon()






// form.addEventListener('submit', (event)=> {
//     event.preventDefault()
//     const pokemon = document.querySelector('#pokemon').value
//     if(pokemon === ''){
//         showError("Campo vacio")
//     }
//     searchPokemon(pokemon)
// })

// const showError = (message) => {
//     const confirm = document.querySelector('.message')
//     if(!confirm){
//         const text = document.createElement('p')
//         text.innerHTML = `<strong> ${message}</strong>`
//         text.classList.add('message')
//         result.appendChild(text)
//         setTimeout(()=> {
//             text.remove()
//         },3000)
//     }
// }

// const searchPokemon= (name) => {
//     const url = `https://pokeapi.co/api/v2/pokemon/${name}`
//     console.log(url)
//     fetch(url).then(datos => {
//         return datos.json()
//     }).then(datos => {
//         showPokemon(datos)
//     })
// }

// const showPokemon = (datos) => {
//     const {name, sprites :{other:{dream_world:{ front_default}}} } = datos
//     result.innerHTML = `<div> <h2>${name}</h2> <img src="${front_default}">  </div> `
// }








