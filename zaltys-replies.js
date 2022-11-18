
import myJson from '/zaltys-replies.json' assert {type: 'json'};


function StringSearch() {
	var term = input_element.value;
	var text = "";
	var myStringArray = myJson;
	var chars = term.length;
	
	for (var i = 0; i < myStringArray.length; i++) {
	  var arr = myStringArray[i];
	  var other = arr[0];
	  var zaltys = arr[1];
	  var date = arr[2];
	  var channel = arr[3];
	  
	  if (zaltys.toLowerCase().includes(term.toLowerCase()) || other.toLowerCase().includes(term.toLowerCase())){
		
		var after = other;
		while (true) {
			if (after.includes("```")) {
				var i1 = other.indexOf("```");
				var before = other.substr(0, i1);
				var rest = other.substr(i1+3);
				var i2 = rest.indexOf("```");
				var middle = other.substr(i1+3, i2);
				var after = rest.substr(i2+3);
				other = before + '<pre><code>' + middle + '</code></pre>' + after;
			}
			else {
				break;
			}
		}
		
		var after = other;
		while (true) {
			if (after.includes("`")) {
				var i1 = other.indexOf("`");
				var before = other.substr(0, i1);
				var rest = other.substr(i1+1);
				var i2 = rest.indexOf("`");
				var middle = other.substr(i1+1, i2);
				var after = rest.substr(i2+1);
				other = before + '<b>' + middle + '</b>' + after;
			}
			else {
				break;
			}
		}
		
		var after = other;
		while (true) {
			if (after.includes("~~")) {
				var i1 = other.indexOf("~~");
				var before = other.substr(0, i1);
				var rest = other.substr(i1+2);
				var i2 = rest.indexOf("~~");
				var middle = other.substr(i1+2, i2);
				var after = rest.substr(i2+2);
				other = before + '<del>' + middle + '</del>' + after;
			}
			else {
				break;
			}
		}
		
		// highlight first occurrence of term
		var i1 = other.toLowerCase().indexOf(term.toLowerCase());
		if (i1 >= 0) {
			var before = other.substr(0, i1);
			var after = other.substr(i1+chars);
			other = before + '<span style="color:lightgreen">' + other.substring(i1, i1+chars) + '</span>' + after;
		}
		
		var after = zaltys;
		while (true) {
			if (after.includes("```")) {
				var i1 = zaltys.indexOf("```");
				var before = zaltys.substr(0, i1);
				var rest = zaltys.substr(i1+3);
				var i2 = rest.indexOf("```");
				var middle = zaltys.substr(i1+3, i2);
				var after = rest.substr(i2+3);
				zaltys = before + '<pre><code>' + middle + '</code></pre>' + after;
			}
			else {
				break;
			}
		}

		var after = zaltys;
		while (true) {
			if (after.includes("`")) {
				var i1 = zaltys.indexOf("`");
				var before = zaltys.substr(0, i1);
				var rest = zaltys.substr(i1+1);
				var i2 = rest.indexOf("`");
				var middle = zaltys.substr(i1+1, i2);
				var after = rest.substr(i2+1);
				zaltys = before + '<b>' + middle + '</b>' + after;
			}
			else {
				break;
			}
		}

		var after = zaltys;
		while (true) {
			if (after.includes("~~")) {
				var i1 = zaltys.indexOf("~~");
				var before = zaltys.substr(0, i1);
				var rest = zaltys.substr(i1+2);
				var i2 = rest.indexOf("~~");
				var middle = zaltys.substr(i1+2, i2);
				var after = rest.substr(i2+2);
				zaltys = before + '<del>' + middle + '</del>' + after;
			}
			else {
				break;
			}
		}
		
		// highlight first occurrence of term
		var i1 = zaltys.toLowerCase().indexOf(term.toLowerCase());
		if (i1 >= 0) {
			var before = zaltys.substr(0, i1);
			var after = zaltys.substr(i1+chars);
			zaltys = before + '<span style="color:lightgreen">' + zaltys.substring(i1, i1+chars) + '</span>' + after;
		}
				
		text += date + '     #' + channel + '<br><span>' + "Other:" + '</span> <br>' + other + '<br><span>' + "Zaltys:" + '</span> <br>' + zaltys + '<br><br>';
		
	  }
	}
	
	document.getElementById("demo").innerHTML = text;
}

function pressed() {
  if (event.key == 'Enter') {
    StringSearch();
  }
}
var input_element = document.getElementById("input_id");
input_element.addEventListener('keypress', pressed);
