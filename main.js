const container = document.querySelector('.container')
const result = document.querySelector('#result')
const form = document.querySelector('#form')


form.addEventListener('submit',valid)


const valid = (event) => {
    event.preventDefault()
    const pokemon = document.querySelector('#pokemon').value
    if(pokemon === ''){
        showError("Campo vacio")
    }
}

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


