(function () {

    angular
        .module('app.core')
        .factory('messaging', messaging);


    messaging.$inject = ['dataFactory', '$modal'];

    function messaging(dataFactory, modal, scope) {
        var service = {
            showLoginMessage: showLoginMessage,
            showSimpleMessage: showSimpleMessage,
            showFailedLogin: showFailedLogin,
            showDeleteWarning: showDeleteWarning,
            showRegistration: showRegistration
        };

        return service;
        /////////////////////


        function showLoginMessage(template, dialog) {

            var options = {
                templateUrl: template,
                controller: function () {
                    this.userEmail = "";
                    this.userPassword = "";
                    this.dialog = dialog;
                },
                controllerAs: "model"
            }

            return modal.open(options).result;
        }
        
        function showRegistration(template, dialog) {

            var options = {
                templateUrl: template,
                controller: function () {
                    this.email = "";
                    this.password1 = "";
                    this.password2  = "";
                    this.display_name = "";
                    this.dialog = dialog;
                },
                controllerAs: "model"
            }

            return modal.open(options).result;
        }

        function showFailedLogin() {
            return showLoginMessage(true);
        }

        function submitLogin() {
            var email = $("#userEmail").val();
            var password = $("#userPassword").val();
            return retrieveAccessToken(email, password);
        }

        function showSimpleMessage(template, message, title) {

            var options = {
                templateUrl: template,
                controller: function () {
                    this.message = message;
                    this.title = title;
                },
                controllerAs: "model"
            }
            modal.open(options);

        }

        function showDeleteWarning(template, id) {
            
            var options = {
                templateUrl: template,
                controller: function () {
                    this.id = id;
                },
                controllerAs: "model"
            }

            return modal.open(options).result;
        }
    }

}());