const container = document.querySelector('.container')
const result = document.querySelector('#result')
const form = document.querySelector('#form')
const paginatorDiv = document.querySelector('#paginator')

const pokemonsPage = 30
let pokemonInitial = 0
let totalPages



const validate = (event) => {
    event.preventDefault()
    const pokemon = document.querySelector('#pokemon').value.toLowerCase()
    if(pokemon === ''){
        showError("Empty field 🙄")
    }
    searchPokemon(pokemon)
}
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
        <p> loading... </p>
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
    clearHtml(result)
    pokemons.forEach((pokemon)=> {
        const {name} = pokemon
        pokemonInitial = pokemonInitial + 1
        const imgPokemon = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonInitial}.svg`
        result.innerHTML += `
        <div class="card">
                    <div class="card__header">
                        ${name}
                    </div>
                    <div class="card__body">
                        <img src="${imgPokemon}" alt="Foto pokemon">
                        <p class ="types" ></p>
                        <p class = "abilities"  >Habilidades</p>
                        <p> Estadisticas </p>
                    </div>
                </div>
 `
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

const showPokemon = (datos) => {
    console.log(datos)
    const {name, sprites :{other:{dream_world:{ front_default}}} , types , height,weight,stats } = datos
    result.innerHTML = `<div class="card">
            <div class="card__header">
                ${name}
            </div>
            <div class="card__body">
                <img src="${front_default}" alt="Foto pokemon">
                <p class = "types"> Type : </p>
                <p >  ${height/10}m  ${weight/10}kg</p>
                <p class = "stats" > 

                </p>
            </div>
            </div>  
            `
    stats.forEach((stat) => {
        const  {base_stat, stat : {name}}  =  stat
        console.log(base_stat,name)
        const text2 = document.querySelector('.stats') 
        text2.innerHTML += `<ul>${name} : ${base_stat}</ul>`       
    })
    console.log(name)
    types.forEach((item) => {
        const { type : {name} } = item
        const text = document.querySelector('.types')
        text.innerHTML += ` ${name} `
    })
    console.log(height, weight)
}

const searchPokemon= (name) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`
    loader()
    fetch(url).then(datos => {
        return datos.json()
    }).then(datos => {
        showPokemon(datos)
    }).catch(error => {
        showError(`${name}  is not a pokemon  😟` ) 
    })
}

form.addEventListener('submit', validate)
listPokemon()




