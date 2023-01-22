; (function GreasemonkeyCompatibility(GM) {
    if (GM === undefined) {
        console.warn("Can't find Greasemonkey Object.");
        return;
    }


    GM.xmlHttpRequest = GM.xmlHttpRequest || GM_xmlhttpRequest;
    GM.setValue = GM.setValue || GM_setValue;
    GM.getValue = GM.getValue || (arg => Promise.resolve(GM_getValue(arg)));
    GM.deleteValue = GM.deleteValue || GM_deleteValue;
    GM.info = GM.info || GM_info;

    GM.setItem = GM.setValue;
    GM.getItem = GM.getValue;
    GM.removeItem = GM.deleteValue;

    GM.getResourceUrl = (function () {
        if (GM.getResourceUrl) {
            const origin_getResourceUrl = GM.getResourceUrl;

            return async (url, type) => {
                if (type) {
                    let blob_url = await origin_getResourceUrl(url),
                        blob = await fetch(blob_url).then(r => r.blob()),
                        new_blob = blob.slice(0, blob.size, type),
                        new_blob_url = URL.createObjectURL(new_blob);

                    return new_blob_url;
                }
                else {
                    return origin_getResourceUrl(url);
                }
            };
        }
        else {
            return (url, type) => {
                let res = GM_getResourceURL(url).replace("text/plain", type || "text/plain");

                return Promise.resolve(res);
            };
        }
    })();

    GM.addStyle = async function (data, { isLink, isResource }, observer= undefined) {
        if (head = document.head) {

            if (Array.isArray(data)) {
                data.forEach(d => GM.addStyle(d, { isLink, isResource }));
            } else if (isLink) {
                let url = isResource? await GM.getResourceUrl(data, 'text/css') : data;

                let link = document.createElement('link');

                link.setAttribute('rel', 'stylesheet');
                link.setAttribute('type', 'text/css');
                link.setAttribute('href', url);

                head.appendChild(link);
            } else {
                let style = document.createElement('style');

                style.setAttribute('type', 'text/css');
                style.textContent = data;

                head.appendChild(style);
            }

            observer?.disconnect();
        } else if (observer == undefined) {
    
            observer = new MutationObserver(()=> GM.addStyle(data, { isLink, isResource }, observer));
            observer.observe(document.documentElement, { childList: true });
        }
    }

    GM.getResourceText = async function (resource) {
        let url = await GM.getResourceUrl(resource),
            blob = await fetch(url).then(r => r.blob()),
            text = await new Response(blob).text();
        return text;
    }

    GM.ajax = function (url, options) {
        options = options || { url };
        if (typeof url === "object") {
            options = url;
        }
        console.info(options.type || "GET", options.url);


        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest(Object.assign({}, options, {
                method: "GET",
                onload: response => resolve(response.response),
                onerror: error => reject(error)
            }));

        });
    };
})(GM);