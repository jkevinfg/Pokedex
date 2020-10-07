const container = document.querySelector('.container')
const result = document.querySelector('#result')
const form = document.querySelector('#form')

form.addEventListener('submit', (event)=> {
    event.preventDefault()
    const pokemon = document.querySelector('#pokemon').value
    if(pokemon === ''){
        showError("Campo vacio")
    }
    searchPokemon(pokemon)
})

const showError = (message) => {
    const confirm = document.querySelector('.message')
    if(!confirm){
        const text = document.createElement('p')
        text.innerHTML = `<strong> ${message}</strong>`
        text.classList.add('message')
        result.appendChild(text)
        setTimeout(()=> {
            text.remove()
        },3000)
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
    result.innerHTML = `<img src="${front_default}"> `
    console.log(name)
    console.log(front_default)
}






