Stencil.js is a [jquery-haml](http://github.com/creationix/jquery-haml) preprocessor that joins your template and data.

    var data = {
    	name: "Food blender",
    	price: "99.95",
    	reviews: [
    		{
    			reviewer: "Bob",
    			date: "2010-06-18T00:14:40.687Z",
    			review: "It sucks."
    		},
    		{
    			reviewer: "Steve",
    			date: "2010-06-19T00:14:40.687Z",
    			review: "It's awesome."
    		}
    	]
    };

    var template = ['#product',
    	['%h1', {key:'name'}], ['%h2', {key:'price'}],
    	['%ul#reviews', {key: 'reviews', children:[
    		'%li', ['%p.name', {key:'reviewer'}, ['%span', {key:'date'}]],
    		['%p', {key:'review'}]
    	]}]
    ],
