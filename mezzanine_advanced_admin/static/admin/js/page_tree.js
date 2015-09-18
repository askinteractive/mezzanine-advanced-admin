
jQuery(document).ready(function($) {

    var cookie = 'mezzanine-admin-tree';
    var at = ('; ' + document.cookie).indexOf('; ' + cookie + '=');
    var ids = '';

    if (at > -1) {
        ids = document.cookie.substr(at + cookie.length + 1).split(';')[0];
    }

    var toggleID = function(opened, id) {
        // Add or remove the page ID from the cookie IDs string.
        var index = $.inArray(id, ids.split(','));
        if (opened) {
            if (index == -1) {
                if (ids) {ids += ',';}
                ids += id;
            }
        } else if (index > -1) {
            ids = ids.split(',');
            ids.splice(index, 1);
            ids = ids.join(',');
        }
        document.cookie = cookie + '=' + ids + '; path=/';
    };

    function showButtonWithChildren() {
        $('li:has(ol) .tree-toggle').css({visibility: 'visible'});
        $('li:not(:has(ol)) .tree-toggle').css({visibility: 'hidden'});
    }

    showButtonWithChildren();

    $('#tree .tree-toggle').click(function() {
        // Show/hide the branch and toggle the icon.
        var pageLink = $(this);
        pageLink.parents('li:first').find('ol:first').toggle();
        pageLink.find('.page-tree-icon').toggle();
        // Add or remove the page ID from the cookie.
        var opened = pageLink.find('.close:visible').length == 1;
        var id = pageLink.attr('id').split('-')[1];
        toggleID(opened, id);
        return false;
    });

    // Show previously opened branches.
    $('#tree ol').find('ol').hide();
    if (ids) {
        $('#page-' + ids.split(',').join(', #page-')).each(function(){
            var pageLink = $(this);
            pageLink.parents('li:first').find('ol:first').toggle();
            pageLink.find('.page-tree-close').show();
            pageLink.find('.page-tree-open').hide();
        });
    }

    // The dropdown list for adding a new page contains URLs for each
    // model - redirect when selected.
    $('.addlist a').click(function(e) {
        e.preventDefault();
        // Ensure the branch is saved as open when adding to it so that
        // the new branch will be visible directly after saving.
        var link = $(this);
        var id = link.parents('.addlist:first').attr('id');
        if (id) {
            toggleID(true, id.split('-')[1]);
        }
        var addUrl = link.attr('href');
        if (addUrl) {
            location.href = addUrl;
        }
        return true;
    });

    // AJAX callback that's triggered when dragging a page to re-order
    // it has ended.
    //var updateOrdering = function(event, ui) {
    //    var parent = ui.item.parents('li:first');
    //
    //    var args = {
    //        id: ui.item[0].id,
    //        parent_id: parent.length ? parent[0].id : "null",
    //        siblings: ui.item.parent().children().map(function(index, elem) {
    //            return elem.id;
    //        }).get()
    //    };
    //
    //    $.post(window.__page_ordering_url, args, function(data) {
    //        if (String(data).substr(0, 2) !== "ok") {
    //            location.reload();
    //        } else {
    //            $(".messagelist").remove();
    //        }
    //    });
    //
    //    showButtonWithChildren();
    //};

    var updateOrdering = function ($item, container, _super, event) {
        $item.removeClass(container.group.options.draggedClass).removeAttr("style");
        $("body").removeClass(container.group.options.bodyClass);
        showButtonWithChildren();
    };

    // Make the pages sortable via drag and drop.
    // The `connectWith` option needs to be set separately to get
    // around a performance bug with `sortable`.
    $('#tree > ol').sortable({
        handle: '.ordering',
        onDrop: updateOrdering,
        placeholderClass: "tree-placeholder",
        placeholder: '<li class="tree-placeholder"></li>',
        nested: true,
        vertical: true,
        tolerance: 10
        //itemSelector: 'li',
        //toleranceElement: '> div',
        //opacity: 0.5,
        //stop: updateOrdering,
        //forcePlaceholderSize: true,
        //placeholder: 'placeholder',
        //revert: 150,
        //helper: 'clone',
        //tabSize: 25,
        //tolerance: 'pointer',
        //isTree: true,
        //expandOnHover: 1000,
        //startCollapsed: true
    });

});
