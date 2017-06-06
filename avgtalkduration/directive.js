(function () {
    'use strict';
    
    angular.module('widget.avgtalkduration')
            .directive('avgtalkduration', function () {
                return {
                    restrict: 'E',
                    templateUrl: '../widgets/avgtalkduration/template.html',
                    controller: 'avgtalkdurationCtrl',
                    controllerAs: 'ATD',
                    scope: {
                        'live': '='
                    }
                };
            });
})();