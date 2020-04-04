angular.module("hackaton-stefanini").controller("PessoaIncluirAlterarController", 
PessoaIncluirAlterarController)
.directive("selectNgFiles", function() {
    return {
        require: "ngModel",
        link: function postLink(scope,elem,attrs,ngModel) {
        elem.on("change", function(e) {
            var files = elem[0].files;
            ngModel.$setViewValue(files);

            var reader = new FileReader();
            reader.onload = (function() {
                return function(e) {
                var binaryData = e.target.result;

                var base64String = window.btoa(binaryData);
                vm.preImagem = base64String;
                document.getElementById("preview").src = 'data:image/png;base64,' + base64String;
                };
            })(files[0]);

            reader.readAsBinaryString(files[0]);
                });
            }
        }
    });
PessoaIncluirAlterarController.$inject = [
    "$rootScope",
    "$scope",
    "$location",
    "$q",
    "$filter",
    "$routeParams",
    "HackatonStefaniniService"];

function PessoaIncluirAlterarController(
    $rootScope,
    $scope,
    $location,
    $q,
    $filter,
    $routeParams,
    HackatonStefaniniService) {

    /**ATRIBUTOS DA TELA */
    vm = this;
    vm.preImagem = '';
    vm.pessoa = {
        id: null,
        nome: "",
        email: "",
        dataNascimento: null,
        enderecos: [],
        perfils: [],
        imagem: {
            nome: "",
            tipo: "",
            base64: ""
        },
        situacao: false
    };
    vm.enderecoDefault = {
        id: null,
        idPessoa: null,
        cep: "",
        uf: "",
        localidade: "",
        bairro: "",
        logradouro: "",
        complemento: ""
    };
    vm.enderecos = vm.pessoa.enderecos;

    vm.urlEndereco = "http://localhost:8080/treinamento/api/enderecos/";
    vm.urlBuscarCep = "http://localhost:8080/treinamento/api/enderecos/buscar/";
    vm.urlPerfil = "http://localhost:8080/treinamento/api/perfils/";
    vm.urlPessoa = "http://localhost:8080/treinamento/api/pessoas/";

    /**METODOS DE INICIALIZACAO */
    vm.init = function () {

        vm.tituloTela = "Cadastrar Pessoa";
        vm.acao = "Cadastrar";


        /**Recuperar a lista de perfil */
        vm.listar(vm.urlPerfil).then(
            function (response) {
                if (response !== undefined) {
                    vm.listaPerfil = response;
                    if ($routeParams.idPessoa) {
                        vm.tituloTela = "Editar Pessoa";
                        vm.acao = "Editar";

                        vm.recuperarObjetoPorIDURL($routeParams.idPessoa, vm.urlPessoa).then(
                            function (pessoaRetorno) {
                                if (pessoaRetorno !== undefined) {
                                    vm.pessoa = pessoaRetorno;
                                    vm.pessoa.dataNascimento = vm.formataDataTela(pessoaRetorno.dataNascimento);
                                    vm.perfil = vm.pessoa.perfils[0];
                                    if(pessoaRetorno.imagem.base64){
                                        var base64String = pessoaRetorno.imagem.base64;
                                        vm.preImagem = base64String;
                                        document.getElementById("preview").src = 'data:image/png;base64,' + base64String;
                                    }
                                }
                            }
                        );
                    }
                }
            }
        );
    };

    /**METODOS DE TELA */
    vm.cancelar = function () {
        vm.retornarTelaListagem();
    };

    vm.retornarTelaListagem = function () {
        $location.path("listarPessoas");
    };

    vm.abrirModal = function (endereco) {

        vm.enderecoModal = vm.enderecoDefault;
        
        if (endereco !== undefined){
            vm.tituloTelaEndereco = "Editar Endereço";
            vm.enderecoModal = endereco;

            if (vm.pessoa.enderecos.length === 0)
                vm.pessoa.enderecos.push(vm.enderecoModal);

        } else if (endereco === undefined){
            vm.tituloTelaEndereco = "Cadastrar Endereço";
            vm.enderecoModal = undefined;
        }

        $("#modalEndereco").modal();
    };

    vm.limparTela = function () {
        $("#modalEndereco").modal("toggle");
    };

    vm.incluir = function () {
        vm.pessoa.dataNascimento = vm.formataDataJava(vm.pessoa.dataNascimento);
        if(vm.inputImageArray){
            vm.pessoa.imagem.nome = vm.inputImageArray[0].name;
            vm.pessoa.imagem.tipo = vm.inputImageArray[0].type;
            vm.pessoa.imagem.base64 = vm.preImagem;
        }
        var objetoDados = angular.copy(vm.pessoa);

        if (vm.acao == "Cadastrar") {
            objetoDados.enderecos = [];
            objetoDados.perfils = [];

            vm.salvar(vm.urlPessoa, objetoDados).then(
                function (pessoaRetorno) {
                    vm.incluirRelacionamento(pessoaRetorno);
                });

        } else if (vm.acao == "Editar") {
            vm.incluirRelacionamento(objetoDados);
        }
    };

    vm.incluirRelacionamento = function (objetoParam) {
        var objetoDados = angular.copy(objetoParam);

        var listaEndereco = [];
        angular.forEach(objetoDados.enderecos, function (value, key) {
            listaEndereco.push(angular.copy(value));
        });
        angular.forEach(vm.enderecos, function (value, key) {
            if (value.complemento.length > 0) {
                value.idPessoa = objetoDados.id;
                listaEndereco.push(angular.copy(value));
            }
        });

        objetoDados.enderecos = listaEndereco;

        if (vm.perfil !== null && vm.perfil !== undefined){
            var isNovoPerfil = true;
            var novoPerfils = [];
            
            angular.forEach(objetoDados.perfils, function (value, key) {
                if (value.id === vm.perfil.id) {
                    isNovoPerfil = false;
                }
            });
            if (isNovoPerfil){
                novoPerfils.push(vm.perfil);
                objetoDados.perfils = novoPerfils;
            }
        } else
            objetoDados.perfils = [];

        vm.alterar(vm.urlPessoa, objetoDados).then(
            function (pessoaRetorno) {
                vm.retornarTelaListagem();
            });
    };

    vm.remover = function (objeto, tipo) {

        var url = vm.urlPessoa + objeto.id;
        if (tipo === "ENDERECO")
            url = vm.urlEndereco + objeto.id;

        vm.excluir(url).then(
            function (ojetoRetorno) {
                vm.retornarTelaListagem();
            });
    };

    /**METODOS DA MODAL */
    vm.buscarCep = function(){
        if(vm.enderecoModal.cep.length == 8){
            HackatonStefaniniService.listar(vm.urlBuscarCep + vm.enderecoModal.cep).then(
                function(response){
                    if(response.data.erro != true){
                        vm.enderecoModal.uf = response.data.uf;
                        vm.enderecoModal.localidade = response.data.localidade;
                        vm.enderecoModal.bairro = response.data.bairro;
                        vm.enderecoModal.logradouro = response.data.logradouro;
                    } else {
                        alert("Cep inválido")
                    }
                });
        }

    };

    vm.incluirEndereco = function (endereco) {
        var objetoDados = angular.copy(endereco);
        
        if(vm.pessoa.id !== null){
            objetoDados.idPessoa = vm.pessoa.id
        
            if (vm.acao == "Cadastrar") {
                vm.salvar(vm.urlEndereco, objetoDados).then(
                    function (pessoaRetorno) {
                        vm.retornarTelaListagem();
                    });
            } else if (vm.acao == "Editar") {
                vm.alterar(vm.urlEndereco, objetoDados).then(
                    function (pessoaRetorno) {
                        vm.retornarTelaListagem();
                    });
            }
        } else {
            vm.enderecos.push(angular.copy(endereco));
            vm.limparTela;
        }
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
