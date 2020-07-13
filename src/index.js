document.addEventListener("DOMContentLoaded", () => {

    function qs(selector){
        return document.querySelector(selector)
    }
    function ce(element){
        return document.createElement(element)
    }
    const url = "http://localhost:3000/pups"
    const dogBar = qs("#dog-bar")
    const dogInfo = qs("#dog-info")
    const filterBtn = qs("#good-dog-filter")
    let filter = false

    function btnInner(button, pup){
        pup.isGoodDog ? button.innerText = "Good Dog!" : button.innerText = "Bad Dog!"
    }

    function addPup(pup){
        const span = ce("span")
        span.innerText = pup.name 
        dogBar.append(span)
        span.addEventListener("click", () => {
            while (dogInfo.children[0]){
                dogInfo.children[0].remove()
            }
            const image = ce("img")
            image.src = pup.image 

            const name = ce("h2")
            name.innerText = pup.name 

            const btn = ce("button")
            btnInner(btn, pup)
            btn.addEventListener("click", () => {
                const configObj = {
                    method: 'PATCH',
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                      },
                    body: JSON.stringify({
                        isGoodDog: !pup.isGoodDog
                    })   
                }
                fetch (url + `/${pup.id}`, configObj)
                .then(response => response.json)
                .then(updatedPup => {
                    pup = updatedPup
                    btnInner(btn, updatedPup)
                    if (filterBtn.innerText == 'Filter good dogs: ON'){
                        spanGoodDogs()
                    }
                })
            })
            dogInfo.append(image, name, btn)
        })
        dogBar.append(span)
    }

    function getAllPups(){
        while (dogBar.children[0]){
            dogBar.children[0].remove()
        }
        fetch(url)
        .then(response => response.json())
        .then(pups => pups.forEach(pup => addPup(pup)))
    }

    function getGoodPups(){
        while (dogBar.children[0]){
            dogBar.children[0].remove()
        }
        fetch(url)
        .then(response => response.json())
        .then(pups => pups.filter(pup => pup.isGoodDog).forEach(goodPup => addPup(goodPup)))
    }

    if (filterBtn.innerText == 'Filter good dogs: OFF'){
        getAllPups()
    }
    else {
        getGoodPups()
    }

    filterBtn.addEventListener('click', () => {
        if (filterBtn.innerText == 'Filter good dogs: OFF'){
            filterBtn.innerText = 'Filter good dogs: ON'
            getGoodPups()
        }
        else {
            filterBtn.innerText = 'Filter good dogs: OFF'   
            getallPups()
        }
    })
})