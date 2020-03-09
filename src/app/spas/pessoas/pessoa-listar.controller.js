angular.module("hackaton-stefanini").controller("PessoaListarController", PessoaListarController);
PessoaListarController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function PessoaListarController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    vm = this;
    vm.ola = "Ola Pessoa controller";

    vm.init = function () {
        vm.listarPessoas();
    };

    vm.listarPessoas = function () {
        HackatonStefaniniService.listarPessoas().then(
            function (response) {
                if (response.data !== undefined)
                    vm.listaPessoas = response.data;
            }
        );
    };

    vm.editar = function(id){
        $location.path("EditarPessoas/"+id);
    }
}
