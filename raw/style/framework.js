window.framework = {};

framework.builder = {};
framework.builder.push = async function() {
    var GOT = window.route.GOT;
    var dir = GOT.splice(5, GOT.length - 1);
    var iframe = byId('iframe-editor');
    var doc = iframe.contentWindow.document;
    var body = doc.body;
    var header = doc.body.querySelector('body > header');

    if (header.find('.host[shadow="true"]')) {
        var hdr = header.find('.host[shadow="true"]').shadowRoot.lastElementChild.cloneNode(true);
        $(hdr.all('[contenteditable]')).removeAttr("contenteditable");
        $(hdr.all('[focus]')).removeAttr("focus");
        hdr.removeAttribute('focus');
    }
    var footer = doc.body.querySelector('body > footer');
    if (footer.find('.host[shadow="true"]')) {
        var ftr = footer.find('.host[shadow="true"]').shadowRoot.lastElementChild.cloneNode(true);
        $(ftr.all('[contenteditable]')).removeAttr("contenteditable");
        $(ftr.all('[focus]')).removeAttr("focus");
        ftr.removeAttribute('focus');
    }
    var shell = '';
    hdr ? shell += hdr.outerHTML + '\n' : null;
    shell += '<main></main>';
    ftr ? shell += '\n' + ftr.outerHTML : null;

    var hosts = doc.body.querySelectorAll('body page[data-active="true"] .host[shadow="true"]');
    var blocks = [];
    if (hosts.length > 0) {
        var h = 0;
        do {
            var host = hosts[h];
            var shadow = host.shadowRoot;
            var block = shadow.lastElementChild.cloneNode(true);
            $(block.all('[contenteditable]')).removeAttr("contenteditable");
            $(block.all('[focus]')).removeAttr("focus");
            block.removeAttribute('focus');
            blocks.push(block.outerHTML);
            h++;
        } while (h < hosts.length)
    }
    var page = blocks.join('\n');

    var hosts = doc.body.querySelectorAll('body page[data-active="true"] .host[shadow="true"]');
    var css1 = [];
    if (hosts.length > 0) {
        var h = 0;
        do {
            var host = hosts[h];
            var shadow = host.shadowRoot;
            var block = shadow.lastElementChild;
            css1.push(framework.css.render(shadow).innerHTML);
            h++;
        } while (h < hosts.length)
    }
    var stylesheetPage = sortCSS(css1.join('\n'));

    var hosts = doc.body.querySelectorAll('body > header .host[shadow="true"], body > footer .host[shadow="true"]');
    var css2 = [];
    if (hosts.length > 0) {
        var h = 0;
        do {
            var host = hosts[h];
            var shadow = host.shadowRoot;
            var block = shadow.lastElementChild;
            css2.push(framework.css.render(shadow).innerHTML);
            h++;
        } while (h < hosts.length)
    }
    var stylesheetShell = sortCSS(css2.join('\n'));
    console.log(7, 'framework.builder.push', {
        GOT,
        dir
    }, {
        body,
        header,
        footer
    }, {
        hdr,
        ftr,
        shell
    }, {
        hosts,
        blocks
    }, {
        css1,
        css2
    }, {
        stylesheetPage,
        stylesheetShell
    });
    function sortCSS(css) {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);

        const rules = [...sheet.cssRules];

        const regularRules = [];
        const mediaRules = [];

        // Extract and categorize rules
        rules.forEach(rule => {
            if (rule instanceof CSSMediaRule) {
                mediaRules.push(rule);
            } else {
                regularRules.push(rule);
            }
        }
        );

        // Sort regular rules alphabetically by selector
        regularRules.sort( (a, b) => {
            const selectorA = a.selectorText || "";
            const selectorB = b.selectorText || "";

            return selectorA.localeCompare(selectorB);
        }
        );

        // Extract min-width and sort descending
        mediaRules.sort( (a, b) => {
            const getWidth = rule => {
                const match = rule.conditionText.match(/min-width\s*:\s*(\d+(?:\.\d+)?)(px|em|rem)/);

                if (!match)
                    return 0;

                const value = parseFloat(match[1]);
                const unit = match[2];

                // Normalize widths for comparison
                return value * (unit === "px" ? 1 : unit === "em" ? 16 : unit === "rem" ? 16 : 1);
            }
            ;

            return getWidth(b) - getWidth(a);
        }
        );

        // Reconstruct stylesheet
        return [...regularRules.map(rule => rule.cssText), ...mediaRules.map(rule => rule.cssText)].join("\n\n");
    }

    //PUSH
    var title = dom.body.find('[placeholder="Page Name"]').textContent;
    var params = {
        message: 'Update "' + title + '" Page UI',
        repo: GOT[2],
        owner: GOT[1]
    };
    var array = [{
        content: shell,
        path: 'raw/style/template.html'
    }, {
        content: page,
        path: 'raw/pages/' + (dir.length > 0 ? dir.join('/') + '/' : '') + 'page.html'
    }, {
        content: stylesheetPage,
        path: 'raw/style/' + (dir.length > 0 ? dir.join('/') + '/' : '') + 'page.css'
    }, {
        content: stylesheetShell,
        path: 'style.css'
    }];
    try {
        console.log(2452, 'controller.builder.update', "array", {
            array,
            params
        });
        await github.crud.update(params, array);
        //("/dashboard/:get/build/preview/:dir").router();
    } catch (e) {
        modal.alert({
            body: "There was an error saving this page.",
            submit: "OK",
            title: "Push Error"
        })
    }
}

framework.css = {}
framework.css.render = (host) => {
    var elems = $(host.lastElementChild.all("*"));
    elems.push(host.lastElementChild)
    var rules = [];
    console.log(431, {
        elems
    });
    elems.forEach(elem => {
        console.log(elem);
        if (elem.attributes && elem.attributes.length > 0) {
            console.log(`Element: <${elem.tagName.toLowerCase()}>`);
            for (let i = 0; i < elem.attributes.length; i++) {
                const attr = elem.attributes[i];
                //console.log(147, attr);
                if (attr.name.startsWith('css-')) {
                    var parts = attr.name.split('-');
                    if (parts[1].startsWith('dw')) {
                        var width = parts[1].split('dw')[1];
                        var property = parts.splice(2, parts.length - 1).join('-');
                        var value = attr.value;
                        //css-dw960px-display="none"
                        var rule = "@media screen and (max-width: " + width + ") { [" + attr.name + `='` + value + `']` + " { " + property + ": " + value + " } }";
                        console.log(542, 'media screen', {
                            css: property + ' - ' + value,
                            kv: `${attr.name} = "${attr.value}"`,
                            rule: rule,
                            width: width
                        });
                        rules.push(rule);
                    } else {
                        var property = attr.name.replace("css-", "");
                        var value = attr.value;
                        var rule = "[" + attr.name + `='` + value + `']` + " { " + property + ": " + value + " }";
                        console.log(551, 'css rule', {
                            css: property + ' - ' + value,
                            kv: `${attr.name} = "${attr.value}"`,
                            rule: rule
                        });
                        rules.push(rule);
                    }
                }
            }
        }
    }
    );
    let unique = rules.filter( (item, index) => rules.indexOf(item) === index);
    unique.sort( (a, b) => {
        const startsWithPlaceA = a.startsWith("@media screen");
        const startsWithPlaceB = b.startsWith("@media screen");
        if (startsWithPlaceA && !startsWithPlaceB) {
            return 1;
        }
        if (!startsWithPlaceA && startsWithPlaceB) {
            return -1;
        }
        return a.localeCompare(b);
    }
    );
    const sorted = sortCssWithMediaQueriesLast(unique);
    var stylesheet = sorted.join("\n");
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = stylesheet;
    console.log(163, {
        rules,
        stylesheet,
        unique,
        sorted
    });
    return style
    function sortCssWithMediaQueriesLast(cssRules) {
        if (!Array.isArray(cssRules)) {
            throw new TypeError("Input must be an array of CSS rule strings.");
        }
    
        // Helper: Extract numeric width from media query string
        const extractWidth = (rule) => {
            if (typeof rule !== "string")
                return 0;
            const match = rule.match(/min-width\s*:\s*(\d+)px/i) || rule.match(/max-width\s*:\s*(\d+)px/i);
            return match ? parseInt(match[1], 10) : 0;
        }
        ;
    
        // Separate regular CSS rules and media queries
        const regularRules = [];
        const mediaQueries = [];
    
        cssRules.forEach(rule => {
            if (typeof rule !== "string")
                return;
            // skip invalid entries
            if (/^@media/i.test(rule.trim())) {
                mediaQueries.push(rule);
            } else {
                regularRules.push(rule);
            }
        }
        );
    
        // Sort media queries by descending width
        mediaQueries.sort( (a, b) => extractWidth(b) - extractWidth(a));
    
        // Combine: regular rules first, then sorted media queries
        return [...regularRules, ...mediaQueries];
    }
}

framework.tools = {}
framework.tools.close = function(target) {
    var pages = byId('iframe-editor').closest('pages');
    var tools = pages.previousElementSibling;
    pages.removeAttribute('css-dw800px-margin-top');
    tools.setAttribute('css-display', 'none');
    tools.setAttribute('css-dw800px-bottom', '100%');
}
framework.tools.elements = function(target) {
    var button = target.closest("[data-value]");
    if (button) {
        var value = button.dataset.value;
        var ppp = target.closest('aside');
        var selected = ppp.selected;
        console.log(591, {
            target,
            text,
            value,
            ppp,
            selected
        });
        if (value === 'link') {
            var href = document.createElement('href');
            selected.find('section').insertAdjacentHTML('beforeEnd', href.outerHTML);
            modal.exit(target);
        } else if (value === 'text') {
            var text = document.createElement('text')
            selected.find('section').insertAdjacentHTML('beforeEnd', text.outerHTML);
            modal.exit(target);
        } else if (value === 'icon') {
            var ico = document.createElement('ico');
            ico.innerHTML = '<n></n>';
            selected.find('section').insertAdjacentHTML('beforeEnd', ico.outerHTML);
            modal.exit(target);
        } else if (value === 'media') {
            var feed = document.createElement('feed');
            selected.find('section').insertAdjacentHTML('beforeEnd', feed.outerHTML);
            modal.exit(target);
        } else if (value === 'image') {
            var picture = document.createElement('picture');
            selected.find('section').insertAdjacentHTML('beforeEnd', picture.outerHTML);
            modal.exit(target);
        }
    }
}
framework.tools.page = function(target) {
    var pages = byId('iframe-editor').closest('pages');
    var tools = pages.previousElementSibling;
    pages.setAttribute('css-dw800px-margin-top', '50vh');
    tools.setAttribute('css-dw800px-bottom', '50vh');
}

window.tools = {};

tools.link = {};
tools.link.name = function(target) {
    var toolset = target.closest('[data-mode]');
    var selected = toolset.selected;
    console.log(342, 'tools.link.name', {target, toolset, selected});
    selected.textContent = target.value;
}
tools.link.href = function(target) {
    var toolset = target.closest('[data-mode]');
    var selected = toolset.selected;
    console.log(352, 'tools.link.href', {target, toolset, selected});
    selected.dataset.href = target.value;  
}
tools.link.color = function(target) {
    var toolset = target.closest('[data-mode]');
    var selected = toolset.selected;
    var host = selected.getRootNode();
    selected.setAttribute("css-color", target.value);
    var style = framework.css.render(host);
    var sheet = host.lastElementChild.previousElementSibling;
    console.log(352, 'tools.link.color', {target, toolset, selected, host, style, sheet});
    sheet.replaceWith(style);
}
tools.link.fontFamily = function(target) {
    
}
tools.link.fontSize = function(target) {
    
}
tools.link.fontWeight = function(target) {
    
}
tools.link.margin = function(target) {
    
}
tools.link.padding = function(target) {
    
}


framework.branding = {};
framework.branding.appName = event => {
    var target = event.target;
    var value = target.value;
    var card = target.closest('card');
    var names = card.all('[data-value="app-name"]');
    $(names).html(value);
}
framework.branding.backgroundColor = event => {
    var target = event.target;
    var value = target.value;
    var card = target.closest('card');
    var themes = card.all('[data-background-color]');
    themes.forEach(function(theme) {
        var ground = theme.dataset.backgroundColor;
        var isHex = is.hex(value);
        if (ground === "foreground") {
            var color = theme.getAttribute('css-color');
            if (!color) {
                color = theme.getAttribute('disabled-css-color');
            }
        }
        if (ground === "background") {
            var bg = theme.getAttribute('css-background-color');
            if (!bg) {
                bg = theme.getAttribute('disabled-css-background-color');
            }
        }
        if (value.length === 0) {
            if (ground === "foreground") {
                theme.setAttribute('disabled-css-color', color);
                theme.removeAttribute('css-color');
            }
            if (ground === "background") {
                theme.setAttribute('disabled-css-background-color', bg);
                theme.removeAttribute('css-background-color');
            }
        }
        if (ground === "background") {
            if (value.length > 0) {
                if (isHex) {
                    theme.style.backgroundColor = value;
                    theme.setAttribute('fill', value);
                    $(theme.all('svg [fill]')).attr('fill', value);
                }
            } else {
                theme.style.backgroundColor = bg;
                theme.setAttribute('fill', bg);
                $(theme.all('svg [fill]')).attr('fill', bg);
            }
        }
        if (ground === "foreground") {
            0 > 1 ? console.log('color', {
                value,
                color
            }) : null;
            if (value.length > 0) {
                if (isHex) {
                    $(theme.all('svg [fill]')).attr('fill', value);
                }
            } else {
                $(theme.all('svg [fill]')).attr('fill', color);
            }
            0 > 1 ? console.log('color', {
                color
            }) : null;
        }
    });
}
framework.branding.borderRadius = event => {
    var target = event.target;
    var value = target.value;
    var svg = target.closest('card').find('svg');
    var rect = svg.find('rect');
    var icon = svg.find('svg');

    var vb = svg.getAttribute('viewBox').split(' ');
    var w = vb[vb.length - 2];
    var h = vb[vb.length - 1];

    var row = target.closest('row');
    var rx = row.find('[name="browser-borderRadius"]').value;
    $(target.closest('card').all('rect')).attr('rx', rx + "px");
}
framework.branding.dedicatedPicture = async function(event) {
    var target = event.target;
    var row = target.closest('column').nextElementSibling.lastElementChild;
    var svg = row.find('svg');
    var file = await on.change.file(event);
    ImageTracer.imageToSVG(file.result, (svgstr) => {
        svg.find('foreignObject').innerHTML = svgstr;
        row.removeAttribute('css-display');
    }
    , {
        viewbox: true
    });
}
framework.branding.display = (event) => {
    var target = event.target;
    var value = target.value;
    var row = target.closest('row');

    if (value === 'browser') {
        $(target.closest('card').find('[value="custom"]').closest('row').all('input:not([type="radio"])')).attr('disabled', true);
    }
    if (value === 'standalone') {
        $(row.all('input:not([type="radio"])')).removeAttr('disabled');
    }
}
framework.branding.generate = async function(target) {
    var form = target.closest('form');
    var cards = form.all('card');

    var zip = {};
    var head = [];

    var icon = cards[0];
    var iconSVG = icon.find('card > flex > box svg');
    zip["icon.svg"] = iconSVG.outerHTML;

    var desktop = cards[1];
    var faviconICO = desktop.find('card > column > flex > box svg');
    zip["favicon.svg"] = faviconICO.outerHTML;
    zip["favicon-32x32.png"] = await convert(faviconICO, {
        mimeType: "image/png",
        size: {
            height: 32,
            width: 32
        }
    });
    zip["favicon-16x16.png"] = await convert(faviconICO, {
        mimeType: "image/png",
        size: {
            height: 16,
            width: 16
        }
    });
    zip["favicon.ico"] = await convert(faviconICO, {
        mimeType: "image/x-icon",
        size: {
            height: 16,
            width: 16
        }
    });

    var ios = cards[2];
    var appleTouchIconPNG = ios.find('card > column > flex > box svg');
    zip["apple-touch-icon.svg"] = appleTouchIconPNG.outerHTML;
    zip["apple-touch-icon.png"] = await convert(appleTouchIconPNG, {
        mimeType: "image/png"
    });

    var chrome = cards[3];
    var androidChromePNG = chrome.find('card > column > flex > box svg');
    zip["android-chrome.svg"] = androidChromePNG.outerHTML;
    zip["android-chrome-192x192.png"] = await convert(androidChromePNG, {
        mimeType: "image/png",
        size: {
            height: 192,
            width: 192
        }
    });
    zip["android-chrome-512x512.png"] = await convert(androidChromePNG, {
        mimeType: "image/png",
        size: {
            height: 512,
            width: 512
        }
    });

    var metro = cards[4];
    var xml = await ajax('raw/asset/xml/browserconfig.xml');
    var browserconfigXML = new DOMParser().parseFromString(xml, 'text/xml');
    var color = metro.find('card > column > flex > box svg rect').getAttribute('fill');
    browserconfigXML.getElementsByTagName("TileColor")[0].textContent = color;
    zip["browserconfig.xml"] = new XMLSerializer().serializeToString(browserconfigXML);
    var mstile150x150PNG = metro.find('card > column > flex > box svg').cloneNode(true);
    var TileColor = mstile150x150PNG.find('rect').getAttribute('fill')
    zip["mstile.svg"] = mstile150x150PNG.outerHTML;
    mstile150x150PNG.find('rect').remove();
    zip["mstile-150x150.png"] = await convert(mstile150x150PNG, {
        mimeType: "image/png",
        size: {
            height: 150,
            width: 150
        }
    });

    var safari = cards[5];
    //if (safari.find('[name="radio-macOSSafari"][value="default"]').checked) {
    var safariPinnedTabSVG = safari.all('box > column > picture')[0].find('picture > svg:not([css-display])');
    var safariPinnedTabFocusSVG = safari.all('box > column > picture')[1].find('picture > svg:not([css-display])');
    var safariPinnedTabTouchBarSVG = safari.all('box > column > picture')[2].find('picture > svg:not([css-display])');
    var safariPinnedTabColor = safariPinnedTabTouchBarSVG.find('rect').getAttribute('fill');
    zip["safari-pinned-tab.svg"] = safariPinnedTabSVG.outerHTML;
    zip["safari-pinned-tab-focus.svg"] = safariPinnedTabFocusSVG.outerHTML;
    zip["safari-pinned-tab-touch-bar.svg"] = safariPinnedTabTouchBarSVG.outerHTML;
    //}

    var siteWEBMANIFEST = await github.repos.contents({
        owner: GET[1],
        path: '/site.webmanifest',
        repo: GET[2]
    }, {
        accept: 'application/vnd.github.raw'
    });
    var color = chrome.all('card > column > flex > box')[1].find('[name="android-chrome-themeColor"]').value;
    var display = chrome.all('card > column > flex > box')[1].find('[name="radio-androidChrome-options"]:checked').value;
    var orientation = chrome.all('card > column > flex > box')[1].find('[name="radio-androidChrome-orientation"]:checked').value;
    var start_url = chrome.all('card > column > flex > box')[1].find('[name="text-androidChrome-startUrl"]').value;
    //console.log({siteWEBMANIFEST, display, color});
    siteWEBMANIFEST.icons = [{
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
    }, {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
    }];
    siteWEBMANIFEST.background_color = color,
    siteWEBMANIFEST.theme_color = color;
    siteWEBMANIFEST.display = display;
    orientation ? siteWEBMANIFEST.orientation = orientation : null;
    start_url.length > 0 ? siteWEBMANIFEST.start_url = start_url : null;
    zip["site.webmanifest"] = JSON.stringify(siteWEBMANIFEST, null, 4);

    var appleTouchIconLINK = document.createElement('link');
    appleTouchIconLINK.setAttribute('rel', 'apple-touch-icon');
    appleTouchIconLINK.setAttribute('sizes', '180x180');
    appleTouchIconLINK.setAttribute('href', '/apple-touch-icon.png');
    var favicon32x32LINK = document.createElement('link');
    favicon32x32LINK.setAttribute('rel', 'icon');
    favicon32x32LINK.setAttribute('type', 'image/png');
    favicon32x32LINK.setAttribute('sizes', '32x32');
    favicon32x32LINK.setAttribute('href', '/favicon-32x32.png');
    var favicon16x16LINK = document.createElement('link');
    favicon16x16LINK.setAttribute('rel', 'icon');
    favicon16x16LINK.setAttribute('type', 'image/png');
    favicon16x16LINK.setAttribute('sizes', '16x16');
    favicon16x16LINK.setAttribute('href', '/favicon-16x16.png');
    var manifestLINK = document.createElement('link');
    manifestLINK.setAttribute('rel', 'manifest');
    manifestLINK.setAttribute('href', '/site.webmanifest');
    var safariPinnedTabLINK = document.createElement('link');
    safariPinnedTabLINK.setAttribute('rel', 'mask-icon');
    safariPinnedTabLINK.setAttribute('href', '/safari-pinned-tab.svg');
    safariPinnedTabLINK.setAttribute('color', safariPinnedTabColor);
    var msApplicationTileColorMETA = document.createElement('meta');
    msApplicationTileColorMETA.setAttribute('name', 'msapplication-TileColor');
    msApplicationTileColorMETA.setAttribute('content', TileColor);
    var themeColorMETA = document.createElement('meta');
    themeColorMETA.setAttribute('name', 'theme-color');
    themeColorMETA.setAttribute('content', color);
    var content = await github.repos.contents({
        owner: GET[1],
        path: '/index.html',
        repo: GET[2]
    }, {
        accept: 'application/vnd.github.raw'
    });
    var html = new DOMParser().parseFromString(content, 'text/html').documentElement;
    var head = html.find('head');
    0 > 1 ? console.log(245, {
        zip,
        html,
        head: head.outerHTML
    }) : null;
    html.find('head').find('link[href="/apple-touch-icon.png"]') ? html.find('head').find('link[href="/apple-touch-icon.png"]').replaceWith(appleTouchIconLINK) : html.find('head').appendChild(appleTouchIconLINK);
    html.find('head').find('link[href="/favicon-32x32.png"]') ? html.find('head').find('link[href="/favicon-32x32.png"]').replaceWith(favicon32x32LINK) : html.find('head').appendChild(favicon32x32LINK);
    html.find('head').find('link[href="/favicon-16x16.png"]') ? html.find('head').find('link[href="/favicon-16x16.png"]').replaceWith(favicon16x16LINK) : html.find('head').appendChild(favicon16x16LINK);
    html.find('head').find('link[href="/site.webmanifest"]') ? html.find('head').find('link[href="/site.webmanifest"]').replaceWith(manifestLINK) : html.find('head').appendChild(manifestLINK);
    html.find('head').find('link[href="/safari-pinned-tab.svg"]') ? html.find('head').find('link[href="/safari-pinned-tab.svg"]').replaceWith(safariPinnedTabLINK) : html.find('head').appendChild(safariPinnedTabLINK);
    html.find('head').find('meta[name="msapplication-TileColor"]') ? html.find('head').find('meta[name="msapplication-TileColor"]').replaceWith(msApplicationTileColorMETA) : html.find('head').appendChild(msApplicationTileColorMETA);
    html.find('head').find('meta[name="theme-color"]') ? html.find('head').find('meta[name="theme-color"]').replaceWith(themeColorMETA) : html.find('head').appendChild(themeColorMETA);
    0 > 1 ? console.log(245, {
        zip,
        head: html.outerHTML
    }) : null;
    zip["index.html"] = html.outerHTML;

    //PUSH
    var params = {
        message: "Generate Favicons",
        repo: GET[2],
        owner: GET[1]
    };
    var array = [];
    Object.values(zip).forEach(function(content, index) {
        var path = Object.keys(zip)[index];
        var file = {
            path
        };
        if (content.startsWith('data:')) {
            file.content = content.split(';base64,')[1];
            file.type = "base64";
        } else {
            file.content = content;
        }
        array.push(file);
    });
    console.log(2452, 'controller.posts.update', "array", {
        array
    });
    try {
        await github.crud.update(params, array);
    } catch (e) {
        console.log(e);
        alert('There was an error generating favicons.');
    }
}
framework.branding.icon = function(event) {
    var target = event.target;
    var row = target.closest('row');
    var svg = row.find('svg');
    var icon = svg.find('foreignObject svg');
    var foreignObjects = target.closest('box').previousElementSibling.all('picture > svg:first-child foreignObject');
    $(foreignObjects).html(icon.outerHTML)
}
framework.branding.imageSize = event => {
    var target = event.target;
    var value = target.value;
    var svg = target.closest('card').find('svg');

    var vb = svg.getAttribute('viewBox').split(' ');
    var w = vb[vb.length - 2];
    var h = vb[vb.length - 1];

    var row = target.closest('row');
    var hw = value;
    var x = (w - hw) / 2;
    var y = (h - hw) / 2;
    $(target.closest('card').all('foreignObject, svg')).attr('height', hw + "px").attr('width', hw + "px")
    $(target.closest('card').all('foreignObject')).attr('x', x).attr('y', y);
}
framework.branding.themeColor = event => {
    var target = event.target;
    var value = target.value;
    var card = target.closest('card');
    var themes = card.all('[data-theme-color]');
    themes.forEach(function(theme) {
        var ground = theme.dataset.themeColor;
        var isHex = is.hex(value);
        if (ground === "foreground") {
            var color = theme.getAttribute('css-color');
            if (!color) {
                color = theme.getAttribute('disabled-css-color');
            }
        }
        if (ground === "background") {
            var bg = theme.getAttribute('css-background-color');
            if (!bg) {
                bg = theme.getAttribute('disabled-css-background-color');
            }
        }
        if (value.length === 0) {
            if (ground === "foreground") {
                theme.setAttribute('disabled-css-color', color);
                theme.removeAttribute('css-color');
            }
            if (ground === "background") {
                theme.setAttribute('disabled-css-background-color', bg);
                theme.removeAttribute('css-background-color');
            }
        }
        if (ground === "background") {
            if (value.length > 0) {
                if (isHex) {
                    theme.style.backgroundColor = value;
                    theme.setAttribute('fill', value);
                    theme.style.color = colors.contrast(value)
                }
            } else {
                theme.style.backgroundColor = bg;
                theme.setAttribute('fill', bg);
                theme.style.color = colors.contrast(bg)
            }
        }
        if (ground === "foreground") {
            console.log('color', {
                value,
                color
            });
            if (value.length > 0) {
                if (isHex) {
                    $(theme.all('svg [fill]')).attr('fill', value);
                }
            } else {
                $(theme.all('svg [fill]')).attr('fill', color);
            }
            console.log('color', {
                color
            });
        }
    });
}
framework.branding.marginSize = event => {
    var target = event.target;
    var value = target.value;
    var svg = target.closest('card').find('svg');
    var rect = svg.find('rect');
    var icon = svg.find('svg');

    var vb = svg.getAttribute('viewBox').split(' ');
    var w = vb[vb.length - 2];
    var h = vb[vb.length - 1];
    var row = target.closest('row');

    var ms = w - (value);
    var hw = (w - ms) / 2;
    var x = hw;
    var y = hw;
    //var fill = row.parentElement.nextElementSibling.find('[type="text"]').value;

    //$(target.closest('card').find('[name="radio-androidChrome"][value="custom"]').closest('row').all('input:not([type="radio"])')).removeAttr('disabled')
    //$(target.closest('card').all('rect')).attr('fill', fill)
    $(target.closest('card').all('foreignObject, svg')).attr('height', ms + "px").attr('width', ms + "px")
    $(target.closest('card').all('foreignObject')).attr('x', x).attr('y', y);
}
