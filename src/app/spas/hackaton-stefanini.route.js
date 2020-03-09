(function(angular){
    "use strict";

    angular.module('hackaton-stefanini').config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/spas/listagem/template/listagem.tpl.html',
                controller: 'ListagemController as vm'
            })
            .otherwise({
                templateUrl: 'index_ERROR.html'
            });
    });

}(angular));

