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

    vm.dataFormat = function (dateObj){
        
        if (dateObj === undefined)
            return "";

        var dt = dateObj.toLocaleString('pt-BR');
        var hora = dt.split("-")[2].split("T")[1].substring(0,5);
        var dia = dt.split("-")[2].split("T")[0];
        var mes = dt.split("-")[1];
        var ano = dt.split("-")[0];

        return dia + "/" + mes + "/" + ano + " - " + hora;
    };

    vm.editar = function(id){
        if (id !== undefined)
            $location.path("EditarPerfis/"+id);
        else 
            $location.path("EditarPerfis");
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
