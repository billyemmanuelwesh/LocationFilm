class Film {
        //delaration des champs privees
        #id;
        #title;
        #year;
        #runtime;
        #genres;
        #director;
        #actors;
        #plot;
        #posterUrl
    
        // declaration de constructeur
        constructor(id, title, year, runtime, genres, director, actors, plot, posterUrl) {
            this.#id = id;
            this.#title = title;
            this.#year = year;
            this.#runtime = runtime;
            this.#genres = genres;
            this.#director = director;
            this.#actors = actors;
            this.#plot = plot;
            this.#posterUrl = posterUrl;      
            }
    
        // declaration des methodes d'accès   
        get id() {return this.#id;}
        get title() {return this.#title;}
        get year() {return this.#year;}
        get runtime() {return this.#runtime;}
        get genres() {return this.#genres;}
        get director() {return this.#director;}
        get actors() {return this.#actors;}
        get plot() {return this.#plot;}
        get posterUrl() {return this.#posterUrl;}
            
        // declaration des methodes de modification    
        set id(nouvId){this.#id = nouvId;}
        set title(nouvTitle){this.#title = nouvTitle;}
        set year(nouvYear){this.#year = nouvYear;}
        set runtime(nouvRuntime){this.#runtime = nouvRuntime;}
        set genres(nouvGenres){this.#genres = nouvGenres;}
        set director(nouvDirector){this.#director = nouvDirector;}
        set actors(nouvActors){this.#actors = nouvActors;}
        set plot(nouvPlot){this.#plot = nouvPlot;}
        set posterUrl(nouvPoster){this.#posterUrl = nouvPoster;}
    
    } 