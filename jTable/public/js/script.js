$(document).ready(function () {

    var app = {
        get: function (params) {
            return $.ajax({
                url: 'api/data',
                type: 'GET',
                dataType: 'json',
                data: params
            });
        },

        elemView: {
            renderElem: function (container, v) {
                container.append(
                    '<tr><td>' + v._id +
                    '</td><td>' + this.convertBoolean(v.isActive) +
                    '</td><td' + this.checkNumberSign(v.age) + '>' + v.age +
                    '</td><td' + this.checkNumberSign(v.credit) + '>' + v.credit +
                    '</td><td' + this.checkNumberSign(v.latitude) + '>' + v.latitude +
                    '</td><td' + this.checkNumberSign(v.longitude) + '>' + v.longitude +
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
        initPagination: function (count, container, currentPage) {
            var pages = Math.ceil(count / 20),
            	lowLimit = 10,
            	highLimit = 10;

            	if(pages > lowLimit){
            		lowLimit = 5;
            		highLimit = pages - 5;
            	}

            for (var i = 1; i <= pages; i++) {
                if(i > lowLimit){
                	lowLimit = i+100;
                	i = (highLimit-1);
                	container.append('<li class="bord-none">' + '...' + '</li>');
                } else {
                	container.append('<li>' + i + '</li>');
                }
            }
        }
    };

    var params = {limit: 20, offset: 0},
        container = $('.content'),
        paginator = $('.pagination'),
        request = app.get(params);

    request.done(function (data) {
        var Collection = data.table;
        console.log(data.table);

        $.each(Collection, function (i, v) {
            app.elemView.renderElem(container, v);
        });
        app.initPagination(401, paginator);
    });

});