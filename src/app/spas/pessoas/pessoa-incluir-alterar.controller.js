angular.module("hackaton-stefanini").controller("PessoaIncluirAlterarController", PessoaIncluirAlterarController);
PessoaIncluirAlterarController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function PessoaIncluirAlterarController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    vm = this;

    vm.init = function () {
       if($routeParams.idPessoa){
        vm.tituloTela = "Alterar Pessoa";
        vm.botaoAcao = "Alterar";
        vm.listarPessoaId($routeParams.idPessoa);
       }else{
        vm.tituloTela = "Cadastrar Pessoa";
        vm.botaoAcao = "Cadastrar";
       }
    };

    vm.listarPessoaId = function (id) {
        HackatonStefaniniService.listarPessoaId(id).then(
            function (response) {
                if (response.data !== undefined)
                    vm.pessoa = response.data;
            }
        );
    };


    vm.incluirAlterarPessoa = function(){
        vm.pessoa.situacao = true;
        vm.pessoa.id = 2;
        HackatonStefaniniService.alterarPessoa(vm.pessoa).then(
            function (response) {
                if (response.data !== undefined)
                    vm.sucesso = response.data;
            }
        );
    }

}
