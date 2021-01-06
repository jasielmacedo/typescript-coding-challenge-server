
class Stack {
    constructor() {
        this.stack = []
    }

    push(element) {
        this.stack.push(element)
    }

    pop() {
        if (this.isEmpty()) return null
        return this.stack.pop()
    }

    peek() {
        if (this.isEmpty()) return null
        return this.stack[this.stack.length - 1]
    }

    isEmpty() {
        return !this.stack.length
    }

    clear()
    {
        this.stack = [];
    }
}


var vertexList = ['a','b','c','d','e','f','g']
var edgeList = [['a','b'], ['a','c'], ['b','a'], ['b','d'], ['d','b'],['c','a'],['c','f'],['c','e'],['e','c'],['e','g'],['g','e'],['f','c']]

var graphs = {
    vertexList,
    edgeList
}

function dfs(graph, start)
{
    var adjacencyList = {};

    graph.edgeList.forEach((edge) => {
        if(adjacencyList[edge[0]] == undefined)
            adjacencyList[edge[0]] = [];
        adjacencyList[edge[0]].push(edge[1])
    });
    
    
    var stack = new Stack();
    stack.push(start);
    
    var visitedVertex = [];
    while(stack.peek() != null)
    {
        current = stack.pop();
        adjacencyList[current].forEach((neighbor)=> {
            if(!visitedVertex.includes(neighbor))
                stack.push(neighbor);
        });
        visitedVertex.push(current);
    }

    return visitedVertex;
}


function dfs_path(graph, start, goal)
{
    var adjacencyList = {};

    graph.edgeList.forEach((edge) => {
        if(adjacencyList[edge[0]] == undefined)
            adjacencyList[edge[0]] = [];
        adjacencyList[edge[0]].push(edge[1])
    });

    var stack = new Stack();
    stack.push([start,[start]]);

    var desiredPath = [];

    while(stack.peek != null)
    {
        var vertexPath = stack.pop();
        if(vertexPath == null)
            break;

        let adjList = adjacencyList[vertexPath[0]].filter( (el ) => {
                return !vertexPath[1].includes( el );
        })
       
        adjList.forEach((next)=> {
            if(next == goal)
            {
                let val = vertexPath[1];
                val.push(next);
                desiredPath.push(val);
            }else
            {
                let val = vertexPath[1];
                val.push(next);
                stack.push([next,val]);
            }                
        });
    }

    return desiredPath;
}

console.log(dfs_path(graphs,'a','e'))



function arr_diff (a1, a2) 
{

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}