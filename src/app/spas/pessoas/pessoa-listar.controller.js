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

    vm.excluir = function(id){
        HackatonStefaniniService.excluirPessoa(id).then(
            function (response) {
                if (response.data !== undefined){
                    alert("Excluido com sucesso!! (Provisório)")
                }
            }
        );
    }

    vm.formataDataTela = function(data){
        var ano = data.slice(0,4);
        var mes = data.slice(5,7);
        var dia = data.slice(8,10);
        var dataFormatada = dia+mes+ano;
        return dataFormatada;
    }


}
