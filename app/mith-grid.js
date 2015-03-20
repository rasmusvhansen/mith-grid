(function() {
    'use strict';
    /*global m:false */
    //namespace
    var app = {};


    //model
    app.vm = {};
    app.vm.counter = 0;
    app.vm.rowsToShow = 100;
    app.vm.startAtRow = 0;
    app.vm.loadMore = function () {
        app.vm.startAtRow = Math.min(app.vm.rows().length - app.vm.rowsToShow, app.vm.startAtRow + app.vm.rowsToShow);    
    };
    
    app.vm.canLoadMore = function () {
        return app.vm.startAtRow + app.vm.rowsToShow < app.vm.rows().length;
    };
    
    app.vm.loadLess = function () {
        app.vm.startAtRow = Math.max(0, app.vm.startAtRow - app.vm.rowsToShow);    
    };
    app.vm.pagedRows = function() {
        var totalRowCount = app.vm.rows().length,
            start = Math.min((totalRowCount - app.vm.rowsToShow), app.vm.startAtRow),
            end = start + app.vm.rowsToShow;
        return app.vm.rows().slice(start, end);
    };

    app.vm.rows = m.prop(
        [{
            "URL": "http://google.com",
            "Title": "google",
            "Count": 5
        }, {
            "URL": "http://dr.dk",
            "Title": "DR",
            "Count": 15
        }, {
            "URL": "http://jp.dk",
            "Title": "JP",
            "Count": 25
        }]);


    //controller
    app.controller = function() {
        var rows = app.vm.rows;
        return {
            rows: rows,
            pagedRows: app.vm.pagedRows,
            addAsync: function() {
                m.startComputation();
                setTimeout(function() {
                    rows().push({
                        URL: 'http://test.com',
                        Title: 'test',
                        Count: 27
                    });
                    m.endComputation();
                }, 500)
            },
            addManyRows: function(n) {
                for (var i = app.vm.counter; i < app.vm.counter + n; i++) {
                    rows().push({
                        URL: 'http://test.com',
                        Title: 'test',
                        Count: i
                    });
                }
                app.vm.counter += n;
            },
            scroll: function(e) {
                var scrollHeight = e.target.scrollHeight,
                    scrollTop = e.target.scrollTop,
                    fromTop = scrollTop + e.target.clientHeight;
                if (scrollHeight - fromTop < 50 && app.vm.canLoadMore() ) {
                    app.vm.loadMore();
                    e.target.scrollTop = 20;
                }
                else if (scrollTop < 10 && app.vm.startAtRow > 0) {
                    app.vm.loadLess();
                    e.target.scrollTop = scrollHeight - e.target.clientHeight - 60;
                }
            }

        }
    };

    //view
    app.view = function(ctrl) {
        var table = m('table', [
            m('thead', {
                style: {
                    display: 'block'
                }
            }, [
                Object.keys(ctrl.pagedRows()[0]).map(function(th) {
                    return m('th', th);
                })
            ]),
            m('tbody', {
                style: {
                    height: '300px',
                    overflow: 'scroll',
                    display: 'block'
                },
                onscroll: ctrl.scroll
            }, ctrl.pagedRows().map(function(r) {
                return m('tr', [
                    Object.keys(r).map(function(k) {
                        return m('td', r[k]);
                    })
                ])
            }))
        ]);

        return m('div', [
            m('div', 'Rowcount: ' + ctrl.rows().length),
            m('button', {
                onclick: ctrl.addAsync
            }, 'Add row async'),
            m('button', {
                onclick: ctrl.addManyRows.bind(null, 5000)
            }, 'Add many rows'),
            m('br'),
            table
        ]);
    };

    //initialize
    m.module(document.getElementsByTagName('body')[0], app);
})();
