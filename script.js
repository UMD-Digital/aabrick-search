let urlProd = 'https://advancement.umd.edu/gps/api/v1/lookups/search_paver_brick';

let sectionMap = new Object();

$(document).ready(function() {
  $('.brick-search-input').keydown(function(event) {
    // Allows to submit form by pressing enter on any field
    if (event.which == 13) {
        $("#brick-search-submit").click();
        event.preventDefault();
     }
  });

});

$("#brick-search-submit").click(function() {

  $("#err").hide();

  if ($("#brick-search-input-name").val() || $("#brick-search-input-inscription").val() || $("#brick-search-input-location").val()) {
    return search();
  } else {
    $("#messages").html('');
    $("#tableRows").html('');
    $("#err").show();
  }

})

search = () => {
  let name = $("#brick-search-input-name").val();
  let inscription = $("#brick-search-input-inscription").val();
  if (name == ''){
    name = inscription;
  } else if (inscription != ''){
    name = name.concat(" ", inscription);
  }
  let inputSplit = name.trim().split(" ")

  let location = $("#brick-search-input-location").val();
  let searchUrl = urlProd + '?callback=&api_key=' + api.key;

  var queries = [];

  if (location !== '') {
    searchUrl += '&location=' + location;
  }

  if (name.trim() != '' || inscription.trim() != ''){
    inputSplit.forEach(item => {
      queries.push(searchUrl + '&keyword=' + encodeURIComponent(item))
    });
  } else {
    queries.push(searchUrl);
  }

  let output = []

  queries.forEach((query, idx) => {
    // make an ajax call for each query
    $.ajax({
      url: query,
      type: 'GET',
      async: false,
      success: (res) => {
        if (res.count == 0){
          output = []
        } else {
          if (idx == 0){
            output = res.results;
          } else {
            output = output.filter(value => {
              let cond = false;
              res.results.forEach(obj => {
                if (value.Name === obj.Name){
                  cond = true;
                }
              });
              return cond;
            });
          }
        }
      }, failure: (err) => {
        console.log(err);
        // $("#err").show();
      }
    });
  });

  // Post call location filtering as keyword search does not allow location filtering
  if (output != null){
    output = output.filter(data =>{
      return data.Location.includes(location)
    });
  }

  $("#messages").html('');
  $("#paver-footer").html('');
  $("#tableRows").html('');
  $("#err").css('display','none');
  if (output == null || output.length == 0) {
      $("#err").show();
  } else {
    $("#messages").append(
      "<div class='col-md-12 text-center' style='font-size:16'>"+
          "Showing "+ output.length + " results."+
      "</div><br>"
    )
    $("#paver-footer").append(
      "<div class='col-md-12 text-center' style='font-size:16'>"+
          "Can't find what you are looking for? Try searching by different fields or just your first or last name."+
      "</div><br>"
    )

    for (let i = 0; i < output.length; i++) {
      let locationSplit = output[i].Location.split(" ");
      // Small word prep for the output
      output[i].Location = output[i].Location.replace("Brick", "Legacy Plaza");
      output[i].Location = output[i].Location.replace("Paver", "Moxley Gardens");
      locationName = locationSplit[0].replace("Brick", "Legacy Plaza");
      locationName = locationName.replace("Paver", "Moxley Gardens");

      // Creates the table entry and the custom link
      $("#tableRows").append(
        "<tr><td>"+
        output[i].Name+
        "</td><td>"+
        output[i].Inscription+
        "</td><td>"+
        "<a href='map.html?map=" + encodeURIComponent(locationSplit[0]) +
        "&coords=" + (locationSplit[1]) +
        "&quad=" + (locationSplit[2]) +
        "&name=" + encodeURIComponent(output[i].Name) +
        "&inscription=" + encodeURIComponent(output[i].Inscription) +
        "'>"+
        locationName + ", " + locationSplit[2] + " " + locationSplit[3] + ", " + locationSplit[1]+
        "</a>"+
        "</td></tr>"
      )
    }
  }

}
