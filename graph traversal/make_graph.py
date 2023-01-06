import json

def open_json(filename):
    with open(filename, 'r', encoding="utf-8") as f:
        contents = json.load(f)
        f.close()
    return contents

def make_json(dic, filename):
    with open(filename, 'w', encoding="utf-8") as f:
        json.dump(dic, f, indent=2)
        f.close()

stampy = open_json('stampy_canonically_answered.json')
base_data = []
for q, info in stampy['actual data'].items():
    a = info['answer']
    tags = [{
        'tag':tup[0],
        'link':tup[1]
    } for tup in info['tags'] if tup[0] not in ['(', 'None (', 'create tag']]
    base_data.append({
        'question':q,
        'answer':a,
        'tags':tags,
        'links to':info['meta']['links to']
    })
make_json(base_data, 'stampy_reshaped.json')

# checks if two lists share items
def check_shared(l1, l2):
    pool = l1+l2
    for item in pool:
        if pool.count(item) > 1:
            return True
    return False

def collect_attributes(d):
    atts = []
    for k,v in d.items():
        if k in ['name', 'content', 'tags'] + list(checkers['relationship_types'].keys()):
            continue
    atts += d['tags']
    return list(set(atts))

# checks if 2 dictionaries share attributes (skipping name and content), unfortunately relies on a global variable full_picture
def share_attributes(arg1, arg2):
    shared = check_shared(
        collect_attributes(arg1),
        collect_attributes(arg2)
    )
    if shared:
        if 0:
            print(f'{arg1["name"]} \n---------------\nshares atts with \n{arg2["name"]}')
            print(arg1)
            print('-'*15)
            print(arg2)
            print([k for k in arg1.keys()])
            print([k for k in arg2.keys()])
            exit()
    return shared

def element_of(arg1, arg2):
    False

def generalization_of(arg1, arg2):
    False

# a bunch of functions for determining metadata of an arg dictionary
checkers = {
    'extracters':{ # takes 1 arg, returns an attribute
        'name':lambda arg:arg['question'],
        'content':lambda arg:'\n'.join(['Question:',arg['question'],'', 'Answer:',arg['answer']]),
        'tags':lambda arg:[item['tag'] for item in arg['tags']]
    },
    'relationship_types':{ # takes 2 args, returns True or False, saying if the 2 args have that relationship or not
        'element_of':element_of,
        'generalization_of':generalization_of,
        'share_attributes':share_attributes
    }
}

'''
broadly speaking, this:
    - first extracts "first order" traits, using checkers['extracters']
    - then "second order" traits, using checkers['relationship types'], to see how nodes relate to each other
        - each function returns a boolean, and takes 2 arguments (dictionaries with info), if True, the 2 args have that relationship
'''
def generate_graph(base_data, checkers):

    # make sure base_data is a list of dictionaries
    assert type(base_data) == list
    for item in base_data:
        assert type(item) == dict

    # make sure checkers are correct
    for req in ['extracters', 'relationship_types']:
        assert req in checkers
    for ext_req in ['name', 'content']:
        assert ext_req in checkers['extracters']
    
    # first extract "first order" attributes
    full_picture = {}
    for d in base_data:
        name = checkers['extracters']['name'](d)
        full_picture[name] = {
            extracted_quality:func(d) for extracted_quality,func in checkers['extracters'].items()
        }

    # then get relationships between nodes based on extracted attributes

    # this will store for each name, for each relationship type, a list of names with whom this relationship is shared
    rel_data = {name:{rel_name:[] for rel_name in checkers['relationship_types']} for name in full_picture.keys()}
    for d in base_data:
        name = checkers['extracters']['name'](d)
        info = full_picture[name]
        for rel_name, checker in checkers['relationship_types'].items():
            full_picture[name][rel_name] = []

            # yes this is O(n^2) instead of some other notation that's more gooder, i dont care.
            for name2, info2 in full_picture.items():
                if name2 == name:
                    continue

                if checker(info, info2):
                    rel_data[name][rel_name].append(name2)
    
    # finally store relationship data in each name's dictionary. (i think this seperation is necessary, to prevent shared relationship_types from being counted as shared attributes)
    for name in full_picture.keys():
        for rel_name in checkers['relationship_types'].keys():
            shared_with = rel_data[name][rel_name]
            full_picture[name][rel_name] = list(set(shared_with))

    graph = []
    for d in base_data:
        name = checkers['extracters']['name'](d)
        final_d = {}
        for k in list(checkers['extracters'].keys()) + list(checkers['relationship_types'].keys()):
            final_d[k] = full_picture[name][k]
        graph.append(final_d)

    '''asserts check that:
    - graph is a list of dictionaries
    - each dictionary has:
        - a string under 'name' and 'content'
        - a list under the rest
    '''
    assert type(graph) == list
    for item in graph:
        assert type(item) == dict
        for key, value in item.items():
            if key in ['name', 'content']:
                assert type(value) == str
            else:
                assert type(value) == list
    real_nodes = [d['name'] for d in graph]
    fake_connections = []
    for d in graph:
        for k,v in d.items():
            if k in ['name', 'content']:
                continue
            for connection in v:
                if connection not in real_nodes:
                    fake_connections.append(connection)
    fake_connections = list(set(fake_connections))

    graph = [d for d in graph if d['name'] not in fake_connections]

    for n, d in enumerate(graph):
        homies = d['share_attributes']
        atts = []
        for k,v in full_picture[d['name']].items():
            if k not in checkers['extracters'].keys():
                continue
            if k in ['content', 'name']:
                continue
            if type(v) == bool:
                atts.append(k)
            if type(v) == list:
                atts += v
        share_info = {a:[] for a in atts}

        for homie in homies:
            atts2 = []
            for k,v in full_picture[homie].items():
                if k not in checkers['extracters'].keys():
                    continue
                if k in ['content', 'name']:
                    continue
                if type(v) == bool:
                    atts2.append(k)
                if type(v) == list:
                    atts2 += v
            for a in atts:
                if a in atts2:
                    share_info[a].append(homie)

        share_info = {k:list(set(v)) for k,v in share_info.items()}
        to_delete = []
        for k,v in share_info.items():
            graph[n][f'shares_{k}_tag_with'] = v
        del graph[n]['share_attributes']

        graph[n] = {k:v for k,v in graph[n].items() if v!=[]}
    return graph

make_json(generate_graph(base_data, checkers), 'graph_traversal.json')



