angular.module("hackaton-stefanini").controller("PerfisListarController", PerfisListarController);
PerfisListarController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function PerfisListarController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    vm = this;
    vm.url = "http://localhost:8080/treinamento/api/perfils/";
   
    vm.init = function () {
        HackatonStefaniniService.listar(vm.url).then(
            function (response) {
                if (response.data !== undefined)
                    vm.listaPerfis = response.data;
            }
        );
    };

    vm.editar = function(id){
        $location.path("EditarPerfis/"+id);
    }

    vm.excluir = function(id){
        HackatonStefaniniService.excluir(vm.url+id).then(
            function (response) {
                vm.goToListagem();
            }
        );
    }

    vm.goToListagem = function(){
        $location.path("listarPerfis");
    }

}
