function getCookie(name){
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = $.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function createCookie(name, value, expires, path, domain){
    var cookie = name + "=" + escape(value) + ";";
    if(expires){
        if(expires instanceof Date){
            if(isNaN(expires.getTime())){
                expires = new Date();
            }
        }else{
            expires = new Date(new Date().getTime() + parseInt(expires) * 1000 * 60 * 60 * 24);
        }
    }
    if(path){
        cookie += "path=" + path + ";";
    }
    if(domain){
        cookie += "domain=" + domain + ";";
    }
    document.cookie = cookie;
}

var csrftoken = getCookie('csrftoken');

export { csrftoken }