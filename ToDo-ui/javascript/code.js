function init() {
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = 'Ladataan tehtävälista palvelimelta, odota...'
    loadTodos()
}


async function loadTodos() {
    let response = await fetch('http://localhost:3000/attetodos')
    let todos = await response.json()
      console.log(todos)
    showTodos(todos)
}

function createTodoListItem(todo) {
    // luodaan uusi LI-elementti
    let li = document.createElement('li')
      // luodaan uusi id-attribuutti
    let li_attr = document.createAttribute('id')
      // kiinnitetään tehtävän/todon id:n arvo luotuun attribuuttiin 
    li_attr.value= todo._id
      // kiinnitetään attribuutti LI-elementtiin
    li.setAttributeNode(li_attr)
      // luodaan uusi tekstisolmu, joka sisältää tehtävän/todon tekstin
    let text = document.createTextNode(todo.text)
      // lisätään teksti LI-elementtiin
    li.appendChild(text)
      // luodaan uusi SPAN-elementti, käytännössä x-kirjan, jotta tehtävä saadaan poistettua
    let span = document.createElement('span')
      // luodaan uusi class-attribuutti
    let span_attr = document.createAttribute('class')
      // kiinnitetään attribuuttiin delete-arvo, ts. class="delete", jotta saadaan tyylit tähän kiinni
    span_attr.value = 'delete'
      // kiinnitetään SPAN-elementtiin yo. attribuutti
    span.setAttributeNode(span_attr)
      // luodaan tekstisolmu arvolla x
    let x = document.createTextNode(' x ')
      // kiinnitetään x-tekstisolmu SPAN-elementtiin (näkyville)
    span.appendChild(x)
      // määritetään SPAN-elementin onclick-tapahtuma kutsumaan removeTodo-funkiota
    span.onclick = function() { removeTodo(todo._id) }
      // lisätään SPAN-elementti LI-elementtin

    let edit = document.createElement('span')

    let edit_attr = document.createAttribute('class')
      // kiinnitetään attribuuttiin delete-arvo, ts. class="delete", jotta saadaan tyylit tähän kiinni
    edit_attr.value = 'edit'
      // kiinnitetään SPAN-elementtiin yo. attribuutti
    edit.setAttributeNode(edit_attr)
               // luodaan tekstisolmu arvolla x
    let e = document.createTextNode(' Edit ')
                 // kiinnitetään x-tekstisolmu SPAN-elementtiin (näkyville)
    edit.appendChild(e)

    edit.onclick = function() { editToDo(todo._id) }
    li.appendChild(edit)
    li.appendChild(span)
                // palautetaan luotu LI-elementti
                // on siis muotoa: <li>Muista soittaa...<span class="remove">x</span></li>
    return li
  }

function showTodos(todos) {
    let todosList = document.getElementById('todosList')
    let infoText = document.getElementById('infoText')
    // no todos
    if (todos.length === 0) {
      infoText.innerHTML = 'Ei tehtäviä'
    } else {    
      todos.forEach(todo => {
          let li = createTodoListItem(todo)        
          todosList.appendChild(li)
      })
      infoText.innerHTML = ''
    }
  }

async function addTodo() {
    let newTodo = document.getElementById('newTodo')
    const data = { 'text': newTodo.value }
    const response = await fetch('http://localhost:3000/attetodos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    let todo = await response.json()
    let todosList = document.getElementById('todosList')
    let li = createTodoListItem(todo)
    todosList.appendChild(li)
  
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = ''
    newTodo.value = ''
  }

async function removeTodo(id) {
    const response = await fetch('http://localhost:3000/attetodos/'+id, {
      method: 'DELETE'
    })
    let responseJson = await response.json()
    let li = document.getElementById(id)
    li.parentNode.removeChild(li)
  
    let todosList = document.getElementById('todosList')
    if (!todosList.hasChildNodes()) {
      let infoText = document.getElementById('infoText')
      infoText.innerHTML = 'Ei tehtäviä'
    }
}

async function editToDo(id) {

  // Luetaan id:n osoittama elementti, siivotaan siitä span elementtien tekstit pois ja muokataan actionbutton muokkaustilaan
  
  let textTodo = document.getElementById(id).textContent
  let cleanText = textTodo.replace(" Edit  x ","")
  let newTodo = document.getElementById('newTodo')
  newTodo.value = cleanText
  
  actionbutton.setAttribute("class","edit_button")
  actionbutton.innerHTML = "Tallenna"
  actionbutton.setAttribute('onclick', "saveToDo('"+id+"')")
  
}

async function saveToDo(id) {

  let newTodo = document.getElementById('newTodo')
  const data = { 'text': newTodo.value }

  const response = await fetch('http://localhost:3000/attetodos/'+id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  // Palautetaan Button normaaliksi, tyhjennetään todo lista ja haetaan se db:stä uudestaan
  actionbutton.removeAttribute("class")
  actionbutton.innerHTML = "Lisää"
  actionbutton.setAttribute('onclick', "addTodo()")

  let ul = document.getElementById("todosList")

  while(ul.firstChild){
    ul.firstChild.remove()    
}
  newTodo.value = ""
  
  loadTodos()


}



