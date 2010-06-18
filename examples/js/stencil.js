(function(){
	function boundTextNode(trapper, callback){
		var textNode = document.createTextNode('');
		trapper.bind(function(value){
			textNode.nodeValue = callback ? callback(value) : value;
		}, true);
		return textNode;
	}
	function boundNodeSet(template, trapper, callback){
		var placeholder = $.haml.placeholder(function(){
			if (trapper.store.length) {
				var haml = [];
				for (var i = 0, l = trapper.store.length; i < l; i++){
					haml.push(stencil(template, trapper.store[i]));
				};
				return haml;
			} else {
				return document.createTextNode('');
			}
		});
		trapper.bind(function(){
			placeholder.update();
		});
		return placeholder.inject();
	}
	
	function stencil(template, data, index){
		var bound = data instanceof Trapper;
		if ($.isArray(template)) {
			template = Array.prototype.slice.call(template, 0);
			for(var i = 0, l = template.length; i < l; i++){
				template.splice(i, 1, stencil(template[i], data, index));
			}
		} else if($.isPlainObject(template)) {
			if ('key' in template) {
				if (template.handler) {
					template = template.handler.call(bound ? data.resolve(template.key) : data[template.key]);
				} else if (template.children) {
					if (bound) {
						return boundNodeSet(template.children, data.resolve(template.key), template.callback);
					} else {
						template = $.map(data[template.key], function(item){
							return [stencil(template.children, item)];
						});
					}
				} else if (template.conditional) {
					template = (bound ? data.resolve(template.key).get() : data[template.key]) ? stencil(template.conditional, data) : [];
				} else {
					if (bound) {
						return boundTextNode(data.resolve(template.key));
					} else {
						template = (template.key === '' ? data : data[template.key] || '').toString();
					}
				}
			} else if(index === 1) {
				template = $.extend({}, template);
				for (var key in template){
					template[key] = stencil(template[key], data);
				}
			}
		}
		return template;
	}
	window['stencil'] = stencil;
})();