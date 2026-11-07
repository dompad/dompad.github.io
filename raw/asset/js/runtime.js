window.onload = ()=>{
    window.boot = window.location.pathname + window.location.search + window.location.hash;
    
    window.dom = {
        body: document.body,
        boot: document.getElementById("boot")
    };
    
    dom.body.dataset.load = "ing";

    init();
}

async function init() {
    console.log("Initializing...", {
        iframe: is.iframe(window)
    }, {
        head: window.document.head.outerHTML
    });
    window.eruda && is.mobile() ? eruda.init() : null;

    //SHELL
    var html = ``;

    //WEBMANIFEST
    try {
        var json = await ajax('site.webmanifest');
        var manifest = JSON.parse(json);
        console.log(31, manifest);
        
        document.head.find('title').textContent = manifest.name;
        document.head.find('[name="apple-mobile-web-app-title"]').content = manifest.name;
        document.head.find('[name="apple-mobile-web-app-status-bar-style"]').content = manifest.theme_color;
        document.head.find('[name="application-name"]').content = manifest.name;
        document.head.find('[name="application-shortname"]').content = manifest.short_name;
        document.head.find('[name="msapplication-TileColor"]').content = manifest.theme_color;
        document.head.find('[name="theme-color"]').content = manifest.theme_color;
    } 
    catch (e) {
        console.log(41, e);
    }

    //SHELL
    html = await ajax('./raw/asset/html/template/template.shell.html');
    html.length > 0 ? dom.body.find('boot').insertAdjacentHTML('afterend', html) : null;

    //PAGES
    try {
        var pages = JSON.parse(await ajax("/raw/pages/pages.json"));
        console.log(66, 'pages.json', {pages});
        if (pages && pages.length > 0) {
            var main = dom.body.find('main');
            var p = 0;
            do {
                var row = pages[p];
                var tagName = 'page' + (row.pages ? 's' : '');
                var sel = tagName + '[data-page="' + row.page + '"]';
                el = document.createElement(tagName);
                el.dataset.fetch = "/raw/pages" + row.slug.replaceAll("*", "_") + (rout.ed.dir(row.slug).length > 0 ? "/" : "") + "page.html";
                el.dataset.page = row.slug;
                if (row.main) {
                    main.insertAdjacentHTML('beforeend', el.outerHTML);
                } else {
                    main.insertAdjacentHTML('beforebegin', el.outerHTML);
                }
                p++;
            } while (p < pages.length);
        }
    } 
    catch (e) {
        console.log(72, e);
    }
    
    //FETCH
    const fetching = 0 > 1 ? dom.body.all(':not(page):not(pages)[data-fetch]') : dom.body.all(':not([data-page])[data-fetch]');
    //console.log(fetching);
    if (fetching.length > 0) {
        var f = 0;
        do {
            //console.log(34, fetching[f]);
            if (fetching[f].innerHTML === "") {
                //alert(fetching[f].outerHTML);
                fetching[f].innerHTML = await ajax(fetching[f].dataset.fetch);
            }
            f++;
        } while (f < fetching.length);
    }   

    
    //EVENTS
    touch.ing = false;
    touch.events = {
        dbltap: on.touch.dbltap,
        drag: on.touch.drag,
        press: on.touch.press,
        tap: on.touch.tap
    };
    dom.body.dataset.theme = "meridiem";
    dom.body.addEventListener("click", function(e) {
        if (window.touch.ing === false) {
            on.touch.tap(e);
            //console.log(e.type,window.touch.ing);
        } else {
            window.touch.ing = false;
            //console.log(e.type,window.touch.ing);
        }
    });
    dom.body.addEventListener("touchstart", function(e) {
        window.touch.ing = true;
        touch.handler(event);
        //console.log(e.type);
    }, {
        passive: true
    });
    dom.body.addEventListener("touchmove", touch.handler, {
        passive: true
    });
    dom.body.addEventListener("touchcancel", touch.handler, false);
    dom.body.addEventListener("touchend", function(e) {
        //window.touch.ing = false;
        touch.handler(event);
        //console.log(e.type);
    });
    
    window.onpopstate = (event)=>{
        if (event.state) {
            console.log(event.state);
            var state = is.local(window.location.protocol) ? event.state.replace(/^#+/, '') : event.state;
            event.state.length > 0 ? event.state.router() : null;
        } else {
            if (document.location) {//console.log({place});
            }
        }
        //console.log(event, "location: " + document.location + ", state: " + JSON.stringify(state));
    }

    //ROUTE
    0 < 1 ? window.boot.router().then(function() {
        console.log("...Initialized", {
            iframe: is.iframe(window)
        }, {
            boot
        });
    }) : null;
}
