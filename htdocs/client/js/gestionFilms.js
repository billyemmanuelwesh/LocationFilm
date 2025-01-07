/* 
   Nom du fichier : gestionFilms.js
   Auteurs :  Billy Emmanuel WESH / IFT 1142/ Hiver 2023
   Matricule : 20227876
    
But du programme permet de:

    1-Parcourir un XML et avec les films créez un tableau listeFilms ayant comme contenu des instances de la classe Film. 
    Ne plus utiliser le fichier XML.

    2-Vous allez utiliser listeFilms pour afficher les films dans la page.

    3-Toutes les informations (les listes (tableaux), SELECT) doivent être  rendus visibles lors de l’affichage.

    4- Les tableaux HTML doivent être crées par le DOM en faisant appel au primitives de celui-ci (createElement, createTextNode, ...).  
	Derniere mise a jour : 10-04-2023
*/


// Liste des films que l application veut afficher
let selectionFilms;
// Liste des films existant (fichier xml + ajout / suppression et modifications)
let tabDesFilms = [];
// variable qui permet a la modale de suppresion de savoir quel film on supprime
let FilmASupprimer;

// methode pour creer les cards 
let creerCard = (unFilm,table) => 
{  
    var trElement = document.createElement("tr");
    trElement.setAttribute("class"," card-style");

    var trElement2 = document.createElement("tr");
    trElement2.setAttribute("class"," card-style");
    //pour les images
    var tdImage = document.createElement("td");
    tdImage.setAttribute("rowspan",2);
    var divImage = document.createElement("div");
    divImage.setAttribute("class","card-img-side");
    var imageFilm = document.createElement("img");
    imageFilm.src = unFilm.posterUrl;
    imageFilm.style = "width:100px";
    divImage.appendChild(imageFilm);
    tdImage.appendChild(divImage);
    //pour les titres
    var tdTitre = document.createElement("td");
    var h5Titre = document.createElement("h5");
    h5Titre.setAttribute("class","card-text card-title");
    var h5TitreContenu = document.createTextNode(unFilm.title);
    h5Titre.appendChild(h5TitreContenu);
    tdTitre.appendChild(h5Titre);
    //pour les annees
    var tdYear = document.createElement("td");
    tdYear.setAttribute("class","card-text card-year");
    var anneeFilm =  document.createTextNode(unFilm.year);
    tdYear.appendChild(anneeFilm);
    //pour les durees
    var tdRuntime = document.createElement("td");
    tdRuntime.setAttribute("class","card-text card-runtime");
    var runtimeFilm =  document.createTextNode(unFilm.runtime);
    tdRuntime.appendChild(runtimeFilm);
    //pour les genres
    var tdGenres = document.createElement("td");
    var genresFilm =  document.createTextNode(unFilm.genres);
    tdGenres.setAttribute("class","card-text card-genres");
    tdGenres.appendChild(genresFilm);
    //pour les acteurs
    var tdActors = document.createElement("td");
    var actorsFilm =  document.createTextNode(unFilm.actors);
    tdActors.setAttribute("class","card-text card-actors");
    tdActors.appendChild(actorsFilm);
    //pour les resumes
    var tdPlot = document.createElement("td");
    var plotFilm =  document.createTextNode(unFilm.plot);
    tdPlot.setAttribute("class","card-text card-plot");
    tdPlot.setAttribute("colspan",4);
    tdPlot.appendChild(plotFilm);

    //pour bouton
    var tdButton = document.createElement("td");
    var unBoutton = document.createElement("button");
    unBoutton.setAttribute("data-bs-toggle","modal");
    unBoutton.setAttribute("data-bs-target", "#exampleModal");
    unBoutton.setAttribute("class","btn btn-default")
    unBoutton.onclick = function () {
        afficherFormulaireFilm(unFilm.id);
    };

    var btnText = document.createElement("i");
    btnText.setAttribute("class","fa fa-lg fa-pencil");
    unBoutton.appendChild(btnText);
    tdButton.appendChild(unBoutton);

    //pour bouton
    var unBoutton = document.createElement("button");
    unBoutton.setAttribute("data-bs-toggle","modal");
    unBoutton.setAttribute("data-bs-target", "#supprconfirmation");
    unBoutton.setAttribute("class","btn btn-default")
    unBoutton.onclick = function () {
        FilmASupprimer = unFilm.id;
    };

    var btnText = document.createElement("i");
    btnText.setAttribute("class","fa fa-lg fa-trash");
    unBoutton.appendChild(btnText);
    tdButton.appendChild(unBoutton);
    
    //on depose tout dans les tr
    trElement.appendChild(tdImage);
    trElement.appendChild(tdTitre);
    trElement.appendChild(tdYear);
    trElement.appendChild(tdRuntime);
    trElement.appendChild(tdGenres);
    trElement2.appendChild(tdActors);
    trElement2.appendChild(tdPlot); 
    trElement.appendChild(tdButton);

    //on depose les tr dans nos tableaux
    table.appendChild(trElement);
    table.appendChild(trElement2);
}

// methode pour livre les fichiers xml et mettre chaque films dans le tableau tabDesFilms
let initPage = () => {
    $.ajax({
		url:'serveur/donnees/films.xml',
		type:'GET',
		dataType:'xml',
        success:(reponse) => {
            let listeXMLDesFilms = reponse.getElementsByTagName('film');
            for(let unFilm of listeXMLDesFilms ){
                const id = unFilm.getElementsByTagName('id')[0].firstChild.nodeValue;
                const title = unFilm.getElementsByTagName('title')[0].firstChild.nodeValue;
                const year = unFilm.getElementsByTagName('year')[0].firstChild.nodeValue;
                const runtime = unFilm.getElementsByTagName('runtime')[0].firstChild.nodeValue;
                //Ajout des genres on boucle car c'est un tableau
                const genres = [];
                let nombreDeGenre = unFilm.getElementsByTagName('genres').length;
                for(let i = 0 ; i < nombreDeGenre ; i++)
                {
                    genres.push(unFilm.getElementsByTagName('genres')[i].firstChild.nodeValue);
                }               
                const director = unFilm.getElementsByTagName('director')[0].firstChild.nodeValue;
                const actors = unFilm.getElementsByTagName('actors')[0].firstChild.nodeValue;
                const plot = unFilm.getElementsByTagName('plot')[0].firstChild.nodeValue;
                const posterUrl = unFilm.getElementsByTagName('posterUrl')[0]?.firstChild?.nodeValue;
                //creation d'une instance de Film pour pouvoir remplir tabDesFilms
                tabDesFilms.push(new Film(id, title, year, runtime, genres, director, actors, plot, posterUrl));
            }   
            // on utilise la  variable selectionFilms  pour afficher les films , cela permet d afficher l ensemble des films 
            // ou un sous-ensemble des films par exemple dans le cadre de la recherche.
            // on conserve la variable tabDesFilms qui contient l'ensemble des films afin de restaurer 
            // lorsque l on annule ou change la recherche. cela evite de reloader le fichier xml
            selectionFilms = tabDesFilms;
            paginerLesResultat()
        },
        fail: (e)=>{
            console.log(e);
            }
        })
        // appel de la methode CreerSelecTri pour creer le select qui permet de trier par (annee, titre, ...)
        creerSelectTri();
        // pour creer les options pour le select des categories.
        $.ajax({
            url:'serveur/donnees/filmsCateg.xml',
            type:'GET',
            dataType:'xml',
            success:(reponse) => {
                
                let listeXMLDesCetg = reponse.getElementsByTagName('categorie');
    
                let selCategs = document.getElementById('mesCategs');
                selCategs.setAttribute("class","form-control dropdown");
                selCategs.onchange = function () {
                    listerLesFilmsParCategorie();
                };
                selCategs.options[0] = new Option("Choisir catégorie ...", ""); 
                selCategs.options[0].setAttribute("disabled","disabled");

                // pour remplir le select de la liste deroulante des categories
                for(let categ of listeXMLDesCetg ){
                    const categorie = categ.firstChild.nodeValue;
                    selCategs.options[selCategs.options.length] = new Option(categorie, categorie); 
                }          
            },
            fail: (e)=>{
                console.log(e);
                }
            })       
    } 
   
    // methode pour creer le select qui permet de trier par (annee, titre, ...)
let creerSelectTri = () => {
    let selCategs = document.getElementById('selListerPar');
    // pour remplir le select de la liste deroulante de tri 
    selCategs.setAttribute("class","form-control");
    selCategs.onchange = function () {
        paginerLesResultat();
    };

    // groupe d'option de tri des années
    var optgroup1 = document.createElement("optgroup");
    var option1a =  document.createElement("option");
    var option1b = document.createElement("option");
    var txt1a = document.createTextNode("Croissant");
    option1a.appendChild(txt1a);
    var txt1b = document.createTextNode("Décroissant");
    option1b.appendChild(txt1b);
    option1a.setAttribute("value","AC");
    option1b.setAttribute("value","AD");

    // groupe d'option de tri des titres
    var optgroup2 = document.createElement("optgroup");
    var option2a =  document.createElement("option");
    var option2b = document.createElement("option");
    var txt2a = document.createTextNode("Croissant");
    option2a.appendChild(txt2a);
    var txt2b = document.createTextNode("Décroissant");
    option2b.appendChild(txt2b);
    option2a.setAttribute("value","TC");
    option2b.setAttribute("value","TD");

    // groupe d'option de tri des durees
    var optgroup3 = document.createElement("optgroup");
    var option3a =  document.createElement("option");
    var option3b = document.createElement("option");
    var txt3a = document.createTextNode("Croissant");
    option3a.appendChild(txt3a);
    var txt3b = document.createTextNode("Décroissant");
    option3b.appendChild(txt3b);
    option3a.setAttribute("value","DC");
    option3b.setAttribute("value","DD");

    optgroup1.setAttribute("label","Trier par année");
    optgroup1.appendChild(option1a);
    optgroup1.appendChild(option1b);

    optgroup2.setAttribute("label","Trier par titre");
    optgroup2.appendChild(option2a);
    optgroup2.appendChild(option2b);

    optgroup3.setAttribute("label","Trier par durée en min.");
    optgroup3.appendChild(option3a);
    optgroup3.appendChild(option3b);

    var optionNone =  document.createElement("option");
    var txtNone = document.createTextNode("Trier par ...");
    optionNone.appendChild(txtNone);
    optionNone.setAttribute("value","");

    selCategs.appendChild(optionNone);
    selCategs.appendChild(optgroup1);
    selCategs.appendChild(optgroup2);
    selCategs.appendChild(optgroup3);
    }

let listerLesFilmsPagines = (elementsAfficher) => {
    
    var tableau = document.createElement("table");
    for(let unFilm of elementsAfficher){
          
        // filtre sur categorie et limiter au nombre demande
        creerCard(unFilm,tableau); //ajoute films a la liste
    }
    // injecte le html dans le conteneur contenu
    var contenu = document.getElementById("contenu");
    contenu.innerHTML = "";
    contenu.appendChild(tableau);
}

// methode pour trier par annee, titre, et duree
let paginerLesResultat = () => {

    var type = $("#selListerPar").val();
    if(type != null)
    {
        if(type.charAt(0) == 'A'){
            selectionFilms.sort((l1,l2) => {
                if(type.charAt(1) == 'C'){
                    return l1.year - l2.year;
                }else {
                    return l2.year - l1.year;
                }
            })
        } else if(type.charAt(0) == 'T'){
            selectionFilms.sort((l1,l2) => {
                if(type.charAt(1) == 'C'){
                    return l1.title.localeCompare(l2.title);
                }else {
                    return l2.title.localeCompare(l1.title);
                }
            })
        }else if(type.charAt(0) == 'D'){
            selectionFilms.sort((l1,l2) => {
                if(type.charAt(1) == 'C'){
                    return l1.runtime - l2.runtime;
                }else {
                    return l2.runtime - l1.runtime;
                }
            })
        }
    }
    // pagination affichage et reafichage des elements trier
    var $cardsContainer = $('#contenu');
        $('#pagination-container').pagination({
        dataSource:  selectionFilms,
        pageSize: 10,
        pageRange:1,
        callback: function(data, pagination) {
            listerLesFilmsPagines(data);
        }
    });
}

// methode pour rechercher films ayant le text dans le titre, la description, acteurs , categorie
// egalement si le critere de recherche est vide alors cette methode retourne l ensemble des films
let rechercherFilms = () => {
    var critere = $("#critere").val();

    // on va faire la recherche sur la liste complete cad tabDesFilms qui n est jamais altere dans ce programme
    let donneFiltre = tabDesFilms.filter((film) => film.title.toLowerCase().includes(critere.toLowerCase()) 
    || film.plot.toLowerCase().includes(critere.toLowerCase()) 
    || film.actors.toLowerCase().includes(critere.toLowerCase()) 
    || film.genres?.join(',').toLowerCase().includes(critere.toLowerCase()));
    
    // on utilise la  variable selectionFilms  pour afficher les films retournés par la recherche  
    // on conserve la variable tabDesFilms qui contient l ensemble des films afin de restaurer lorsque l on termine la recherche

    selectionFilms = donneFiltre;
    paginerLesResultat();

}

//Cette méthode liste les films(card) qui appartiennent a une catégorie entrée en paramètre.
let listerLesFilmsParCategorie = () => {
    var critere = $("#mesCategs").val();
    let donneFiltre = tabDesFilms.filter((film) => film.genres.includes(critere))
    selectionFilms = donneFiltre;
    paginerLesResultat();
      
}

//cette methode permet de cibler une catégorie selectionnée et lister les films appartenant a cette catégorie
let listerSelonSelect = () => {
    let selCategs = document.getElementById('mesCategs');         //donne le contenue de l'element <select> de mon html qui a pour id "mesCategs"
    let indiceOptionChoisie = selCategs.selectedIndex;            //donne l'indice de l'option selectionne
    let categorie = selCategs.options[indiceOptionChoisie].text;  //donne le texte de l'option du <select> ayant l'indice selectionné
    listerLesFilmsParCategorie(categorie);
}



// methode pour ajouter un nouveau film avec le formulaire modal
let creerNouveauFilm = () => {
   
    // boucle qui calcule le dernier id à creer automatiquement
    var grand=0;
    for(var i = 1; i < tabDesFilms.length; i++)
    {
        if(tabDesFilms[i].id > grand)
        grand = tabDesFilms[i].id;
    }
    //on recupere la valeur de chaque champ du formulaire
    let id = grand + 1; // ajoute 1 au plus grand id a chaque creation de nouveau film
    let titre = document.getElementById("title").value;
    let annee = document.getElementById("year").value;
    let duree = document.getElementById("runtime").value;
    let genres = document.getElementById("genres").value.split(',');
    let directeur = document.getElementById("director").value;
    let acteurs = document.getElementById("actors").value;
    let description = document.getElementById("plot").value;
    let Url = document.getElementById("posterUrl").value;

    //ajoute l'instance de film cree dans tabDesFilms
    tabDesFilms.push(new Film(id, titre, annee, duree, genres, directeur, acteurs, description, Url));
    paginerLesResultat();
}

// methode pour modifier un film
let modifierFilm = () => {
    //on selectionne  id du film a modifier
    var id =  document.getElementById("filmid").value;
    var film = undefined;
    for(var i = 0; i < tabDesFilms.length; i++)
    {
        // cherche cet id dans la table
        if(tabDesFilms[i].id == id)
        {
        film = tabDesFilms[i];
        film.title = document.getElementById("title").value;
        film.year = document.getElementById("year").value;
        film.runtime = document.getElementById("runtime").value;
        film.genres = [document.getElementById("genres").value];
        film.director = document.getElementById("director").value;
        film.actors = document.getElementById("actors").value;
        film.plot = document.getElementById("plot").value;
        film.posterUrl = document.getElementById("posterUrl").value;
        }
    } 
    paginerLesResultat();
}


// methode pour afficher les infos d'un film dans le formulaire modal vide
let afficherFormulaireFilm = (id) => {
    
    var film = undefined;
    for(var i = 0; i < tabDesFilms.length; i++)
    {
        if(tabDesFilms[i].id == id)
        film = tabDesFilms[i];
    }

    document.getElementById("btnModif").style = "display:block";
    document.getElementById("btnCreer").style = "display:none";
    document.getElementById("filmid").value = film?.id || 0;
    document.getElementById("title").value = film?.title || "";
    document.getElementById("year").value = film?.year || "";
    document.getElementById("runtime").value = film?.runtime || "";
    document.getElementById("director").value = film?.director || "";
    document.getElementById("actors").value = film?.actors || "";
    document.getElementById("plot").value = film?.plot || "";
    document.getElementById("posterUrl").value = film?.posterUrl || "";
    document.getElementById("genres").value = film?.genres.join(',') || "";
}

// methode pour afficher formulaire modal vide
let afficherFormulaireVide = () => {
    
    document.getElementById("btnModif").style = "display:none";
    document.getElementById("btnCreer").style = "display:block";
    document.getElementById("filmid").value = 0;
    document.getElementById("title").value =  "";
    document.getElementById("year").value =  "";
    document.getElementById("runtime").value = "";
    document.getElementById("director").value =  "";
    document.getElementById("actors").value = "";
    document.getElementById("plot").value = "";
    document.getElementById("posterUrl").value =  "";
    document.getElementById("genres").value = "";
}

// methode pour enlever un film du tableau
let remove = () =>
{   
    for (var i = tabDesFilms.length - 1; i >= 0; --i) {
        if (tabDesFilms[i].id == FilmASupprimer) {
            tabDesFilms.splice(i,1);
        }
    }
    rechercherFilms();
}





    
   


