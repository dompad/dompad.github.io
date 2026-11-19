window.framework = {};

framework.builder = {};
framework.builder.blocks = async function(target) {
    if (target) {
        var tagName = typeof target === "string" ? target : (target.closest('block, header, footer, main') || target.closest('empty').previousElementSibling.parentNode).tagName.toLowerCase();
        var html = await ajax('raw/asset/html/template/template.blocks.' + tagName + '.html')
        var ppp = await window.parent.modal.popup(html);
        console.log({
            target,
            html,
            ppp
        });
        ppp.selected = target.closest('empty').previousElementSibling;
        var components = ppp.all("section.component");
        console.log(66, {components});
        if(components.length > 0) {
            var c = 0;
            do {
                var component = components[c];
                tagName === 'main' ? tagName = 'block' : tagName;
                var block = await ajax('raw/asset/html/block/' + tagName + '/' + tagName + '.' + c + '.html');
                const shadow = component.attachShadow({mode: "open"});
                
                const reset = document.createElement("link");
                reset.setAttribute("rel", "stylesheet");
                reset.setAttribute("href", "/raw/asset/css/reset.css");
                
                const cssgg = document.createElement("link");
                cssgg.setAttribute("rel", "stylesheet");
                cssgg.setAttribute("href", "/raw/asset/css/gg.css");
                
                shadow.innerHTML = block;
                shadow.prepend(window.parent.framework.css.render(shadow));
                shadow.prepend(cssgg);
                shadow.prepend(reset);
                c++;
            } while(c < components.length);
        }
    }
}

framework.builder.create = async function(target) {
    var block = target.closest('block, header, footer');
    var host = block.find('.host');
    var shadow = host.shadowRoot;
    var element = shadow.lastElementChild;
    var selected = element.querySelector("[focus]") ? element.querySelector("[focus]") : element;
    console.log(122, { block, host, shadow, element, selected });

    if(selected) {
        var tagName = selected.tagName.toLowerCase();
        if(['block', 'footer', 'header'].includes(tagName)) {
            var card = document.createElement('card');
            card.innerHTML = '<section></section>';
            element.find('section').insertAdjacentHTML('beforeEnd', card.outerHTML);
        }
        else if(tagName === 'card') {            
            var box = document.createElement('box');
            box.innerHTML = '<section></section>';
            selected.find('section').insertAdjacentHTML('beforeEnd', box.outerHTML);
        }
        else if(tagName === 'box') {
            var html = await ajax('raw/asset/html/template/template.blocks.cells.html')
            var ppp = await window.parent.modal.popup(html);
            ppp.selected = selected;
            console.log({
                target,
                html,
                ppp
            });   
        }
    }
}
framework.builder.delete = async function(target) {
    var block = target.closest('block, header, footer');
    var host = block.find('.host');
    var shadow = host.shadowRoot;
    var element = shadow.lastElementChild;
    var selected = element.querySelector("[focus]") ? element.querySelector("[focus]") : element;
    console.log(122, { block, host, shadow, element, selected });

    if(selected) {
        var tagName = selected.tagName.toLowerCase();
        var focus = selected.getAttribute("focus");
        if(['block', 'header', 'footer'].includes(focus)) {
            var block = target.closest("block");
            if(block) {
                var before = block.previousElementSibling;
                var after = block.nextElementSibling;
                if(before || after) {
                    var sdw = before.find(".host[shadow='true']");
                    if(!sdw) {
                        if(after) {
                            before.remove();
                        }
                    }
                    block.remove();
                } 
            } else {
                var section = document.createElement('section');
                section.className = 'host';
                host.replaceWith(section);
            }  
        }
        else if(focus === 'card') {
            var parent = selected.closest('block, header, footer');
            parent.setAttribute('focus', parent.tagName.toLowerCase());
            host.selected = parent;
            selected.parentNode.children.length === 1 ? selected.parentNode.innerHTML = '' : selected.remove();          
        }
        else if(focus === 'box') {
            var parent = selected.closest('card');
            parent.setAttribute('focus', 'card');
            element.setAttribute('focus', 'card');
            host.selected = parent;
            selected.parentNode.children.length === 1 ? selected.parentNode.innerHTML = '' : selected.remove(); 
        }
        else if(focus === 'cell') {
            var parent = selected.closest('box');
            parent.setAttribute('focus', 'box');
            element.setAttribute('focus', 'box');
            host.selected = parent;
            selected.parentNode.children.length === 1 ? selected.parentNode.innerHTML = '' : selected.remove();    
        }
    }
}
framework.builder.update = async function(target) {
    var block = target.closest('block, header, footer');
    var host = block.find('.host');
    var shadow = host.shadowRoot;
    var element = shadow.lastElementChild;
    var selected = element.querySelector("[focus]") ? element.querySelector("[focus]") : element;
    console.log(218, { block, host, shadow, element, selected });

    if(selected) {
        var focus = selected.getAttribute("focus");
        var iframe = window.parent.byId('iframe-editor');
        var pages = iframe.closest('pages');
        var tools = pages.previousElementSibling;
        var tagName = selected.tagName.toLowerCase();
        tools.selected = selected;
        $(tools.querySelector('blocks').children).attr('css-display', 'none');
        tools.setAttribute('css-display', 'flex');
        tools.setAttribute('css-dw800px-height', 'calc(50vh - 10px)');
        if(['block', 'header', 'footer'].includes(tagName)) {
            var toolset = tools.querySelector("[data-mode='block']");
            toolset.removeAttribute('css-display');
            toolset.selected = selected;
        }
        else if(tagName === 'card') {
            var toolset = tools.querySelector("[data-mode='card']");
            toolset.removeAttribute('css-display');
            toolset.selected = selected;
        }
        else if(tagName === 'box') {
            var toolset = tools.querySelector("[data-mode='box']");
            toolset.removeAttribute('css-display');
            toolset.selected = selected;
        }        
        else if(tagName === 'href') {
            var toolset = tools.querySelector("[data-mode='href']");
            toolset.removeAttribute('css-display');
            toolset.selected = selected;
        }        
        else if(tagName === 'text') {
            var toolset = tools.querySelector("[data-mode='text']");
            toolset.removeAttribute('css-display');
            toolset.selected = selected;
        }             
        else if(tagName === 'ico') {
            var toolset = tools.querySelector("[data-mode='icon']");
            toolset.removeAttribute('css-display');
            toolset.selected = selected;
            var tpl = toolset.querySelector("#template-tools-icons");
            var wrap = tpl.previousElementSibling;
            if(wrap.children.length === 0) {
                var icons = JSON.parse(await ajax("/raw/asset/json/icons.json"));
                console.log(182, {icons});
                if(Object.keys(icons).length > 0) {
                    var i = 0;
                    do {
                        var values = Object.values(icons)[i][0];
                        var clone = tpl.content.firstElementChild.cloneNode(true);
                        clone.querySelector("ico").innerHTML = values.svg;
                        wrap.insertAdjacentHTML("beforeEnd", clone.outerHTML)
                        console.log(184, {values});
                        i++;
                    } while(i < 704)
                }
            }
        }                
        else if(tagName === 'feed') {
            var toolset = tools.querySelector("[data-mode='feed']");
            toolset.removeAttribute('css-display');
            toolset.selected = selected;
        }                
        else if(tagName === 'picture') {
            var toolset = tools.querySelector("[data-mode='picture']");
            toolset.removeAttribute('css-display');
            toolset.selected = selected;
        }        
    }
}

framework.tools = {};
framework.tools.oninput = function(event) {
    var target = event.target;
    if(target.textContent.trim().length === 0) {
        target.innerHTML = "";
    }
    console.log(1027, event, target); 
}
framework.tools.path = function(target) {
    var block = target.closest('block, header, footer');
    var host = block.find('.host');
    var shadow = host.shadowRoot;
    var element = shadow.lastElementChild;
    var selected = element.querySelector('[focus]') ? element.querySelector("[focus]") : element;
    console.log(122, { block, host, shadow, element, selected });

    if(selected) {
        var tagName = selected.tagName.toLowerCase();
        if(['block', 'header', 'footer'].includes(tagName)) {
            host.selected = null;
            host.removeAttribute('focus');
            selected.removeAttribute('focus');
        }
        if(tagName === 'card') {
            var parent = selected.closest('block, header, footer');
            parent.setAttribute('focus', parent.tagName.toLowerCase());
            host.selected = parent;
            selected.removeAttribute('focus');
        }
        else if(tagName === 'box') {
            var parent = selected.closest('card');
            parent.setAttribute('focus', 'card');
            element.setAttribute('focus', 'card');
            host.selected = parent;
            selected.removeAttribute('focus');
        }
        else if(["href", "ico", "picture", "text"].includes(tagName)) {
            var parent = selected.closest('box');
            parent.setAttribute('focus', 'box');
            element.setAttribute('focus', 'box');
            host.selected = parent;
            selected.removeAttribute('focus');
        }
        window.parent.framework.tools.close();
    }
}

//TOOL
window.tool = {}

window.tool.set = {};
window.tool.set.tab = function(target) {
    var iframe = byId('iframe-editor');
    var win = iframe.contentWindow;
    var doc = win.document;

    var ppp = target.closest('aside');

    var header = target.closest('header');
    $(header.children).addClass('border-bottom-1px-solid');

    var box = target.closest('box');
    box.classList.remove('border-bottom-1px-solid');

    var tabs = header.parentNode.all('column');
    var tab = $(tabs)[box.index()];

    $(tabs).attr('data-display', 'none')
    tab.removeAttribute('data-display');

    var element = box.find('text').dataset.before;
    var parent = ppp.focus.closest(element);
    var elem = ppp.focus.closest('box, card, block, body > header, body > footer');

    $(doc.body.all('[focus]')).forEach(function(el) {
        el.removeAttribute('focus');
    });
    $(doc.body.all('box text[contenteditable]')).forEach(function(el) {
        el.removeAttribute('contenteditable');
    });
    $([doc.body]).attr('focus', element);
    $([parent, elem.closest('block, footer, header')]).attr('focus', element);

    console.log(dom.body, $('[focus]'), $(dom.body.all('[focus]')), {
        tabs,
        tab
    }, {
        elem,
        focus: ppp.focus,
        parent
    });
}
