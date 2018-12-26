function initialize () {
}

function sendRequest () {
  var list = document.getElementById("search_results");
   var xhr = new XMLHttpRequest();
   var query = encodeURI(document.getElementById("form-input").value);
   xhr.open("GET", "proxy.php?method=/3/search/movie&query=" + query);
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
           var res = json.results;
          for (i in res){
            var movie =res[i];
            var lin = document.createElement('links_to_movies');
            var results = document.createTextNode(movie.title+"    "+movie.release_date);
            lin.appendChild(results);
            lin.setAttribute('id',movie.id);
            lin.addEventListener("click",display);
            list.appendChild(lin);
            var br = document.createElement("br");
            list.appendChild(br);
          }
          
       }
   };
   xhr.send();
}

 function display(e)
 {
 
  var elem = e.target;
   var mov_id = elem.id;
   display_info(mov_id);
   display_cast(mov_id);
 }
 function display_info(mov_id)
 { var disp = document.getElementById("outputmovie");
  var xh = new XMLHttpRequest();
   xh.open("GET", "proxy.php?method=/3/movie/"+mov_id);
   xh.setRequestHeader("Accept","application/json");
   xh.onreadystatechange = function () {
       if (this.readyState == 4) {
          var details = JSON.parse(this.responseText);
          var det = details.title+"    "+ details["overview"];
          console.log(details) ;
          var path = "http://image.tmdb.org/t/p/w185/"+details.poster_path;
          var genres = details.genres;
          var all =[];
          for (i in genres){
            all.push(genres[i].name);
          }
          disp.appendChild(document.createTextNode(det));
          disp.appendChild(document.createElement('br')) ;
          // var test = document.createElement("sam");
          // var s = document.createTextNode(details.title+" "+details.overview);
          // test.appendChild(s);
          // document.getElementById("outputmovie").appendChild(test);

          disp.appendChild(document.createTextNode(all.join(",")));

         var x = document.createElement("IMG");
            x.setAttribute("src", path);
            x.setAttribute("width", "150");
            x.setAttribute("height", "50");
            x.setAttribute("alt", "The Pulpit Rock");
            disp.appendChild(x);
        }       
   };
   xh.send(); 
}
 function display_cast(mov_id)
 { 
  var xh = new XMLHttpRequest();
   xh.open("GET", "proxy.php?method=/3/movie/"+mov_id+"/credits");
   xh.setRequestHeader("Accept","application/json");
   xh.onreadystatechange = function () {
       if (this.readyState == 4) {
          var details = JSON.parse(this.responseText);
          var disp = document.getElementById("displa");
          var test = document.createElement("sam");
          var det =[];
          for (i in details.cast)
          {
            if (i<=5)
            det.push(details.cast[i]["name"]); 
          }
          var s = document.createTextNode(det);
          test.appendChild(s);
          disp.appendChild(test);

        }       
   };
   xh.send(); 
}
