import myJson from './data.json' assert {type: 'json'};

function add_line(message){
	document.getElementById("p_element").innerHTML += message + "<br>";
}

function clear(){
	document.getElementById("p_element").innerHTML = '';
}

function it_dict_double(dict, term){
	for (var key in dict) {
	  var value = dict[key];
	  for (var innkey in value){
		  var innvalue = value[innkey];
		  if (innkey.includes(term)){
			  add_line(innkey + " " + innvalue);
		  }
	  }
	}
}

function it_dict(dict, term){
	for (var key in dict){
		var value = dict[key];
		if (key.includes(term)){
			add_line(key + " " + value);
		}
	}
}

function pressed(element){
	if (element.key == "Enter"){
		clear();
		var inp = input_element.value;
		it_dict(myJson, inp);
	}
	else{
		console.log('pressed something else');
	}
}

input_element.addEventListener('keydown', pressed); //executes updateValue, on keydown

