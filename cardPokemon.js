// https://pokeapi.co/api/v2/pokemon/8/
//  https://pokeapi.co/api/v2/pokemon/wartortle/

const searchPokemon= (nameOrId) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${nameOrId}`
    loader()
    fetch(url).then(datos => {
        return datos.json()
    }).then(datos => {
        showPokemon(datos)
    }).catch(error => {
        showError(`${nameOrId}  is not a pokemon  😟` ) 
    })
}

const showPokemon = (datos) => {
    const {name, sprites :{other:{dream_world:{ front_default}}} , types , height,weight,stats,id} = datos
  
    result.innerHTML = `<div class="card">
                            <div class="card__header">
                                ${name}
                            </div>
                            <div class="card__body">
                                <img src="${front_default}" alt="Foto pokemon">
                                <p class = "types${id}" > Type : </p>
                                <p >   Height :  ${height/10}m </p>
                                <p >  Weight : ${weight/10}kg</p>
                                <p class = "stats${id}" > 

                                </p>
                            </div>
                         </div>  
    `

    stats.forEach((stat) => {
        const  {base_stat, stat : {name}}  =  stat
        const text2 = document.querySelector(`.stats${id}`) 
        text2.innerHTML += `<ul>${name} : ${base_stat}</ul>`       
    })
    types.forEach((item) => {
        const { type : {name} } = item
        const text = document.querySelector(`.types${id}`)
        text.innerHTML += ` ${name} `
    })

}