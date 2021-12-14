async function getNames() {
    let url = 'json/nimet.json';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}



async function renderNames() {
    let names = await getNames();

    // muutetaan tekstikentän syötteen ensimmäinen kirjain isoksi kirjaimeksi, jos se ei jo ole sellainen
    let UserInput_raw = text1.value
    let UserInput = UserInput_raw.charAt(0).toUpperCase()+UserInput_raw.slice(1)
    

    document.getElementById("nimet").innerHTML = "";
    
    index = -1

    names.forEach(name => {

        // Jos jokin nimistä alkaa tekstikenttään kirjoitetuilla kirjaimilla, tehdään li node kaikista sillä kirjaimella alkavista nimistä
        if (name.startsWith(UserInput) && UserInput != ""){
            let ulnode = document.getElementById("nimet");
            let linode = document.createElement('li');
            let liarvo = document.createTextNode(name);
            linode.appendChild(liarvo);
            ulnode.appendChild(linode);

        }
        
    });
    //document.activeElement.blur()
}

let ul = document.getElementById("nimet")
let liHighlight = ul.getElementsByTagName("li");
let index = -1;
let len = ul.getElementsByTagName("li").length;


document.addEventListener("keydown", function(event) {

    
    
    let len = ul.getElementsByTagName("li").length




    // Jos Esq:iä painaa muutetaan tekstikentän arvo tyhjäksi ja poistetaan kaikki li nodet
    if (event.key == "Escape"){
        
        text1.value = "";
        while(ul.firstChild){
            ul.firstChild.remove()
        }
    }
    // Enteriä painamalla asetetaan korostettu li noden arvo tekstikenttään ja tyhjätään lista
    else if (event.key == "Enter") {
        text1.value = liHighlight.innerHTML;
        liHighlight.innerHTML = ""
        while(ul.firstChild){
            ul.firstChild.remove()    
        }
        

    }

    else if(event.key == "Enter"){
        if (ul.hasChildNodes() == false){
            text1.value = "";
        }
    }


    // Nuolinäppäimillä voidaan liikkua li nodejen välillä ylös tai alas.
    else if (event.key == "ArrowDown") {
        document.activeElement.blur()

        
        if (liHighlight){
            index++;
            if (index > 0 && index < len) {
                ul.getElementsByTagName("li")[index-1].removeAttribute("class", "selected");
                ul.getElementsByTagName("li")[index].setAttribute("class", "selected");
            
                liHighlight = ul.getElementsByTagName("li")[index];
                
            }
            
            else {
                index = 0;
                ul.getElementsByTagName("li")[len-1].removeAttribute("class", "selected");

                ul.getElementsByTagName("li")[index].setAttribute("class", "selected");
                liHighlight = ul.getElementsByTagName("li")[index];
                
            }
        }
        else {
            index = -1;
        }
        
    }
     
    else if (event.key == "ArrowUp") {
        document.activeElement.blur()


        if (liHighlight){
            
            index--;
           
            if (index >=0) {
                ul.getElementsByTagName("li")[index+1].removeAttribute("class", "selected");
                ul.getElementsByTagName("li")[index].setAttribute("class", "selected");
            
                liHighlight = ul.getElementsByTagName("li")[index];
                
            }
            
            else {
                index = len-1;
                ul.getElementsByTagName("li")[0].removeAttribute("class", "selected");

                ul.getElementsByTagName("li")[index].setAttribute("class", "selected");
                liHighlight = ul.getElementsByTagName("li")[index];
            
              
            }
        }
        else {
            index = len-1;
            }
        }
        
    
});
