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


function refStorageObject(key, options = {}) { // reflect
  const save = saveToLocalStorage(key);
    let storaged = JSON.parse(loadFromLocalStorage(key)||null),
        { initial, getHandler } = options;

    if (initial || (storaged?.constructor !== Object)) {
        save(storaged = initial || {});
    }

    return new Proxy(storaged, {
        get(target, prop, value) {
            //value and underbar exceptions are to prevent collisions in vue's reflect proxy.
            return (prop !== "value" && prop[0] !== "_") && getHandler? getHandler(target, prop, value) : target[prop];
        },
        set(target, prop, value, receiver) {
            prop = prop.split(',');
            props = prop.constructor === Array? prop : [prop];

            if (success = props.every(prop => Reflect.set(target, prop, value, receiver))) {
                save(target);
            }

            return success;
        },
        deleteProperty(target, prop) {
            if (prop in target) {
                delete target[prop];
                save(target);
            }
            return true;
        }
    });
}

function refStorageNested(obj, force) {
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