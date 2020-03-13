angular.module("hackaton-stefanini").controller("PessoaListarController", PessoaListarController);
PessoaListarController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function PessoaListarController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    vm = this;
    vm.url = "http://localhost:8080/treinamento/api/pessoas/";

    vm.init = function () {
        HackatonStefaniniService.listar(vm.url).then(
            function (response) {
                if (response.data !== undefined)
                    vm.listaPessoas = response.data;
            }
        );
    };

    vm.editar = function(id){
        if (id !== undefined)
            $location.path("EditarPessoas/"+id);
        else 
            $location.path("cadastrarPessoa");
    }

    vm.excluir = function(id){
        HackatonStefaniniService.excluir(vm.url+id).then(
            function (response) {
                vm.goToListagem();
            }
        );
    }

    vm.goToListagem = function(){
        $location.path("listarPessoas");
    }

}
