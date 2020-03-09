angular.module("hackaton-stefanini").controller("ListagemController", ListagemController);
ListagemController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function ListagemController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    vm = this;
    vm.ola = "Olá Mundo!!!";

    vm.goToListagem = function () {
        //$location.path("listagem/100000");
        vm.executaConsultaModelo();
    };

    vm.executaConsultaModelo = function () {
        var dados = {

        };

        HackatonStefaniniService.teste(dados).then(
            function (response) {
                if (response.data !== undefined)
                    console.log(response.data);
            }
        );
    };
}
