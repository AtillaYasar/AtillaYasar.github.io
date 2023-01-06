import myJson from '/graph_traversal.json' assert {type: 'json'};

const lst = myJson;
let existingNodes = [];
for (const obj of lst){
  existingNodes.push(obj['name']);
}
const connectionNames = getKeys(lst);
let to_skip = ['name', 'content'];
const default_script = [
  'category off',
  'another_category off',
  '',
  'background black',
  'textcolor #b50781',
  'textsize 20',
  'you can also set textfont'
]
document.getElementById("textarea").value = default_script.join('\n');
document.getElementById("textarea").style.height = 200;
document.getElementById("textarea").style.width = 300;

// divElements contains for each connectionType (like name, content, next, previous, related, etc.) the corresponding div.
var divElements = {};
for (const name of connectionNames) {
  const div = document.createElement('div');
  div.innerHTML = name;
  divElements[name] = div;
}
document.body.append(...Object.values(divElements));

// returns all the unique keys of the dictionaries inside dictList. (and lst is a list of dictionaries. what a coincidence)
function getKeys(dictList){
  const unique = [];
  const keys = dictList.reduce((acc, dict) => acc.concat(Object.keys(dict)), []);
  for (var i = 0; i < keys.length; i++){
    var k = keys[i];
    if (!unique.includes(k)){
      unique.push(k);
    }
  }
  return unique;
}

// read nodes from from the lst[nodeName][connectionName] list and add to the corresponding div 1 by 1
function createButtons(nodeName) {
    // extract script
    var script = document.getElementById('textarea').value;
    var script_lines = script.split('\n');
    var turned_off = [];
    for (var i = 0; i < script_lines.length; i++){
      var words = script_lines[i].split(' ');
      if (words.length==2){
        if (words[1]=='off'){
          turned_off.push(words[0]);
        }
        if (words[0]=='background'){
          document.body.style.backgroundColor = words[1];
          document.getElementById("textarea").style.backgroundColor = words[1];
        }
        if (words[0]=='textcolor'){
          document.body.style.color = words[1];
          document.getElementById("textarea").style.color = words[1];
        }
        if (words[0]=='textsize'){
          document.body.style.fontSize = words[1];
          document.getElementById("textarea").style.fontSize = words[1];
        }
        if (words[0]=='textfont'){
          document.body.style.fontFamily = words[1];
          document.getElementById("textarea").style.fontFamily = words[1];
        }
      }
      if (words.length==3){
        if (words[0]=='category' && words[1]=='max' && !(Number.isNaN(parseInt(words[2])))){
          //
        }
      }
    } // end of script

  // Find the node with the specified name
  var node = lst.find(function(n) {
    return n.name === nodeName;
  });

  // add a button for each node inside each connectionType list
  for (var connectionType in node){

    if (turned_off.includes(connectionType)){
      divElements[connectionType].innerHTML = '';
      continue;
    }

    // show the title of the section
    let div = divElements[connectionType];
    div.innerHTML = '<h2>' + connectionType + '</h2>';
    if (typeof(node[connectionType]) === 'string'){
      var new_string = node[connectionType];
      while (new_string.includes('\n')){
        new_string = new_string.replace('\n','<br>');
      }
      div.innerHTML += new_string;
    }
    
    // skip if necessary
    if (to_skip.includes(connectionType)){
      continue;
    }

    // iterate over each node of each connectionType
    const connectedNames = node[connectionType];
    for (var i = 0; i < connectedNames.length; i++){
      const nodeName = connectedNames[i];

      // add a button to the corresponding div
      const button = document.createElement('button');
      button.innerHTML = nodeName;
      if (existingNodes.includes(nodeName)){
        button.onclick = () => navigateToNode(nodeName);
      }
      div.append(button);
    }
  }
}

// idk why this function exists lol
function navigateToNode(nodeName) {
  

    // Find the node with the specified name
    var node = lst.find(function(n) {
      return n.name === nodeName;
    });


    for (const name of connectionNames) {
      divElements[name].innerHTML = '';
    }
  
    createButtons(nodeName);

}

// Initialize the page with the first node in the list
navigateToNode(lst[0].name);
