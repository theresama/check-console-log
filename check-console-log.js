var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');

function findConsoleLog(code) {
    var ast = esprima.parse(code, {loc: true});

    estraverse.traverse(ast, {
        enter: function(node){
	    if (node.type === 'ExpressionStatement'){
	    	if (node.expression.type === 'CallExpression'){
		    if (node.expression.callee.object.name === 'console' && node.expression.callee.property.name === 'log'){
		        console.log('Found a console.log() statement at: Line', 
				node.loc.start.line, 
				'Column:', 
				node.loc.start.column);
			return 1;
		    }
		}
	    }		    
	}
    });
    return 0;
}

var retvals = []

for (var i = 2; i < process.argv.length; i++){
    retvals.push(findConsoleLog(fs.readFileSync(process.argv[i])));
}

process.exit(Math.max.apply(null, retvals));
