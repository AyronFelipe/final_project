module.exports = {
    readURL: function(input){
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $(input).parent('.input-file-image').find('.img-upload-preview').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    },
    formatDate: function(date){
        return `${date.split('/')[2]}-${date.split('/')[1]}-${date.split('/')[0]}`
    }
}