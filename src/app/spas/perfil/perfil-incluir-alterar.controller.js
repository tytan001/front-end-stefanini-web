angular.module("hackaton-stefanini").controller("PerfilIncluirAlterarController", PerfilIncluirAlterarController);
PerfilIncluirAlterarController.$inject = [
    "$rootScope",
    "$scope",
    "$location",
    "$q",
    "$filter",
    "$routeParams",
    "HackatonStefaniniService"];

function PerfilIncluirAlterarController(
    $rootScope,
    $scope,
    $location,
    $q,
    $filter,
    $routeParams,
    HackatonStefaniniService) {

    /**ATRIBUTOS DA TELA */
    vm = this;

    vm.perfilDefault = {
        id: null,
        nome: "",
        descricao: "",
        dataHoraInclusao: new Date().toLocaleString("pt-BR"),
        dataHoraAlteracao: null
    };

    vm.urlPerfil = "http://localhost:8080/treinamento/api/perfils/";

    /**METODOS DE INICIALIZACAO */
    vm.init = function () {

        vm.tituloTela = "Cadastrar Perfil";
        vm.acao = "Cadastrar";
        vm.perfil = vm.perfilDefault;

        if ($routeParams.idPerfil) {
            vm.tituloTela = "Editar Perfil";
            vm.acao = "Editar";

            vm.recuperarObjetoPorIDURL($routeParams.idPerfil, vm.urlPerfil).then(
                function (perfilRetorno) {
                    if (perfilRetorno !== undefined)
                        vm.perfil = perfilRetorno;
                        var dt = vm.perfil.dataHoraInclusao.toLocaleString("pt-BR");
                        vm.perfil.dataHoraInclusao = dt.substring(8,10) + "/" + dt.substring(5,7) + "/" + dt.substring(0,4);
                }
            );
        }
    };

    /**METODOS DE TELA */
    vm.cancelar = function () {
        vm.retornarTelaListagem();
    };

    vm.retornarTelaListagem = function () {
        $location.path("listarPerfis");
    };

    vm.recuperarObjetoPorIDURL = function (id, url) {

        var deferred = $q.defer();
        HackatonStefaniniService.listarId(url + id).then(
            function (response) {
                if (response.data !== undefined)
                    deferred.resolve(response.data);
                else
                    deferred.resolve(vm.enderecoDefault);
            }
        );
        return deferred.promise;
    };

    vm.incluir = function () {

        var deferred = $q.defer();
        var objetoDados = angular.copy(vm.perfil);
        objetoDados.dataHoraInclusao = new Date(parseInt(vm.perfil.dataHoraInclusao.substring(6,10)), parseInt(vm.perfil.dataHoraInclusao.substring(3,5)) - 1, parseInt(vm.perfil.dataHoraInclusao.substring(0,2)));

        if (vm.acao == "Cadastrar") {
            vm.salvar(vm.urlPerfil, objetoDados).then(
                function (pessoaRetorno) {
                    vm.retornarTelaListagem();
                });
        } else if (vm.acao == "Editar") {
            objetoDados.dataHoraAlteracao = new Date();
            vm.alterar(vm.urlPerfil, objetoDados).then(
                function (pessoaRetorno) {
                    vm.retornarTelaListagem();
                });
        }
    };

    vm.remover = function (objeto) {

        vm.excluir(vm.urlPerfil + objeto.id).then(
            function (ojetoRetorno) {
                vm.retornarTelaListagem();
            });
    };

    vm.salvar = function (url, objeto) {

        var deferred = $q.defer();
        var obj = JSON.stringify(objeto);
        HackatonStefaniniService.incluir(url, obj).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.alterar = function (url, objeto) {

        var deferred = $q.defer();
        var obj = JSON.stringify(objeto);
        HackatonStefaniniService.alterar(url, obj).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.excluir = function (url) {

        var deferred = $q.defer();
        HackatonStefaniniService.excluir(url).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.dataFormat = function (dateObj) {

        if (dateObj === undefined)
            return "";

        var dt = dateObj.toLocaleString('pt-BR');
        var hora = dt.split("-")[2].split("T")[1].substring(0, 5);
        var dia = dt.split("-")[2].split("T")[0];
        var mes = dt.split("-")[1];
        var ano = dt.split("-")[0];

        return dia + "/" + mes + "/" + ano + " - " + hora;
    };
}
