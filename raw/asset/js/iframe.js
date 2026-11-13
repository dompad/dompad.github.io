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

framework.builder.tap = function(target) {
    console.log(118, { target });
        var tagName = selected.tagName.toLowerCase();
        if(tagName === 'card') {
            var parent = selected.closest('block, header, footer');
            parent.setAttribute('focus', parent.tagName.toLowerCase());
            host.selected = parent;          
        }
        else if(tagName === 'box') {
            var parent = selected.closest('card');
            parent.setAttribute('focus', 'card');
            element.setAttribute('focus', 'card');
            host.selected = parent;
        }
}
framework.builder.create = async function(target) {
    var block = target.closest('block, header, footer');
    var host = block.find('.host');
    var shadow = host.shadowRoot;
    var element = shadow.lastElementChild;
    var selected = host.selected;
    console.log(122, { block, host, shadow, element, selected });

    if(selected) {
        var tagName = selected.tagName.toLowerCase();
        if(tagName === 'header') {
            var card = document.createElement('card');
            card.innerHTML = '<section></section>';
            element.find('section').insertAdjacentHTML('beforeEnd', card.outerHTML);
        }
        else if(tagName === 'card') {            
            var box = document.createElement('box');
            box.innerHTML = '<section></section>';
            selected.find('section').insertAdjacentHTML('beforeEnd', box.outerHTML);
        }
    }
}
framework.builder.delete = async function(target) {
    var block = target.closest('block, header, footer');
    var host = block.find('.host');
    var shadow = host.shadowRoot;
    var element = shadow.lastElementChild;
    var selected = host.selected;
    console.log(122, { block, host, shadow, element, selected });

    if(selected) {
        var tagName = selected.tagName.toLowerCase();
        if(['block', 'header', 'footer'].includes(tagName)) {
            var section = document.createElement('section');
            section.className = 'host';
            host.replaceWith(section);            
        }
        else if(tagName === 'card') {
            var parent = selected.closest('block, header, footer');
            parent.setAttribute('focus', parent.tagName.toLowerCase());
            host.selected = parent;
            selected.parentNode.children.length === 1 ? selected.parentNode.innerHTML = '' : selected.remove();          
        }
        else if(tagName === 'box') {
            var parent = selected.closest('card');
            parent.setAttribute('focus', 'card');
            element.setAttribute('focus', 'card');
            host.selected = parent;
            selected.parentNode.children.length === 1 ? selected.parentNode.innerHTML = '' : selected.remove(); 
        }
    }
}
framework.builder.update = function(target) {
    var block = target.closest('block, header, footer');
    var host = block.find('.host');
    var shadow = host.shadowRoot;
    var element = shadow.lastElementChild;
    var selected = host.selected;
    console.log(218, { block, host, shadow, element, selected });

    if(selected) {
        var iframe = window.parent.byId('iframe-editor');
        var pages = iframe.closest('pages');
        var tools = pages.nextElementSibling;
        var tagName = selected.tagName.toLowerCase();
        tools.selected = selected;
        $(tools.querySelector('blocks').children).attr('css-display', 'none');
        pages.setAttribute('css-dw800px-margin-top', '50vh');
        tools.setAttribute('css-dw800px-bottom', '50vh')
        if(['block', 'header', 'footer'].includes(tagName)) {
            var toolset = tools.querySelector("[data-mode='block']");
            toolset.removeAttribute('css-display');
        }
        else if(tagName === 'card') {
            var toolset = tools.querySelector("[data-mode='card']");
            toolset.removeAttribute('css-display');
        }
        else if(tagName === 'box') {
            var toolset = tools.querySelector("[data-mode='box']");
            toolset.removeAttribute('css-display');
        }        
    }
}

framework.tools = {};
framework.tools.path = function(target) {
    console.log(119, { target });
    var block = target.closest('block, header, footer');
    var host = block.find('.host');
    var shadow = host.shadowRoot;
    var element = shadow.lastElementChild;
    var selected = host.selected;
    console.log(122, { block, host, shadow, element, selected });

    if(selected) {
        var tagName = selected.tagName.toLowerCase();
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
    }
}

framework.on = async function(event) {
    //console.log(is.iframe, event);
    var touch = event.touch;
    if (touch === "tap") {
        if (is.iframe) {
            var target = event.target;
            var buildable = dom.body.getAttribute('buildable') === "true";
            var insertable = dom.body.getAttribute('insertable') === "true";
            var elem = target.closest('box, card, block, body > header, body > footer');
            var focused = elem && elem.getAttribute('focus');
            var tagName = elem && elem.tagName.toLowerCase();
            var el = elem && ["block", "card", "footer", "header"].includes(tagName) ? tagName : 'box';
            var element = dom.body.getAttribute('focus');
            var sel = element ? ':not(body)[focus="' + element + '"] ' + element + '' : null;
            var selected = sel ? event.target.closest(sel) : null;
            var focusing = sel && event.target.closest(sel) ? event.target.closest(sel).getAttribute('focus') : null;
            var mode = {
                edit: buildable && !insertable,
                plus: buildable && insertable,
                view: !buildable && !insertable
            }
            var node = target.closest('box > * > *, card, block, body > header, body > footer');
            var tool = window.top.byId('iframe-editor').parentNode.previousElementSibling;
            var toolset = tool.find('[tabindex="1"]');
            var toolbox = tool.find('[tabindex="2"]');
            var toolbar = tool.find('[tabindex="3"]');
            var elements = ["clip", "text", "picture", "video", "audio", "line", "embed", "embedded", "sound"];
            var nodeName = node && node.tagName.toLowerCase();
            0 < 1 ? console.log(150, {
                el,
                sel,
                selected,
                focusing
            }, {
                mode,
                buildable,
                insertable
            }) : null;

            //$(tool.all('header > *')).addClass('display-none');
            if (mode.edit) {
                var focus = target.closest('[focus]');
                var withh = elem !== event.target.closest(':not(block):not(body > header):not(body > footer)[focus]');
                //console.log({focus,withh}, {elem});
                if (withh) {

                    var focused = $('[focus]');
                    var inn = (elem && $('[focus]').length === 0) || (elem && ((focused && focused[focused.length - 1].contains(elem)) || (sel && focused && focused[focused.length - 1].parentNode.contains(elem) && !focusing && element === elem.tagName.toLowerCase())))

                    0 > 1 ? console.log(89, {
                        elem,
                        inn,
                        target: event.target.closest('[focus]'),
                        focuser: focused.length > 0 ? focused[focused.length - 1] : null,
                        contains: focused.length > 0 ? focused[focused.length - 1].contains(elem) : null,
                        focus,
                        focused
                    }) : null;

                    if (inn) {

                        $('[focus]').forEach(function(el) {
                            el === elem ? null : el.removeAttribute('focus');
                        });
                        $('box text[contenteditable]').forEach(function(el) {
                            el === elem ? null : el.removeAttribute('contenteditable');
                        });

                        var tool = window.top.dom.body.find('tool');

                        //FOCUS
                        $([dom.body]).attr('focus', el);
                        $([elem, elem.closest('block, footer, header')]).attr('focus', el);
                        if (['block', 'card', 'box'].includes(el)) {
                            var blur = `
                                <blur class="bottom-0 display-flex height-100pct left-0 position-absolute right-0 top-0 width-100pct">
                                    <div class="height-100vh position-absolute top-100pct width-100vw" css-background-color="rgba(0,0,0,0.5)"></div>
                                    <div class="height-100vh position-absolute width-100vw" css-background-color="rgba(0,0,0,0.5)"></div>
                                    <div class="height-100vh position-absolute width-100vw" css-background-color="rgba(0,0,0,0.5)"></div>
                                    <div class="bottom-100pct height-100vh position-absolute width-100vw" css-background-color="rgba(0,0,0,0.5)"></div>
                                </blur>
                            `;
                            //dom.body.insertAdjacentHTML('beforeend', blur);
                        }

                        if (focused === "true") {} else {
                            if (tagName === "box") {
                                $(elem.all('text')).attr('contenteditable', true);
                            }
                        }

                        var mode = "bar";

                        0 < 1 ? (0 > 1 ? console.log({
                            focused,
                            tagName,
                            tool,
                            icons: $(tool.all('ico')),
                            array: Array.prototype
                        }) : console.log({
                            focus: 'with',
                            el,
                            mode,
                            node,
                            nodeName
                        })) : null;
                        elem.node = elem;
                        window.top.toolbelt(mode, {
                            element: elem
                        });

                        //$(window.top.dom.body.find('tool').all('ico')).forEach(o=>o.classList.remove('display-none'));

                    }
                    else {

                        0 < 1 ? console.log({
                            focus: 'without'
                        }) : null;

                        $('[focus]').forEach(function(el) {
                            el.removeAttribute('focus');
                        });
                        $('box text[contenteditable]').forEach(function(el) {
                            el.removeAttribute('contenteditable');
                        });

                        //$(window.top.dom.body.find('tool').all('ico')).forEach(o=>o.find('.gg-add') ? null : o.classList.add('display-none'));

                        window.top.toolbelt('tip', {
                            element: node
                        });

                    }

                } 
                else {
                    var media = selected && selected.closest('[media]') ? selected.closest('[media]').getAttribute('media') : null;
                    0 < 1 ? console.log({
                        focus: 'within',
                        el,
                        selected
                    }, {
                        media,
                        node
                    }) : null;

                    if (el === "box") {
                        var cell = target.closest(el + ' > * > *');
                        if (cell) {
                            var cellName = cell.tagName.toLowerCase();
                            console.log(269, {
                                cell,
                                cellName
                            });
                            0 < 1 ? window.top.toolbelt('set', {
                                cell
                            }) : null;
                        } else {
                            console.log(285, {
                                target,
                                el,
                                sel,
                                selected,
                                focusing,
                                mode,
                                buildable,
                                insertable
                            });
                        }
                        if (0 > 1 && media) {
                            var id = selected.dataset.id;
                            if (id) {
                                0 > 1 ? window.top.toolbelt('bar', {
                                    element: node
                                }) : null;
                                console.log(id);
                                window.top.toolbelt('box', {
                                    element: node
                                });
                            } else {
                                var json = is.json(media) ? JSON.parse(media) : false;
                                if (json) {
                                    console.log('mixed', media);
                                    //window.top.toolbelt('set');
                                } else {
                                    //window.top.toolbelt('set');
                                    var confirm = 0 > 1 ? await window.top.modal.confirm({
                                        body: "Do you want to save your changes before creating a new item?",
                                        title: "Unsaved Changes"
                                    }, ["No", "Yes"]) : null;
                                    if (0 > 1 && confirm) {
                                        '/dashboard/:get/merch/catalog'.router();
                                    }
                                }
                                window.top.toolbelt('set', {
                                    el,
                                    sel,
                                    selected,
                                    focusing,
                                    mode,
                                    buildable,
                                    insertable
                                });
                                console.log(media, json);
                            }
                        } 
                        else if (0 > 1) {
                            console.log({
                                node
                            })
                            if (node) {
                                if (elements.includes(nodeName)) {
                                    window.top.toolbelt('box', {
                                        element: node
                                    });
                                } else {
                                    window.top.toolbelt('set', {
                                        el,
                                        sel,
                                        selected,
                                        focusing,
                                        mode,
                                        buildable,
                                        insertable
                                    });
                                }
                            } else {
                                window.top.toolbelt('set');
                            }
                        }
                    }
                }
            }
        }
    }
}

//ELEMENTS
window.elements = {};

window.elements.block = function(target) {
    console.log(target);
}

window.elements.card = function(target) {
    console.log(target);
}

window.elements.box = function(target) {
    console.log(target);
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
