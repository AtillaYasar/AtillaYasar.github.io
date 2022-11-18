
function StringSearch() {
  var input = document.getElementById("text_area").value;
  let text = "";
  let i = 0;
  while (true) {
    var result = input.match(new RegExp('"dataFragment":{"data":"(.*?)","'));
    if (result == null) { break; }
	result = result[1];
	
	while (true) {
	  if (result.includes('\\n')) {
	    result = result.replace('\\n', '<br>');
	  }
	  else { break; }
	}
	
	while (true) {
	  if (result.includes('\\"')) {
	    result = result.replace('\\"', '"');
	  }
	  else { break; }
	}

    text += result + '<br>----------<br>';
    input = input.match(new RegExp('"dataFragment":{"data":"(.*)'))[1];
  }
  document.getElementById("demo").innerHTML = text;
}