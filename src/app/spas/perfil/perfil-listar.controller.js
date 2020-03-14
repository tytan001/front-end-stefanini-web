angular.module("hackaton-stefanini").controller("PerfisListarController", PerfisListarController);
PerfisListarController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function PerfisListarController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    vm = this;
    
    vm.qdePorPagina = 4;
    vm.ultimoIndex = 0;

    vm.url = "http://localhost:8080/treinamento/api/perfils/";
   
    vm.init = function () {
        HackatonStefaniniService.listar(vm.url).then(
            function (response) {
                if (response.data !== undefined){
                    vm.listaPerfis = response.data;
                    vm.listaPerfisMostrar = [];
                    var max = vm.listaPerfis.length > vm.qdePorPagina ? vm.qdePorPagina : vm.listaPerfis.length;

                    vm.qdePaginacao = new Array(vm.listaPerfis.length % vm.qdePorPagina === 0 ? vm.listaPerfis.length / vm.qdePorPagina : parseInt(vm.listaPerfis.length / vm.qdePorPagina) + 1);
                    vm.currentPage = 1;
                    for (var count = 0; count < max; count++) {
                        vm.listaPerfisMostrar.push(vm.listaPerfis[count]);
                        vm.ultimoIndex++;
                    }

                    vm.listaPerfisMostrar.sort(function (a, b) {
                        return a.id - b.id;
                    });
                }
            }
        );
    };

    vm.atualizarPaginanacao = function (index) {

        vm.listaPerfisMostrar = [];

        if (index >= vm.currentPage) {
            vm.currentPage++;
            vm.contador = 0;

            var idx = angular.copy(vm.ultimoIndex);
            for (var count = vm.listaPerfis.length - vm.qdePorPagina; count > 0; count--) {
                vm.listaPerfisMostrar.push(vm.listaPerfis[idx++]);
                vm.ultimoIndex++;
                vm.contador++;
            }
        } else {
            vm.currentPage--;
            var idx = vm.listaPerfis.length - vm.contador - 1;
            vm.ultimoIndex = idx + 1;
            for (var count = vm.qdePorPagina; count > 0; count--) {
                vm.listaPerfisMostrar.push(vm.listaPerfis[idx--]);
                vm.contador--;
            }
        }
        vm.listaPerfisMostrar.sort(function (a, b) {
            return a.id - b.id;
        });
    };

    vm.avancarPaginanacao = function () {
        vm.currentPage++;
    };

    vm.retrocederPaginanacao = function () {
        vm.currentPage--;
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

    vm.remover = function(id){
        HackatonStefaniniService.excluir(vm.url+id).then(
            function (response) {
                vm.init();
            }
        );
    }

    vm.retornarTelaListagem = function(){
        $location.path("listarPerfis");
    }

}
