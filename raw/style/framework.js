window.framework = {};

framework.builder = {};
framework.builder.block = async function(target) {
    var box = target.closest('box');
    if (box) {
        var index = box.index() + 1;
        var tagName = target.closest('card').dataset.element;
        var html = await ajax('raw/asset/html/block/' + tagName + '/' + tagName + '.' + index + '.html')
        //window.parent.modal.popup(html);
        var element = dom.body.find(tagName);
        var block = framework.builder.focus();
        if (element) {
            element.insertAdjacentHTML('beforeend', html);
            modal.exit(target)
        }
        console.log({
            element,
            target,
            block,
            html
        }, 'raw/asset/html/block/' + tagName + '/' + tagName + '.' + index + '.html');
    }
}
framework.builder.blocks = async function(target) {
    if (target) {
        var tagName = typeof target === "string" ? target : (target.closest('block, main') || target.closest('empty').previousElementSibling).tagName.toLowerCase();
        var html = await ajax('raw/asset/html/template/template.blocks.' + tagName + '.html')
        var ppp = await window.parent.modal.popup(html);
        console.log(27, {
            tagName,
            target
        }, typeof target);
        ppp.find('card').lastElementChild.onclick = async(event)=>{
            //framework.builder.block(event.target);
            var box = event.target.closest('box');
            if (box) {
                var index = box.index() + 1;
                var element = target.closest('empty').previousElementSibling;
                var tagName = event.target.closest('[data-element]').dataset.element;
                tagName = tagName === 'main' ? 'block' : tagName;
                var asset = 'raw/asset/html/block/' + tagName + '/' + tagName + '.' + index + '.html';
                var html = await ajax(asset)
                //window.parent.modal.popup(html);
                //var element = dom.body.find(tagName);
                var block = framework.builder.focus();
                if (element) {
                    element.insertAdjacentHTML('beforeend', html);
                    modal.exit(event.target)
                }
                console.log({
                    asset,
                    element,
                    target,
                    block,
                    html
                }, 'raw/asset/html/block/' + tagName + '/' + tagName + '.' + index + '.html');
            }
        }
        console.log({
            target,
            html,
            ppp
        });
    }
}
framework.builder.focus = ()=>{
    var focused = dom.body.all('[focus="true"]');
    return focused[focused.length - 1];
}
framework.builder.select = ()=>{
    $('focus').remove();
    var elem = dom.body.find('[focus]')
    var selection = window.parent.byId('focus-element').content.firstElementChild.cloneNode(true);
    var rect = elem.getBoundingClientRect();
    selection.style.height = elem.clientHeight + "px";
    selection.style.width = elem.clientWidth + "px";
    //selection.style.backgroundColor = "rgba(0,0,0,0.5)";
    selection.style.left = (rect.left + document.documentElement.scrollLeft) + "px";
    selection.style.top = (rect.top + document.documentElement.scrollTop) + "px";
    selection.style.zIndex = "1234568799";
    doc.body.insertAdjacentHTML('beforeend', selection.outerHTML);
}
framework.builder.insert = function(target) {
    var iframe = byId('iframe-editor');
    var win = iframe.contentWindow;
    var doc = win.document;
    var blocks = $(doc.body.all('blocks block'));
    //blocks.attr('data-transform', 'scale(calc(1/3))');
    var element = target.closest('[data-element]').dataset.element;
    console.log({
        blocks,
        element,
        target
    });
    if (element === 'main') {
        if (target.closest('[data-tap]').tagName.toLowerCase() === 'text') {
            var el = document.createElement('block');
            el.innerHTML = '<flex></flex>';

            var page = doc.body.find('[data-active="true"][data-page]');
            page.find('blocks').insertAdjacentHTML('beforeend', el.outerHTML);

            var block = page.find('blocks').lastElementChild;
            $(doc.body.all('[focus]')).removeAttr('focus');
            block.setAttribute('focus', 'block');
            doc.body.setAttribute('focus', 'block');

            var rect = block.getBoundingClientRect();
            console.log(doc, doc.body.all('[focus]'), block, block.scrollTop, win.scrollTop, rect);
            win.scrollTo({
                behavior: 'smooth',
                left: 0,
                top: rect.top + doc.documentElement.scrollTop
            });

            modal.exit(target);
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
            var focused = elem.getAttribute('focus');
            var tagName = elem.tagName.toLowerCase();
            var el = ["block", "card", "footer", "header"].includes(tagName) ? tagName : 'box';
            var element = dom.body.getAttribute('focus');
            var sel = element ? ':not(body)[focus="' + element + '"] ' + element + '' : null;
            var selected = sel ? event.target.closest(sel) : null;
            var focusing = sel && event.target.closest(sel) ? event.target.closest(sel).getAttribute('focus') : null;
            console.log({
                sel,
                selected,
                focusing
            });
            if (buildable && !insertable) {
                var focus = target.closest('focus');
                if (elem !== event.target.closest(':not(block):not(body > header):not(body > footer)[focus]')) {

                    var focused = $('[focus]');

                    console.log(89, {
                        elem,
                        target: event.target.closest('[focus]'),
                        focuser: focused.length > 0 ? focused[focused.length - 1] : null,
                        contains: focused.length > 0 ? focused[focused.length - 1].contains(elem) : null,
                        focus,
                        focused
                    });

                    if ((elem && $('[focus]').length === 0) || (elem && ((focused && focused[focused.length - 1].contains(elem)) || (sel && focused && focused[focused.length - 1].parentNode.contains(elem) && !focusing && element === elem.tagName.toLowerCase())))) {

                        $('[focus]').forEach(function(el) {
                            el === elem ? null : el.removeAttribute('focus');
                        });
                        $('box text[contenteditable]').forEach(function(el) {
                            el === elem ? null : el.removeAttribute('contenteditable');
                        });

                        var tool = window.top.dom.body.find('tool');

                        $([dom.body]).attr('focus', el);
                        $([elem, elem.closest('block, footer, header')]).attr('focus', el);

                        if (focused === "true") {
                            if (tagName === "picture") {}
                            if (tagName === "text") {//elem.contentEditable = "true";
                            }
                        } else {
                            if (tagName === "picture") {}
                            if (tagName === "text") {
                                elem.contentEditable = "true";
                            }
                        }

                        console.log({
                            focused,
                            tagName,
                            tool,
                            icons: $(tool.all('ico')),
                            array: Array.prototype
                        });

                        $(window.top.dom.body.find('tool').all('ico')).forEach(o=>o.classList.remove('display-none'));

                    } else {

                        console.log($('[focus]'));

                        $('[focus]').forEach(function(el) {
                            el.removeAttribute('focus');
                        });
                        $('box text[contenteditable]').forEach(function(el) {
                            el.removeAttribute('contenteditable');
                        });

                        $(window.top.dom.body.find('tool').all('ico')).forEach(o=>o.find('.gg-add') ? null : o.classList.add('display-none'));

                    }

                } else {

                    if (el === "box") {
                        var media = selected.closest('[media]') ? selected.closest('[media]').getAttribute('media') : null;
                        var id = selected.dataset.id;
                        if (media && !id) {
                            var json = is.json(media) ? JSON.parse(media) : false;
                            if (json) {
                                console.log('mixed', media);
                            } else {
                                var confirm = await window.top.modal.confirm({
                                    body: "Do you want to save your changes before creating a new item?",
                                    title: "Unsaved Changes"
                                }, ["No", "Yes"]);
                                if (confirm) {
                                    '/dashboard/:get/merch/catalog'.router();
                                }
                            }
                            console.log(media, json);
                        }
                    }
                }
            }
        }
    }
}

window.tool = {}

window.tool.set = {};
window.tool.set.tab = function(target) {
    var iframe = byId('iframe-editor');
    var win = iframe.contentWindow;
    var doc = win.document;

    var ppp = target.closest('aside');

    var header = target.closest('card > header');
    $(header.children).addClass('border-bottom-1px-solid');

    var box = target.closest('box');
    box.classList.remove('border-bottom-1px-solid');

    var tabs = header.parentNode.all('card > column');
    var tab = $(tabs)[box.index()];
    console.log(tabs);

    $(tabs).attr('css-display', 'none')
    tab.removeAttribute('css-display');

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

/*TOOL API*/
window.tool.tip = {};

window.tool.bar = {};

window.tool.box = {};
window.tool.box.columns = function(event) {
    var target = event.target;
    var value = target.value;
    console.log(268, value);
}
window.tool.box.css = function(tab) {

    var ppp = tab.closest('aside');

    var iframe = byId('iframe-editor');
    var doc = iframe.contentWindow.document;
    var element = doc.body.getAttribute('focus');

    var declarations = $(tab.all('[data-declaration]'));
    if (declarations.length > 0) {
        var rules = {};
        var classList = Array.from(ppp.focus.classList).concat(Array.from(ppp.focus.find('flex, column, row, section').classList));
        var attrs = {};
        var a1 = Object.assign({}, ppp.focus.attributes);
        var a2 = Object.assign({}, ppp.focus.find('flex, column, row, section').attributes);
        var a3 = Object.assign(a1, a2);
        for (const [i,a] of Object.entries(a3)) {
            //console.log(329, a.name, a.value);
            var key = a.name;
            var value = a.value;
            if (key.startsWith('css')) {
                var camel = [];
                var split = key.rfo('css-').split('-');
                split.forEach(function(s) {
                    if (s.startsWith('dw') || s.startsWith('_')) {
                        //split;
                        camel.push(s);
                    } else {
                        camel.push(s);
                    }
                });
                key = camel.join('-').camelPhynate();
                attrs[key] = value;
            } else if (key.startsWith('class')) {
                value.split(' ').forEach(function(c) {
                    var split = c.split('-');
                    var value = split.splice(split.length - 1)[0];
                    var properties = [];
                    split.forEach(function(s) {
                        if (s.startsWith('dw') || s.startsWith('_')) {
                            split;
                        } else {
                            properties.push(s);
                        }
                    });
                    var property = properties.join('-');
                    rules[property] = value;
                    0 > 1 ? console.log(731, {
                        c,
                        split,
                        property,
                        value
                    }) : null;
                    attrs[property] = value;
                });
            } else {
                attrs[key] = value;
            }
            //key.startsWith('css-') ? attrs[key] = value : null;
        }
        var rules = attrs;
        0 < 1 ? console.log(718, {
            a1,
            a2,
            a3,
            rules,
        }) : null;
        declarations.forEach(function(el) {
            var declaration = el.dataset.declaration;
            var row = el.closest('[data-property]');
            if (0 < 1 && row) {
                0 > 1 ? console.log(385, {
                    declaration,
                    row
                }) : null;
                var property = row.dataset.property;
                var number = el.find('[data-value="array"], [data-value="value"], [data-value="number"]');
                if (number) {
                    var type = number.dataset.value;
                    0 > 1 ? console.log(349, {
                        el,
                        row,
                        property,
                        el,
                        number,
                        type
                    }) : null;
                    if (number && number.classList.contains('display-none')) {
                        var value = number.getAttribute('value');
                        var formula = el.find('[data-formula]');
                        var unit = el.find('[data-value="number"], [data-value="unit"],  [data-value="value"]');
                        if (unit) {
                            value = unit.textContent;
                        }
                        var selector = "block";
                        var cssRule = selector + " {" + property + ": " + value + "}";
                        var tab = el.closest('box').all('box > [data-tab="' + value + '"]');
                        //console.log(tab, el.closest('box'));
                        if (tab.length > 0) {
                            console.log(tab, value);
                            $(el.closest('box').all('box > [data-tab]')).removeClass('display-none');
                            tab.classList.add('display-none')
                        }
                        //console.log(350, cssRule);
                        Object.entries(rules).forEach(function(rule) {
                            var k = rule[0];
                            var v = rule[1];
                            0 > 1 ? console.log(374, property, {
                                number,
                                value,
                                unit
                            }, {
                                k,
                                v
                            }) : null;
                            if (property === k) {
                                var value = v.cssValue();
                                0 < 1 ? console.log({
                                    k,
                                    unit,
                                    value,
                                    v
                                }) : null;
                                var tabs = el.closest('box');
                                //console.log(384, tabs);
                                if (tabs.length > 0) {}
                                if (value.number) {
                                    if (value.unit) {
                                        number.classList.remove('display-none')
                                        number && value.number ? number.value = value.number : null;
                                        unit && value.unit ? unit.textContent = value.unit : null;
                                    } else {
                                        unit.getAttribute('type') === "number" ? unit.value = value.number : unit.textContent = value.number;
                                    }
                                } else {
                                    unit && value.number ? unit.textContent = value.number : null;
                                    number ? number.classList.add('display-none') : null;
                                }
                                0 < 1 ? console.log(398, cssRule, {
                                    unit,
                                    number,
                                    rule,
                                    k,
                                    v
                                }) : null;
                            }
                        });
                    } else if (number && !number.classList.contains('display-none')) {
                        var value = number.getAttribute('value');
                        var formula = el.find('[data-formula]');
                        var unit = el.find('[data-value="number"], [data-value="unit"],  [data-value="value"]');
                        if (unit) {
                            value = value + unit.textContent;
                        }
                        var selector = "block";
                        var cssRule = selector + " {" + property + ": " + value + "}";

                        Object.entries(rules).forEach(function(rule) {
                            var k = rule[0];
                            var v = rule[1];
                            0 > 1 ? console.log(property, {
                                number,
                                value,
                                unit
                            }, {
                                k,
                                v
                            }) : null;
                            if (property === k) {
                                var value = v.cssValue();
                                0 > 1 ? console.log(421, tab, {
                                    k,
                                    number,
                                    unit,
                                    value,
                                    v
                                }) : null;
                                if (value.number) {
                                    if (value.unit) {
                                        number.classList.remove('display-none')
                                        number && value.number ? number.value = value.number : null;
                                        unit && value.unit ? unit.textContent = value.unit : null;
                                    } else {
                                        //console.log(429, unit, value, number.getAttribute('value'), value.number);
                                        if (formula) {
                                            var num = value.number;
                                            unit.getAttribute('type') === "number" ? unit.setAttribute('value', num) : unit.textContent = num;
                                        } else {
                                            unit.getAttribute('type') === "number" ? unit.value = value.number : unit.textContent = value.number;
                                        }
                                    }
                                } else {
                                    unit && value.number ? unit.textContent = value.number : null;
                                    number ? number.classList.add('display-none') : null;
                                }
                                0 > 1 ? console.log(cssRule, {
                                    unit,
                                    number,
                                    rule,
                                    k,
                                    v
                                }) : null;
                                var tab = unit ? el.closest('box').all('column[data-tab="' + unit.textContent + '"]') : null;
                                //console.log(cssRule, tab, el.closest('box'), value);
                                if (tab && tab.length > 0) {
                                    //console.log(tab, value);
                                    $(el.closest('box').all('box > [data-tab]')).addClass('display-none');
                                    $(tab).removeClass('display-none')
                                }
                            }
                        });
                    }
                }
            }
            if (row) {
                var property = row.dataset.property.camelPhynate();
                Object.entries(rules).forEach(function(rule) {
                    var key = rule[0];
                    var value = rule[1];
                    0 > 1 ? console.log(537, {
                        el,
                        property,
                        declaration
                    }) : null;
                    if (key === property) {
                        0 < 1 ? console.log(517, {
                            el,
                            property,
                            declaration
                        }) : null;
                        0 < 1 ? console.log(522, property, {
                            key,
                            value
                        }) : null;
                        if (declaration === "checkbox") {
                            var checkboxes = el.all('input[type="checkbox"]');
                            var json = is.json(value) ? JSON.parse(value) : [value];
                            0 < 1 ? console.log(536, property, {
                                json,
                                checkboxes
                            }) : null;
                            checkboxes.forEach(function(checkbox) {
                                var name = checkbox.name;
                                if (json.includes(name)) {
                                    checkbox.checked = true;
                                }
                            });
                        }
                        if (declaration === "dimension") {
                            var dimension = value.cssValue();
                            var number = el.find('input[type="number"]');
                            if (number) {
                                number.value = dimension.number;
                            }
                            var unit = el.find('[data-value="unit"]');
                            if (unit) {
                                unit.textContent = dimension.unit;
                            }
                            0 < 1 ? console.log(562, property, {
                                dimension,
                                number,
                                unit
                            }) : null;
                        }
                        if (declaration === "number") {
                            var number = el.find('input[type="number"]');
                            if (number) {
                                String.prototype.formulate = function(formula) {
                                    var variable = this.toString();
                                    var v = variable;
                                    formula.split('{var}').forEach(function(x) {
                                        v = v.replace(x, '');
                                        console.log(593, {
                                            v,
                                            x,
                                            variable,
                                            formula
                                        });
                                    });
                                    var reg = variable.matchAll("{var}");
                                    console.log({
                                        variable,
                                        formula,
                                        v,
                                        reg
                                    });
                                    return v;
                                }
                                var formula = number.dataset.formula;
                                if (formula) {
                                    value = value.formulate(formula);
                                }
                                number.value = value;
                            }
                            0 < 1 ? console.log(583, property, {
                                formula,
                                number,
                                value
                            }) : null;
                        }
                        if (declaration === "string") {
                            el.find('input[type="text"]').value = value;
                        }
                    }
                });
            }
        });
    }

}
window.tool.box.element = async function(target) {
    var button = target.closest('[data-value]');
    if (button) {
        var iframe = byId('iframe-editor');
        var win = iframe.contentWindow;
        var doc = win.document;

        var focused = win.$('[focus]');
        var focusing = focused[focused.length - 1];

        var element = null;
        var value = button.dataset.value;
        console.log(268, {
            focused,
            focusing,
            value
        });

        if (value) {
            var html = await ajax('raw/asset/html/tool/tool.box.elements.html');
            var parser = new DOMParser().parseFromString(html, "text/html");
            var element = parser.body.firstElementChild.find(value);

            modal.exit(target);

            var wrapper = focusing.find('flex, column, row, section');
            wrapper.insertAdjacentHTML('beforeend', element.outerHTML)
            wrapper.lastElementChild.focus();

        }
    }
}
window.tool.box.values = function(target) {
    var button = target.closest('[data-tap] > [data-value]');
    if (button) {
        var unit = button.textContent;
        var text = button.closest('[data-dropdown] + *').previousElementSibling.firstElementChild;
        text.textContent = unit;

        var input = text.closest('row > * > *').previousElementSibling;
        var onchange = input.getAttribute('onchange').split('(')[0].split('.');
        var method = window;
        console.log({
            button,
            input,
            onchange
        });

        if (button.dataset.dimension === "unit") {
            input.classList.remove('display-none');
        } else {
            input.classList.add('display-none');
        }
        onchange.forEach(function(o) {
            method = method[o];
        });
        method(input);
    }
}
window.tool.box.unit = function(target) {
    var button = target.closest('[data-tap] > *');
    if (button) {
        var unit = button.textContent;
        var text = button.closest('[data-dropdown] + *').previousElementSibling.firstElementChild;
        text.textContent = unit;

        var input = text.closest('row > * > *').previousElementSibling;
        var onchange = input.getAttribute('onchange').split('(')[0].split('.');
        var method = window;
        0 > 1 ? console.log({
            button,
            input,
            onchange
        }) : null;

        if (button.dataset.dimension === "unit") {
            input.classList.remove('display-none');
        } else {
            input.classList.add('display-none');
        }
        onchange.forEach(function(o) {
            method = method[o];
        });
        method(input);
    }
}
window.tool.box.value = function(target) {
    var iframe = byId('iframe-editor');
    var win = iframe.contentWindow;
    var doc = win.document;
    var tagName = doc.body.getAttribute('focus');
    var focused = win.$('[focus]');
    var focus = focused[focused.length - 1];
    var attribute = target.closest('[data-property]').dataset.property;
    var element = target.closest('[data-element]').dataset.element;
    if (element === "wrapper") {
        focus = focus.find(tagName + " > :not(backdrop):not(empty):not(template)");
    }
    if (element === "children") {
        focus = focus.find(tagName + " > :not(backdrop):not(empty):not(template) > *");
    }

    var value = null;
    var declaration = target.closest('[data-declaration]').dataset.declaration;
    var property = target.closest('[data-property]').dataset.property;
    if (declaration === "checkbox") {
        value = target.checked ? target.name : null;
        console.log(695, {
            property,
            value
        });
    }
    if (declaration === "dimension") {
        var unit = target.nextElementSibling.find('[data-dropdown]').firstElementChild.textContent;
        if (unit) {
            value = target.classList.contains('display-none') ? unit : target.value + unit;
        }
    }
    if (declaration === "number") {
        var formula = target.dataset.formula ? target.dataset.formula : null;
        value = formula ? formula.replace('{var}', target.value) : target.value.replace('%', 'pct');
    }
    if (declaration === "string") {
        value = target.value;
    }
    if (declaration === "value") {
        var selected = target.closest('[data-value]');
        if (selected) {
            value = selected.dataset.value;
            target.closest('[data-tap]').previousElementSibling.firstElementChild.textContent = selected.textContent;
        }
    }

    attribute = property.camelPhenate();
    var supports = CSS.supports(attribute, value);
    0 < 1 ? console.log(729, {
        supports,
        declaration
    }, {
        attribute,
        value
    }) : null;
    if (supports) {
        var rule = target.closest('[data-at-rule]') ? target.closest('[data-at-rule]').dataset.atRule : null;
        window.tool.box.style(focus, {
            attribute,
            value
        }, {
            rule,
            formula
        });
    } else {
        if (property && value) {
            focus.setAttribute(property, value);
        } else {
            focus.removeAttribute(property);
        }
    }
}
window.tool.box.style = async function(focus, declaration, options) {

    declaration.value ? declaration.value = declaration.value.replace('%', 'pct') : null;
    console.log(616, {
        focus,
        declaration,
        options
    });
    var pseudo = options ? options.pseudo : null;
    var rule = options ? options.rule : null;
    var formula = options ? options.formula : null;
    var attribute = attr = declaration.attribute;
    if (formula) {
        var v = formula;
        formula.split('{var}').forEach(function(x) {
            v = v.replace(x, '');
            console.log(593, {
                v,
                x,
                formula
            });
        });
    }
    var value = v = formula ? v : declaration.value.replace('%', 'pct');
    console.log(785, {
        focus,
        declaration,
        options,
        value
    });

    //STYLE SHEETS
    var iframe = byId('iframe-editor');
    var win = iframe.contentWindow;
    var doc = win.document;
    var head = doc.head;
    var styles = head.all('link');
    var sheet = 'sheet-' + attr;
    0 > 1 ? console.log(586, {
        head,
        styles,
        sheet
    }) : null;

    var styleExists = byId(sheet);
    var stylesheet = null;
    if (styles.length > 0) {
        styles.forEach(function(style) {
            if (style.id === sheet) {
                stylesheet = style;
                styleExists = true;
            }
            0 > 1 ? console.log(599, {
                style,
                sheet,
                id: style.id,
                attr
            }) : null;
        });
    }

    //INLINE STYLE
    0 < 1 ? console.log(520, {
        focus,
        attribute,
        value
    }) : null;
    //focus.style[attribute] = value;

    //DATASET
    attribute = attribute.camelPhenate();
    var className = [declaration.attribute, declaration.value.replace('%', 'pct')].join('-');
    var obj = {};
    obj[className] = {
        className,
        pseudo,
        rule,
        attribute,
        value,
    };
    0 < 1 ? console.log(472, {
        focus,
        attribute,
        value
    }, obj) : null;
    if (formula) {
        focus.setAttribute('css-' + declaration.attribute, declaration.value);
    } else {

    //INLINE CLASS
    //else {
    var classExists = false;
    var classList = focus.classList;
    classList.forEach(function(classVal) {
        var cns1 = classVal.split('-');
        var val1 = cns1.pop();
        var cn1 = cns1.join('-')

        var cns = className.split('-');
        var val = cns.pop();
        var cn = cns.join('-')
        if (cn1 == cn) {
            classExists = true;
        }
        0 > 1 ? console.log(557, className, cn, cn1) : null;
        if (classExists) {
            focus.classList.remove(classVal);
        }
    });
    focus.classList.add(className);
    //}
    }

    var rules = null;
    var type = formula ? 'css' : 'class';
    var property = attr;

    console.log(702, {
        styleExists
    });
    var decs = [{
        type,
        property: declaration.attribute,
        value: declaration.value
    }];
    console.log(716, decs);
    css.style.done(doc, className, decs);
}
window.tool.box.group = function(target) {
    $(target.closest('box > row').nextElementSibling).toggleClass('display-none');
}
window.tool.box.section = function(target) {
    var iframe = byId('iframe-editor');
    var win = iframe.contentWindow;
    var doc = win.document;
    var tagName = doc.body.getAttribute('focus');
    var focused = win.$('[focus]');
    var focus = focused[focused.length - 1];
    var element = target.closest('[data-element]').dataset.element;
    if (element === "wrapper") {
        focus = focus.find(tagName + " > :not(backdrop):not(empty):not(template)");
    }
    if (element === "children") {
        focus = focus.find(tagName + " > :not(backdrop):not(empty):not(template) > *");
    }

    var button = target.closest('[data-value]');
    var value = button ? button.dataset.value : null;
    if (value) {
        target.closest('[data-tap]').previousElementSibling.firstElementChild.textContent = button.textContent;
        target.closest('[data-tap]').previousElementSibling.firstElementChild.value = button.dataset.value;

        var box = target.closest('box');
        $(box.all('box > row ~ column')).addClass('display-none');

        var attribute = target.closest('[data-property]').dataset.property;
        var rule = target.closest('[data-at-rule]') ? target.closest('[data-at-rule]').dataset.atRule : null;
        var formula = target.dataset.formula ? target.dataset.formula : null;
        console.log(focus, {
            attribute,
            value
        }, {
            rule,
            formula
        });
        window.tool.box.style(focus, {
            attribute,
            value
        }, {
            rule,
            formula
        });

        var tab = value ? $(box.find('box > row ~ column[data-tab="' + value + '"]')) : null;
        if (tab) {
            tab.removeClass('display-none');
        }
    }
}
window.tool.box.width = function(target) {
    var iframe = byId('iframe-editor');
    var win = iframe.contentWindow;
    var doc = win.document;
    var focused = win.$('[focus]');
    var focus = focused[focused.length - 1];
    var unit = target.nextElementSibling.find('[data-dropdown]').firstElementChild.textContent;
    var value = target.value;
    console.log(347, {
        focus,
        unit,
        value
    });
    if (unit === "auto") {
        focus.style.width = "auto";
    } else {
        focus.style.width = value + unit;
    }
}

/*CSS API*/
window.css = {};

window.css.style = {};
window.css.style.declaration = function(c) {
    var rules = [];
    var split = c.split('-');
    var value = split.splice(split.length - 1)[0];
    var properties = [];
    split.forEach(function(s) {
        if (s.startsWith('dw') || s.startsWith('_')) {
            split;
        } else {
            properties.push(s);
        }
    });
    var property = properties.join('-');
    0 > 1 ? console.log(731, {
        c,
        split,
        property,
        value
    }) : null;
    return [property, value];
}

window.css.style.done = function(doc, rule, decs) {
    doc.head.cssTexts ? null : doc.head.cssTexts = {};
    console.log(947, 'css.style.done', {
        decs
    });
    return new Promise(function(resolve, reject) {
        for (const rule of decs) {
            var type = rule.type;
            var property = rule.property;
            var value = rule.value;
            var className = rule.className;
            var lnk = null;
            var head = doc.head;

            var styleExists = false;
            var stylesheet = null;
            var selector = rule.type === 'css' ? '[css-' + property + '="' + value + '"]' : '.' + [property, value].join('-');
            var attr = '';
            var that = '';
            if (rule.type === 'css') {
                that = property.rfo('css-').split('-').filter(function(row) {
                    return row.startsWith('dw') ? '' : row;
                }).join('-');
            } else {
                that = [property].join('-');
            }
            property = attr = that;
            0 > 1 ? console.log(845, {
                rule,
                attr
            }) : null;
            var sheet = 'sheet-' + attr;
            var style = doc.head.find('#' + sheet);
            style = doc.head.cssTexts[sheet];
            var declaration = "";
            var query = rule.property.startsWith('dw');
            //console.log(854, {query});
            if (query) {
                var dw = rule.property.startsWith('dw');
                var dimension = rule.property.rfo('css-').split('-').filter(function(row) {
                    return row.startsWith('dw') ? row : '';
                }).join('-');
                dw ? declaration += '@media (max-width: ' + dimension.split('dw')[1] + ') {' : '';
                declaration += selector + ' { ' + property + ": " + value.replace('pct', '%') + " }";
                declaration += '}';
            } else {
                declaration = selector + ' { ' + property + ": " + value.replace('pct', '%') + " }";
            }
            0 > 1 ? console.log(864, sheet, {
                declaration,
                style,
                head: doc.head.find('#' + sheet),
                id: byId(sheet)
            }) : null;
            if (style) {
                doc.head.cssTexts[sheet] ? doc.head.cssTexts[sheet].push(declaration) : doc.head.cssTexts[sheet] = [declaration];
                0 > 1 ? console.log(864, style.id, {
                    cssText,
                    sheet: doc.head.cssTexts[sheet],
                    cssTexts: doc.head.cssTexts
                }) : null;
            } else {
                doc.head.cssTexts[sheet] = [declaration];
                0 > 1 ? console.log(891, {
                    query,
                    rule,
                    sheet,
                    declaration,
                    selector,
                    property,
                    value
                }) : null;
            }

            0 > 1 ? console.log(599, {
                style,
                sheet,
                id: style.id,
                attr
            }) : null;
            //});

            0 > 1 ? console.log(929, 'cssLoaded', {
                styleSheets: doc.styleSheets,
                rules,
            }, {
                cssTexts: doc.head.cssTexts,
                stylesheet,
                sheet
            }) : null;
        }

        var entries = Object.entries(doc.head.cssTexts);
        entries = Array.from(new Set(entries.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
        0 < 1 ? console.log(1065, 'doc.head.cssTexts', {
            head: doc.head,
            cssTexts: doc.head.cssTexts,
            entries,
            decs
        }) : null;
        for (const entry of entries) {
            var id = entry[0];
            entry[1] = Array.from(new Set(entry[1].map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
            entry[1].reverse();
            var href = entry[1].join(' ');

            var exists = decs.find(o=>'sheet-' + o.property === id);
            if (exists) {

                var link = doc.head.find('#' + id);
                if (link) {
                    0 < 1 ? console.log(1071, {
                        entry: entry[1],
                        link,
                        id,
                        href
                    }) : null;
                    link.href = blob(href, 'text/css');
                    link.id = id;
                    link.onload = function() {
                        console.log(876, link.id);
                        //resolve(link);
                    }
                    link.rel = "stylesheet";
                    doc.head.appendChild(link);
                } else {
                    var link = document.createElement('link');
                    link.href = blob(href, 'text/css');
                    link.id = id;
                    link.rel = "stylesheet";
                    doc.head.appendChild(link);
                }
            }

        }
    }
    );
}
window.css.style.sheet = async function(el) {
    var win = el.ownerWindow();
    var doc = win.document;
    var html = el.closest('html')
    var head = html.find('head');
    var body = html.find('body');

    var els = $(el.all('[class], [css], [data]')).concat(el);
    var classNames = [];
    var styleset = {};
    els.forEach(function(elem) {
        var classList = elem.classList;
        classList.forEach(function(className) {
            var formula = elem.dataset.formula;
            var split = className.split('-');
            var value = split.splice(split.length - 1)[0];
            var property = split.join('-');

            //value = formula ? formula.replace('{var}', value) : value;
            0 > 1 ? console.log(955, {
                className,
                property
            }) : null;
            classNames.push({
                type: 'class',
                property,
                value
            });
        })

        for (const [i,a] of Object.entries(elem.attributes)) {
            var key = a.name;
            var value = a.value;
            key.startsWith('css-') ? styleset[key.rfo('css-')] = value : null;
        }
        Object.entries(styleset).forEach(function(data, index) {
            var split = data[0].split('-');
            split.splice(split.length - 1);
            var property = data[0];
            var value = data[1];
            0 > 1 ? console.log(949, {
                data,
                property
            }) : null;
            classNames.push({
                type: 'css',
                property,
                value
            });
        })
    })
    //classNames = [...new Set(classNames)];
    //classNames = Array.from(new Set(classNames.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
    console.log(989, {
        classNames,
        styleset
    });

    var declarations = [];
    if (0 > 1) {
        for (var row of classNames) {

            var el = row.el;
            var type = row.type;
            var className = row.property;

            var declaration = css.style.declaration(className);
            var property = row.property;
            var value = row.value;
            declarations[declaration[0]] = declaration[1];

            var split = property.split('-');
            var camel = [];
            split.forEach(function(s) {
                if (s.startsWith('dw') || s.startsWith('_')) {
                    split;
                } else {
                    camel.push(s);
                }
            });
            var attr = camel.join('-').camelPhynate();
            0 > 1 ? console.log({
                attr,
                camel
            }) : null;

            var styles = head.all('link');
            var sheet = 'sheet-' + attr;
            0 > 1 ? console.log(586, {
                head,
                styles,
                sheet
            }) : null;

            var styleExists = false;
            var stylesheet = null;
            if (styles.length > 0) {
                styles.forEach(function(style) {
                    if (style.id === sheet) {
                        stylesheet = style;
                        styleExists = true;
                    }
                    0 > 1 ? console.log(599, {
                        style,
                        sheet,
                        id: style.id,
                        attr
                    }) : null;
                });
            }

            console.log(586, {
                property,
                value
            })

        }
    }

    await css.style.done(doc, {
        type,
        property,
        value
    }, classNames);

    console.log(858, 'css.style.sheet', {
        el,
        els
    }, {
        head,
        body
    }, {
        classNames,
        declarations
    });
}
;
