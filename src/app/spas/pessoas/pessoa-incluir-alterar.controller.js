angular.module("hackaton-stefanini").controller("PessoaIncluirAlterarController", PessoaIncluirAlterarController);
PessoaIncluirAlterarController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function PessoaIncluirAlterarController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    vm = this;
    vm.pessoa = {};
    vm.pessoa.situacao = false;
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
        vm.pessoa.dataNascimento = vm.converteData(vm.pessoa.dataNascimento);
        var obj = JSON.stringify(vm.pessoa);

        HackatonStefaniniService.alterarPessoa(obj).then(
            function (response) {
                if (response.data !== undefined)
                    vm.sucesso = response.data;
            }
        );
    }

    vm.converteData = function(data){
        var dia = data.slice(0,2);
        var mes = data.slice(2,4);
        var ano = data.slice(4,8);
        return ano+"-"+mes+"-"+dia;
    }

}
