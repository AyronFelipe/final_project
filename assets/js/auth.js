module.exports = {

    storageToken: function(token){
        localStorage.token = token; 
        return localStorage.token;
    },

    isAuthenticated: function(){
        if (localStorage.token != ''){
            return true;
        }
        return false;
    },

    logout: function(){
        localStorage.token = '';
    }

}