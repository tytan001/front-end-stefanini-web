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

    vm.perfil = {
        id: null,
        nome: "",
        descricao: "",
        dataHoraInclusao: "",
        dataHoraAlteracao: ""
    };

    vm.urlPerfil = "http://localhost:8080/treinamento/api/perfils/";

    /**METODOS DE INICIALIZACAO */
    vm.init = function () {

        vm.tituloTela = "Cadastrar Perfil";
        vm.acao = "Cadastrar";

        if ($routeParams.idPerfil) {
            vm.tituloTela = "Editar Perfil";
            vm.acao = "Editar";

            vm.recuperarObjetoPorIDURL($routeParams.idPerfil, vm.urlPerfil).then(
                function (perfilRetorno) {
                    if (perfilRetorno !== undefined) {
                        vm.perfil = perfilRetorno;
                        vm.perfil.dataHoraInclusao = vm.formataDataTela(perfilRetorno.dataHoraInclusao);
                        vm.perfil.dataHoraAlteracao = vm.formataDataTela(perfilRetorno.dataHoraAlteracao);
                    }
                }
            );
        } else {
            // document.getElementById("inclusaoPerfil").hidden = true;
            // document.getElementById("alteracaoPerfil").hidden = true;
            document.getElementById("divDataInclusaoAlteracao").hidden = true;
        }

    };

    /**METODOS DE TELA */
    vm.retornarTelaListagem = function () {
        $location.path("listarPerfis");
    };

    vm.cancelar = function () {
        vm.retornarTelaListagem();
    };

    vm.incluir = function () {
        if(vm.perfil.dataHoraInclusao != undefined && vm.perfil.dataHoraInclusao != ""){
            vm.perfil.dataHoraInclusao = vm.formataDataJava(vm.perfil.dataHoraInclusao);
            vm.perfil.dataHoraInclusao = new Date(
                parseInt(vm.perfil.dataHoraInclusao.substring(0,4)),
                parseInt(vm.perfil.dataHoraInclusao.substring(5,7) -1),
                parseInt(vm.perfil.dataHoraInclusao.substring(8,10)));
        }
        if(vm.perfil.dataHoraAlteracao != undefined && vm.perfil.dataHoraAlteracao != ""){
            vm.perfil.dataHoraAlteracao = vm.formataDataJava(vm.perfil.dataHoraAlteracao);
            vm.perfil.dataHoraAlteracao = new Date(
                parseInt(vm.perfil.dataHoraAlteracao.substring(0,4)),
                parseInt(vm.perfil.dataHoraAlteracao.substring(5,7) -1),
                parseInt(vm.perfil.dataHoraAlteracao.substring(8,10)));
        }

        var objetoDados = angular.copy(vm.perfil);

        
        if (vm.acao == "Cadastrar") {
            vm.salvar(vm.urlPerfil, objetoDados).then(
                function (perfilRetorno) {
                    vm.retornarTelaListagem();
                });
        } else if (vm.acao == "Editar") {
            vm.alterar(vm.urlPerfil, objetoDados).then(
                function (perfilRetorno) {
                    vm.retornarTelaListagem();
                });
        }
    };

    vm.remover = function (objeto, tipo) {

        var url = vm.urlPerfil + objeto.id;
        
        vm.excluir(url).then(
            function (ojetoRetorno) {
                vm.retornarTelaListagem();
            });
    };

    /**METODOS DE SERVICO */
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

    vm.listar = function (url) {

        var deferred = $q.defer();
        HackatonStefaniniService.listar(url).then(
            function (response) {
                if (response.data !== undefined) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

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

    vm.excluir = function (url, objeto) {

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

    /**METODOS AUXILIARES */
    vm.formataDataJava = function (data) {
        var dia = data.slice(0, 2);
        var mes = data.slice(2, 4);
        var ano = data.slice(4, 8);

        return ano + "-" + mes + "-" + dia;
    };

    vm.formataDataTela = function (data) {
        var ano = data.slice(0, 4);
        var mes = data.slice(5, 7);
        var dia = data.slice(8, 10);

        return dia + mes + ano;
    };

    vm.listaUF = [
        { "id": "RO", "desc": "RO" },
        { "id": "AC", "desc": "AC" },
        { "id": "AM", "desc": "AM" },
        { "id": "RR", "desc": "RR" },
        { "id": "PA", "desc": "PA" },
        { "id": "AP", "desc": "AP" },
        { "id": "TO", "desc": "TO" },
        { "id": "MA", "desc": "MA" },
        { "id": "PI", "desc": "PI" },
        { "id": "CE", "desc": "CE" },
        { "id": "RN", "desc": "RN" },
        { "id": "PB", "desc": "PB" },
        { "id": "PE", "desc": "PE" },
        { "id": "AL", "desc": "AL" },
        { "id": "SE", "desc": "SE" },
        { "id": "BA", "desc": "BA" },
        { "id": "MG", "desc": "MG" },
        { "id": "ES", "desc": "ES" },
        { "id": "RJ", "desc": "RJ" },
        { "id": "SP", "desc": "SP" },
        { "id": "PR", "desc": "PR" },
        { "id": "SC", "desc": "SC" },
        { "id": "RS", "desc": "RS" },
        { "id": "MS", "desc": "MS" },
        { "id": "MT", "desc": "MT" },
        { "id": "GO", "desc": "GO" },
        { "id": "DF", "desc": "DF" }
    ];

}
