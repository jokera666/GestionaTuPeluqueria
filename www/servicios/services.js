angular.module('starterMiApp.service', [])

.service('hexafy', function() {
	this.variable = 10;
    this.myFunc = function (x) {
        return x.toString(16);
    }
})
