window.onload = ()=>{
    window.dom = {
        body: document.body,
        boot: document.getElementById("boot")
    };

    window.global = window.globals;
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

    window.loaded = is.iframe(window);

    //SHELL
    var html = ``;
    
    //BUILDER
    const user = await github.user.get();
    const owner = user.login;
    const repo = window.parent.route.GOT[1];
    const branch = 'main';
    const path = '/raw/style/template.html';
    const resource = '/' + owner + '/' + repo + '/' + branch + path;
    try {
        console.log(44, 'index.init.template', {
            iframe: is.iframe(window)
        }, {
            owner,
            path,
            repo
        }, resource);
        html = await github.raw.git(resource);
        var doc = new DOMParser().parseFromString(html, 'text/html');

        var header = doc.body.find('body > header');
        if (header) {
            dom.body.find('body > header').replaceWith(header);
        }

            try {
                var pages = await github.raw.git('/' + owner + '/' + repo + '/' + branch + "/raw/pages/pages.json");
                console.log(66, 'pages.json', pages);
                if (pages && pages.length > 0) {
                    var main = dom.body.find('main');
                    var p = 0;
                    do {
                        var row = pages[p];
                        var tagName = 'page' + (row.pages ? 's' : '');
                        var sel = tagName + '[data-page="' + row.page + '"]';
                        el = doc.createElement(tagName);
                        el.dataset.fetch = "raw/pages" + row.slug.replaceAll("*", "_") + (rout.ed.dir(row.slug).length > 0 ? "/" : "") + "page.html";
                        el.dataset.page = row.slug;
                        if (row.main) {
                            main.find('template').insertAdjacentHTML('beforebegin', el.outerHTML);
                        } else {
                            main.insertAdjacentHTML('beforebegin', el.outerHTML);
                        }
                        p++;
                    } while (p < pages.length);
                }
            } catch (e) {
                console.log(72, e);
            }

            var footer = doc.body.find('body > footer');
            if (footer) {
                dom.body.find('body > footer').replaceWith(footer);
            }

            0 > 1 ? console.log(48, {
                doc,
                html
            }, {
                header,
                footer
            }) : null;


        //ROUTE
        var go = false;
        //alert('Loading page...');
        window.boot.router().then(function() {
        //alert('Page loaded');
        go = true;
        var vp = dom.body.find('[data-fetch][data-page="' + route.page + '"]');
        var empty = dom.body.find('main').lastElementChild.content.firstElementChild.cloneNode(true);
        if(vp) {
            vp.find('blocks').insertAdjacentHTML('afterend', empty.outerHTML);
        } else {
            var confirm = modal.confirm("This page does not exist");
            if(confirm) {
                var goto = '/dashboard/:get/pages/page';
                console.log(183, {goto})
            }
        }
        
        }).catch(async(e) => {
        
        //alert("Page not loaded");
        console.log('Page not loaded', {e});
        var confirm = await window.parent.modal.confirm({
            "title": e.code,
            "body": "Page Not Found",
        }, ["Create", "Exit"]);
        if(confirm) {
            window.parent.String.prototype.router.call("/dashboard/:get/build");
        } else {
            window.parent.String.prototype.router.call("/dashboard/:get/pages/page");
        }
        
        });



            
    } catch (e) {
        console.log(89, {e});
        if (0 > 1 && e.code === 404) {
            var confirm = await window.parent.modal.confirm({
                title: "Missing Shell",
                body: "Would you like to generate a template file.",
            }, ["Yes", "No"]);
            if(confirm) {
                window.parent.String.prototype.router.call("/dashboard/:get/build");
            } else {
                alert("Creating shell...");
            }
        }
    }
        console.log(43, "index.js init", {
            branch,
            html,
            owner,
            path,
            repo
        });


    

        
    
    const fetching = dom.body.all(':not(page):not(pages)[data-fetch]');
    if (fetching.length > 0) {
        var f = 0;
        do {
            if (fetching[f].innerHTML === "") {
                fetching[f].innerHTML = await ajax(fetching[f].dataset.fetch);
            }
            f++;
        } while (fetching.length < 0);
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

    document.addEventListener("keyup", function(e) {
        if (e.key === "Escape") {
            if (window.parent.route.page === "/dashboard/*/build/preview/") {
                window.parent.dom.body.find('[data-href="/dashboard/:get/build/"]').click()
            }
        }
    });

    window.addEventListener("resize", window.on.resize)

    //DATABASE
    var cache = window.cache = {
        feed: {
            dashboard: {
                index: true
            }
        },
        repository: null
    };
    if (localStorage.githubAccessToken) {
        try {
            window.owner = await github.user.get();
        } catch (e) {}
    }

    
    console.log("...Initialized", {
        iframe: is.iframe(window)
    }, {
        boot
    });
}
