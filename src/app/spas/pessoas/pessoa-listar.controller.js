angular.module("hackaton-stefanini").controller("PessoaListarController", PessoaListarController);
PessoaListarController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function PessoaListarController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    vm = this;
    vm.url = "http://localhost:8080/treinamento/api/pessoas/";
    vm.urlEndereco = "http://localhost:8080/treinamento/api/enderecos/";

    vm.init = function () {
        HackatonStefaniniService.listar(vm.url).then(
            function (responsePessoas) {
                if (responsePessoas.data !== undefined)
                    vm.listaPessoas = responsePessoas.data;
                HackatonStefaniniService.listar(vm.urlEndereco).then(
                    function (responseEndereco) {
                        if (responseEndereco.data !== undefined)
                            vm.listaEndereco = responseEndereco.data;
                    }
                );
            }
        );
    };

    vm.editar = function (id) {
        if (id !== undefined)
            $location.path("EditarPessoas/" + id);
        else
            $location.path("cadastrarPessoa");
    }

    vm.remover = function (id) {

        var liberaExclusao = true;

        angular.forEach(vm.listaEndereco, function (value, key) {
            if (value.idPessoa === id)
                liberaExclusao = false;
        });

        if (liberaExclusao)
            HackatonStefaniniService.excluir(vm.url + id).then(
                function (response) {
                    vm.init();
                }
            );
        else{
            alert("Pessoa com Endereço vinculado, exclusão não permitida");
        }
    }

    vm.retornarTelaListagem = function () {
        $location.path("listarPessoas");
    }

}
