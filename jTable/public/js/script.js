console.log(window.localStorage);
$.ajaxSetup({
    url: 'api/data'
});

var App = {
    params: {
        limit: 20,
        offset: 0,
        sortBy: '_id',
        desc: false
    },

    requests: {

        get: function (data) {
            return $.ajax({
                type: 'GET',
                dataType: 'json',
                data: data
            });
        },

        set: function (data) {
            return $.ajax({
                type: 'POST',
                dataType: 'json',
                data: data
            });
        }
    },

    serialize: function (obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    },

    elemView: {

        renderElem: function (container, v) {
            container.append(
                '<tr><td>' + v._id +
                '</td><td>' + this.convertBoolean(v.isActive) +
                '</td><td' + this.checkNumberSign(v.age) + '>' + v.age +
                '</td><td' + this.checkNumberSign(v.credit) + '>' + v.credit +
                '</td><td' + this.checkNumberSign(v.latitude) + '>' + Math.round(+v.latitude) +
                '</td><td' + this.checkNumberSign(v.longitude) + '>' + (+v.longitude).toFixed(1) +
                '</td></tr>');
        },

        convertBoolean: function (bool) {
            if (bool) {
                return 'Yes'
            } else {
                return 'No'
            }
        },

        checkNumberSign: function (number) {
            if (number > 0) {
                return ' class="blue"';
            } else if (number < 0) {
                return ' class="red"';
            } else {
                return '';
            }
        }
    },

    appView: {

        toggleForm: function (btnBlock, formBlock) {
            btnBlock.find('.btn').toggleClass('hidden');
            formBlock.toggleClass('hidden');
        },

        initPagination: function (count, container, currentPage) {
            var pages = Math.ceil(count / 20),
                lowLimit = 10,
                highLimit = 10;

            if (pages > lowLimit) {
                lowLimit = 5;
                highLimit = pages - 5;
            }

            for (var i = 1; i <= pages; i++) {
                if (i > lowLimit) {
                    lowLimit = i + 100;
                    i = (highLimit - 1);
                    container.append('<li class="bord-none">' + '...' + '</li>');
                } else {
                    container.append('<li class="page-btn" data-page="' + i + '"><a href="?limit=20&offset=' +
                        ((i - 1) * 20) + (window.localStorage.sortBy ? window.localStorage.sortBy : '') +
                        '"' + (currentPage === i ? 'class="active"' : '') + '>' + i + '</a></li>');
                }
            }

            $('.pagination>.page-btn>a').on('click', function (e) {
            });
        }
    }
};

if (window.location.search) {
    App.params = window.location.search;
}

$(document).ready(function () {

    var container = $('.content'),
        paginator = $('.pagination'),
        btnBlock = $('.btn-block'),
        formBlock = $('.form-block');

        //request = App.requests.get(App.params);

    btnBlock.on('click', '.btn', function (e) {
        App.appView.toggleForm(btnBlock, formBlock);
    });

    formBlock.on('click', '.form-block-close', function () {
        App.appView.toggleForm(btnBlock, formBlock);
    });

    formBlock.on("submit", '#new-item-form', function (event) {
        event.preventDefault();
        App.requests.set($(this).serialize());
        console.log($(this).serialize());
        App.appView.toggleForm(btnBlock, formBlock);
    });

    App.requests.get(App.params)
    .done(function (data) {
        var Collection = data.table;
        console.log('data:', data);

        $.each(Collection, function (i, v) {
            App.elemView.renderElem(container, v);
        });
            App.appView.initPagination(300, paginator, data.page);

        $('.data-table').on('click', '.sort-by', function (e) {
            window.localStorage.sortBy = '&sortBy=' + $(e.target).attr('data-sort');
            App.appView.initPagination(100, paginator, data.page);
            location.reload();
        });
    });

});