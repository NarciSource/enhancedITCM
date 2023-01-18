document.addStyle = (urls, observer= undefined) => {

    if (document.head) {

        ;(Array.isArray(urls)? urls : [urls]).forEach(url => {

            let link = document.createElement('link');

            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('type', 'text/css');
            link.setAttribute('href', url);

            document.head.append(link);
        });

        observer?.disconnect();
    }
    else if (observer == undefined) {

        observer = new MutationObserver(()=> document.addStyle(urls, observer));
        observer.observe(document.documentElement, { childList:true });
    }
}


var saveTo = R.curry((storage, name, value)=> storage.setItem(name, (typeof value==="object")? JSON.stringify(value) : value)),
    loadFrom = R.curry((storage, name)=> storage.getItem(name)),
    deleteFrom = R.curry((storage, name)=> storage.removeItem(name));

var saveToLocalStorage = saveTo(localStorage),
    loadFromLocalStorage = loadFrom(localStorage),
    deleteFromLocalStorage = deleteFrom(localStorage),
    saveToHugeStorage = saveTo(GM),
    loadFromHugeStorage = loadFrom(GM),
    deleteFromGMStorage = deleteFrom(GM); 

function ref_StorageObject(key, initial) { // reflect
  const save = saveToLocalStorage(key);
    let storaged = JSON.parse(loadFromLocalStorage(key)||null);

    if (initial || (storaged?.constructor !== Object)) {
        save(storaged = initial || {});
    }

    return new Proxy(storaged, {
        set(target, prop, value, receiver) {
            prop = prop.split(',');
            props = prop.constructor === Array? prop : [prop];

            if (success = props.every(prop => Reflect.set(target, prop, value, receiver))) {
                save(target);
            }

            return success;
        }
    });
}

function ProxySet(key, value, force) {
    class ProxySet extends Set {
        constructor(key, value, force) {
            super((force || !loadFromLocalStorage(key))? value : JSON.parse(loadFromLocalStorage(key)));
            
            this._saveIntoStorage = ()=> saveToLocalStorage(key)(Array.from(this));

            this._saveIntoStorage();

            return this;
        }

        has(arg) {
            if (typeof arg === "object") {
                let subject = JSON.stringify(arg);
                arg = [...this].find(each => JSON.stringify(each) === subject) || arg;
            }
            return Set.prototype.has.call(this, arg);
        }
        delete(arg) {
            if (typeof arg === "object") {
                let subject = JSON.stringify(arg);
                arg = [...this].find(each => JSON.stringify(each) === subject) || arg;
            }
            return Set.prototype.delete.call(this, arg);
        }
        in(arg) {
            if (Array.isArray(arg)) {
                arg.forEach(each=> this.add(each));
            } else {
                this.add(arg);
            }
            this._saveIntoStorage();
            return this;
        }
        out(arg) {
            if (Array.isArray(arg)) {
                arg.forEach(each=> this.delete(each));
            } else {
                this.delete(arg);
            }
            this._saveIntoStorage();
            return this;
        }
        io(bool, arg) {
            bool? this.in(arg) : this.out(arg);
            return this;
        }
        switch(arg) {
            this.has(arg)? this.out(arg) : this.in(arg);
            return this;
        }
        filter(func) {
            return new ProxySet(undefined, Array.from(this).filter(func));
        }
    }

    return new ProxySet(key, value, force);
}

function ProxyObject(obj, force) {
    Object.entries(obj).forEach(([key, val])=> {
        if (force || !loadFromLocalStorage(key)) saveToLocalStorage(key)(val);
        else obj[key] = loadFromLocalStorage(key);
    });
    
    return new Proxy(obj, {
        get(target, key, receiver) {
            if (!Reflect.has(target, key, receiver)) {
                return loadFromLocalStorage(key);
            }
            return Reflect.get(target, key, receiver);
        },
        set(target, key, val, receiver) {
            saveToLocalStorage(key)(val);
            return Reflect.set(target, key, val, receiver);
        }
    });
}