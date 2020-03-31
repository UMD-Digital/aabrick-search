
$(document).ready(function() {

    let paramString = window.location.search.substr(1);
    let params = {};
    if (paramString != null && paramString != ""){
        params = transformToAssocArray(paramString);
        if (params['map'] === 'Brick'){
            $('#plaza-map').show();
            $('#brick-coords').text('Legacy Plaza ')
        } else if (params['map'] === 'Paver'){
            $('#garden-map').show();
            $('#brick-coords').text('Moxley Gardens ')
        }
        $('#purchaser-name').text(decodeURIComponent(params['name']));
        $('#brick-coords').append(params['coords']);
        $('#brick-quad').text(params['quad']);
        $('#brick-inscription').text(decodeURIComponent(params['inscription']));
    } else {
        $('#err').show();
        $('#brick-data').hide();
    }

});

// Adapted from https://stackoverflow.com/questions/5448545/
transformToAssocArray = (string) => {
   let params = {};
   let paramArray = string.split("&");
   for (let i = 0; i < paramArray.length; i++){
       let tmparr = paramArray[i].split("=");
       params[tmparr[0]] = tmparr[1];
   }
   return params;
}
