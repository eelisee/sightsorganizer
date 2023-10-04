/*require w3.js*/
"use strict";
var mw = {};
let $ = function (id) {
    return w3.getElements(id);
}
mw.ajax = {};
mw.ajax.get = function ($url, $func) {
    let $xhttp = new XMLHttpRequest();
    $xhttp.open('GET', $url, true);
    $xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            $func(this.status == 200 ? this.responseText : false);
        }
    }
    $xhttp.send();
}
mw.ajax.post = function ($url, $args, $func) {
    let $xhttp = new XMLHttpRequest();
    $xhttp.open('POST', $url, true);
    $xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    $xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            $func(this.status == 200 ? this.responseText : false);
        }
    }
    $xhttp.send($args);
}
mw.template = {};
mw.template.leftDelimiter = '{{';
mw.template.rightDelimiter = '}}';
mw.template.setVars = function (tpl, vars) {
    for (let key in vars) {
        let searchKey = mw.template.leftDelimiter + key + mw.template.rightDelimiter;
        while (tpl.search(searchKey) >= 0) {
            tpl = tpl.replace(searchKey, vars[key]);
        }
    }
    return tpl;
}
mw.tab = function ($tabListName, $tabName = '', $class = '') {
    if ($class === '') {
        $class = 'w3-show';
    }
    let $tabList = document.getElementById($tabListName);
    for (let $i = 0; $i < $tabList.children.length; $i++) {
        if ($tabList.children[$i].id == $tabName) {
            w3.addClass($tabList.children[$i], $class);
        } else {
            w3.removeClass($tabList.children[$i], $class);
        }
    }
}
mw.mouse = {};
mw.mouse.posX = 0;
mw.mouse.posY = 0;
mw.mouse.track = function ($event) {
    document.addEventListener($event, function ($e) {
        mw.mouse.posX = $e.pageX;
        mw.mouse.posY = $e.pageY;
    });
}
mw.contextmenu = {};
mw.contextmenu.open = function ($id) {
    w3.addClass($id, 'w3-show');
    w3.addStyle($id, 'top', mw.mouse.posY + 'px');
    w3.addStyle($id, 'left', mw.mouse.posX + 'px');
}
mw.contextmenu.close = function ($id) {
    w3.removeClass($id, 'w3-show');
}
