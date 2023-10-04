let sights = {};
sights.itemTemplate = '';
sights.selectedItemTemplate = '';
sights.all = [];
sights.selected = [];
sights.tourId = 0;
sights.mapMarkers = [];
sights.mapPath = [];
sights.init = function () {
    mw.ajax.get($webPath + '/sights/get_item_template', function ($response = false) {
        sights.itemTemplate = $response;
        mw.ajax.get($webPath + '/sights/get_selected_item_template', function ($response = false) {
            sights.selectedItemTemplate = $response;
            sights.load();
        });
    });
}
sights.load = function () {
    mw.ajax.get($webPath + '/sights/get_by_radius/' + $('#lat')[0].value + '/' + $('#lng')[0].value + '/' + $('#radius')[0].value, function ($response = false) {
        sights.update(JSON.parse($response.toString()));
    });
    mw.ajax.get($webPath + '/tours/get_selected/' + sights.tourId, function ($response = false) {
        sights.updateSelected(JSON.parse($response.toString()));
    });
}
sights.update = function ($sights) {
    sights.all = $sights;
    sights.view();
}
sights.updateSelected = function ($sights) {
    sights.selected = $sights;
    sights.view();
    sights.viewSelected();
}
sights.viewAll = function () {
    sights.view();
    sights.viewSelected();
    sights.mapMarkers = [];
    sights.mapPath = [];
}
sights.view = function () {
    $output = '';
    let $showUnselected = $('#showUnselected')[0].checked;
    for (let i = 0; i < sights.all.length; i++) {
        $output += mw.template.setVars(sights.itemTemplate, sights.all[i]);
        if ($showUnselected === true) {
            sights.mapMarkers[sights.all[i].sight_id] = {
                position: {
                    lat: parseFloat(sights.all[i].lat),
                    lng: parseFloat(sights.all[i].lng),
                },
                content: sights.all[i].name,
                highlighted: false
            };
        }
    }
    $('#sightsList')[0].innerHTML = $output;
    for (let key in sights.selected) {
        w3.removeClass('#sight_' + sights.selected[key].sight_id, 'w3-hover-light-grey');
        w3.addClass('#sight_' + sights.selected[key].sight_id, 'so-grey');
    }
    sights.viewMarkers();
}
sights.viewSelected = function () {
    $output = '';
    let $showSelected = $('#showSelected')[0].checked;
    for (let i = 0; i < sights.selected.length; i++) {
        $output += mw.template.setVars(sights.selectedItemTemplate, sights.selected[i]);
        if ($showSelected === true) {
            sights.mapMarkers[sights.selected[i].sight_id] = {
                position: {
                    lat: parseFloat(sights.selected[i].lat),
                    lng: parseFloat(sights.selected[i].lng),
                },
                content: sights.selected[i].name + ' [ausgewählt]',
                selected: true
            };
            sights.mapPath.push({lat: parseFloat(sights.selected[i].lat), lng: parseFloat(sights.selected[i].lng)});
        }
    }
    $('#selectedSightsList')[0].innerHTML = $output;
    sights.viewMarkers();
}
sights.viewMarkers = function () {
    map.clearAll();
    let path = [];
    sights.mapMarkers.forEach((item, index) => {
        map.addMarker(item);
    });
    let properties = {
        path: sights.mapPath
    };
    map.addPolyline(properties);
}
sights.save = function () {
    console.log('save');
    let $sightIds = '';
    let $first = true;
    for (i = 0; i < sights.selected.length; i++) {
        if ($first == true) {
            $first = false;
        } else {
            $sightIds += ',';
        }
        $sightIds += sights.selected[i].sight_id;
    }
    mw.ajax.post($webPath + '/tours/save_route', 'tour_id=' + sights.tourId + '&sight_ids=' + $sightIds, function ($response = false) {
        console.log($response);
        $('#feedbackModalContent')[0].innerHTML = $response;
        w3.addClass('#feedbackModal', 'w3-show');
    });
}
sights.choose = function ($id) {
    w3.removeClass('#sight_' + $id, 'w3-hover-light-grey');
    w3.addClass('#sight_' + $id, 'so-grey');
    for (let key in sights.all) {
        if (sights.all[key].sight_id == $id) {
            let $isSelected = false;
            for (let key in sights.selected) {
                if (sights.selected[key].sight_id == $id) {
                    $isSelected = true;
                    break;
                }
            }
            if ($isSelected != true) {
                sights.selected.push(sights.all[key]);
            }
            break;
        }
    }
    sights.viewSelected();
}
sights.remove = function ($id) {
    for (let key in sights.selected) {
        if ($id == sights.selected[key].sight_id) {
            sights.selected.splice(key, 1);
            break;
        }
    }
    sights.viewAll();
}
sights.moveDown = function ($id) {
    for (let key in sights.selected) {
        if ($id == sights.selected[key].sight_id) {
            changeWith = (key < sights.selected.length - 1 ? parseInt(key) + 1 : 0);
            tmp = sights.selected[changeWith];
            sights.selected[changeWith] = sights.selected[key];
            sights.selected[key] = tmp;
            break;
        }
    }
    sights.viewAll();
}
sights.moveToBottom = function ($id) {
    for (let key in sights.selected) {
        if ($id == sights.selected[key].sight_id) {
            changeWith = sights.selected.length - 1;
            tmp = sights.selected[changeWith];
            sights.selected[changeWith] = sights.selected[key];
            sights.selected[key] = tmp;
            break;
        }
    }
    sights.viewAll();
}
sights.moveUp = function ($id) {
    for (let key in sights.selected) {
        if ($id == sights.selected[key].sight_id) {
            changeWith = (key > 0 ? key - 1 : sights.selected.length - 1);
            tmp = sights.selected[changeWith];
            sights.selected[changeWith] = sights.selected[key];
            sights.selected[key] = tmp;
            break;
        }
    }
    sights.viewAll();
}
sights.moveToTop = function ($id) {
    for (let key in sights.selected) {
        if ($id == sights.selected[key].sight_id) {
            changeWith = 0;
            tmp = sights.selected[changeWith];
            sights.selected[changeWith] = sights.selected[key];
            sights.selected[key] = tmp;
            break;
        }
    }
    sights.viewAll();
}
//sights.init();
