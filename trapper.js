(function(){
	function Trapper(store){
		if ($.isArray(store)){
			return new ArrayTrapper(store);
		} else if($.isPlainObject(store)) {
			return new ObjectTrapper(store);
		}
		this.observers = [];
		this.injest(store);
	}
	Trapper.prototype.set = function(path, value){
		if (value === undefined) {value = path; path = null}
		if (path && path.length) {
			return this.resolve(path).set(value);
		}
		this.injest(value);
		this.ping();
		return this;
	};
	Trapper.prototype.get = function(path){
		if (path) {
			var resolved = this.resolve(path);
			return resolved ? resolved.get() : undefined;
		} else {
			return this.flatten();
		}
	};
	Trapper.prototype.injest = function(value){
		this.store = value;
	}
	Trapper.prototype.flatten = function(){
		return this.store;
	}
	Trapper.prototype.resolve = function(path){
		if (!path || !path.length || path[0] === "") {
			return this;
		} else {
			throw new Error("Path does not exist.");
		}
	};
	Trapper.prototype.bind = function(observer, ping){
		this.observers.push(observer);
		var self = this;
		if (ping) {
			this.ping(observer);
		};
		return this;
	};
	Trapper.prototype.ping = function(callback){
		value = this.get();
		if (callback) {
			callback.call(this, value);
		} else {
			var self = this;
			$.each(this.observers, function(){
				this.call(self, value);
			});
		}
	}
	
	function ObjectTrapper(store){
		this.observers = [];
		this.injest(store);
	}
	ObjectTrapper.prototype = new Trapper();
	ObjectTrapper.prototype.resolve = function(path){
		if (!path || !path.length || path[0] === "") {
			return this;
		} else if (!$.isArray(path)){
			path = path.split('.');
		}
		var pathComponent = path.shift();
		if (this.store[pathComponent]){
			return this.store[pathComponent].resolve(path);
		} else {
			throw new Error("Key does not exist.");
		}
	}
	ObjectTrapper.prototype.injest = function(value){
		this.store = {};
		for (var key in value){
			this.store[key] = new Trapper(value[key]);
		}
	}
	ObjectTrapper.prototype.flatten = function(){
		var flattened = {};
		for (var key in this.store){
			flattened[key] = this.store[key].get();
		}
		return flattened;
	}
	
	function ArrayTrapper(store){
		this.bindings = [];
		this.injest(store);
	}
	ArrayTrapper.prototype = new ObjectTrapper();
	ArrayTrapper.prototype.injest = function(value){
		this.store = [];
		for (var i = 0, length = value.length; i < length; i++){
			this.store.push(new Trapper(value[i]));
		}
	}
	ArrayTrapper.prototype.flatten = function(){
		var flattened = [];
		for (var i = 0, length = this.store.length; i < length; i++){
			flattened.push(this.store[i].get());
		}
		return flattened;
	};
	
	window['Trapper'] = Trapper;
})();