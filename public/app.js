var app = angular.module('app', []);

app.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});
