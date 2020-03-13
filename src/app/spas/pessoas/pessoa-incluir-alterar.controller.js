angular.module("hackaton-stefanini").controller("PessoaIncluirAlterarController", PessoaIncluirAlterarController);
PessoaIncluirAlterarController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function PessoaIncluirAlterarController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    vm = this;
    vm.pessoa = {};
    vm.endereco = undefined;
    vm.pessoa.situacao = false;
    vm.urlEndereco = "http://localhost:8080/treinamento/api/enderecos/";
    vm.urlPerfil = "http://localhost:8080/treinamento/api/perfils/";
    vm.url = "http://localhost:8080/treinamento/api/pessoas/";
    vm.init = function () {
       if($routeParams.idPessoa){
            vm.tituloTela = "Editar Pessoa";
            vm.acao = "Editar";
            vm.listarPessoaId($routeParams.idPessoa);
            
       }else{
            vm.tituloTela = "Cadastrar Pessoa";
            vm.acao = "Cadastrar";
       }
      
       vm.listarPerfis(vm.urlPerfil).then(
        function (response) {
            if (response !== undefined){
                vm.listaPerfil = response;
            }
        }
    );
    };

    vm.listarPessoaId = function (id) {
        vm.buscarObjetoPorId(vm.url+id).then(
            function (response) {
                if (response !== undefined){
                    vm.pessoa = response;
                    vm.pessoa.dataNascimento = vm.formataDataTela(response.dataNascimento);
                    vm.burcarEnderecoPessoa(vm.urlEndereco+id).then(function(response){
                        vm.endereco = response;
                        vm.uf = response.uf;
                    })
                }
            }
        );
    };

    vm.incluirAlterarPessoa = function(){
        vm.pessoa.dataNascimento = vm.formataDataJava(vm.pessoa.dataNascimento);
        if(vm.acao == "Cadastrar"){
            vm.salvarObjeto(vm.url, vm.pessoa).then(
                function (pessoaSalva) {
                    if(vm.endereco != undefined){
                        vm.endereco.idPessoa = pessoaSalva.id;
                        vm.endereco.uf = vm.uf;
                       vm.salvarObjeto(vm.urlEndereco, vm.endereco);
                    }
                    vm.goToListagem();
                });
        }else if(vm.acao == "Editar"){
            vm.alterarObjeto(vm.url, vm.pessoa);
                if(vm.endereco == undefined){
                    vm.endereco.idPessoa = vm.pessoa.id;
                    vm.endereco.uf = vm.uf;
                    vm.salvarObjeto(vm.urlEndereco, vm.endereco);
                    vm.goToListagem();
                }else{
                    vm.endereco.idPessoa = vm.pessoa.id;
                    vm.endereco.uf = vm.uf;
                    vm.alterarObjeto(vm.urlEndereco, vm.endereco);
                    vm.goToListagem();
                }
        }
    }

    vm.listarPerfis = function(){
        var deferred = $q.defer();
        HackatonStefaniniService.listarId(vm.urlPerfil).then(
            function (response) {
                if (response.data !== undefined){
                    deferred.resolve(response.data); 
                }
            }
        );
        return deferred.promise;
    }

    vm.salvarObjeto = function(url, objeto){
        var deferred = $q.defer();
        var obj = JSON.stringify(objeto);
        HackatonStefaniniService.incluir(url, obj).then(
            function (response) {
                if (response.status == 200){
                    deferred.resolve(response.data); 
                }
            }
        );
        return deferred.promise;
    }

    vm.alterarObjeto = function(url, objeto){
        var deferred = $q.defer();
        var obj = JSON.stringify(objeto);
        HackatonStefaniniService.alterar(url, obj).then(
            function (response) {
                if (response.status == 200){
                    deferred.resolve(response.data); 
                }
            }
        );
        return deferred.promise;
    }

    vm.buscarObjetoPorId = function(url, id){
        var deferred = $q.defer();
        HackatonStefaniniService.listarId(url).then(
            function (response) {
                if (response.data !== undefined){
                    deferred.resolve(response.data); 
                }
            }
        );
        return deferred.promise;
    }

    vm.burcarEnderecoPessoa = function(url){
        var deferred = $q.defer();
        HackatonStefaniniService.listar(url).then(
            function (response) {
                if (response.data !== undefined)
                deferred.resolve(response.data); 
            }
        );
        return deferred.promise;
    }
    
    vm.cancelar = function(){
        vm.goToListagem();
    }

    vm.goToListagem = function(){
        $location.path("listarPessoas");
    }

    vm.formataDataJava = function(data){
        var dia = data.slice(0,2);
        var mes = data.slice(2,4);
        var ano = data.slice(4,8);
        return ano+"-"+mes+"-"+dia;
    }
    vm.formataDataTela = function(data){
        var ano = data.slice(0,4);
        var mes = data.slice(5,7);
        var dia = data.slice(8,10);
        var dataFormatada = dia+mes+ano;
        return dataFormatada;
    }

    vm.abrirModalEndereco = function(idPessoa){
           $("#modalEndereco").modal();
    }

    vm.limparEndereco = function(){
        $('#modalEndereco').modal('toggle');
        vm.endereco = undefined;
    }

    vm.listaUF = [
        "RO", "AC", "AM", "RR", "PA", "AP",
        "TO", "MA", "PI", "CE", "RN", "PB",
        "PE", "AL", "SE", "BA", "MG", "ES",
        "RJ", "SP", "PR", "SC", "RS", "MS",
        "MT", "GO", "DF"
    // {"id": "RO", "desc": "RO"},
    // {"id": "AC", "desc": "AC"},
    // {"id": "AM", "desc": "AM"},
    // {"id": "RR", "desc": "RR"},
    // {"id": "PA", "desc": "PA"},
    // {"id": "AP", "desc": "AP"},
    // {"id": "TO", "desc": "TO"},
    // {"id": "MA", "desc": "MA"},
    // {"id": "PI", "desc": "PI"},
    // {"id": "CE", "desc": "CE"},
    // {"id": "RN", "desc": "RN"},
    // {"id": "PB", "desc": "PB"},
    // {"id": "PE", "desc": "PE"},
    // {"id": "AL", "desc": "AL"},
    // {"id": "SE", "desc": "SE"},
    // {"id": "BA", "desc": "BA"},
    // {"id": "MG", "desc": "MG"},
    // {"id": "ES", "desc": "ES"},
    // {"id": "RJ", "desc": "RJ"},
    // {"id": "SP", "desc": "SP"},
    // {"id": "PR", "desc": "PR"},
    // {"id": "SC", "desc": "SC"},
    // {"id": "RS", "desc": "RS"},
    // {"id": "MS", "desc": "MS"},
    // {"id": "MT", "desc": "MT"},
    // {"id": "GO", "desc": "GO"},
    // {"id": "DF", "desc": "DF"}
];

}
