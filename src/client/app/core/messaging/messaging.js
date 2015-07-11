(function () {

    angular
        .module('app.core')
        .factory('messaging', messaging);


    messaging.$inject = ['dataFactory', '$modal'];

    function messaging(dataFactory, modal) {
        var service = {
            showLoginMessage: showLoginMessage,
            showSimpleMessage: showSimpleMessage,
            showFailedLogin: showFailedLogin,
            showDeleteWarning: showDeleteWarning
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

        function showFailedLogin() {
            return showLoginMessage(true);
        }

        function submitLogin() {
            var email = $("#userEmail").val();
            var password = $("#userPassword").val();
            return retrieveAccessToken(email, password);
        }
        
        function deleteTrip(){
            //dataFactory.deleteTrip()
            alert('I am in here');
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