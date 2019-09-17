module.exports = {
    storageToken: function(token){
        localStorage.token = token; 
        return localStorage.token;
    },

    isAuthenticated: function(){
        if (localStorage.token != undefined){
            return true;
        }
        return false;
    },

    logout: function(){
        localStorage.removeItem('token');
    }

}