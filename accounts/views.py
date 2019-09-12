from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from core.tokens import account_activation_token
from django.utils.http import urlsafe_base64_decode
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.tokens import default_token_generator


User = get_user_model()


def login(request):

    template_name = 'accounts/login.html'
    context = {}
    return render(request, template_name, context)


def new_person(request):

    template_name = 'accounts/new_person.html'
    context = {}
    return render(request, template_name, context)


def new_institution(request):

    template_name = 'accounts/new_institution.html'
    context = {}
    return render(request, template_name, context)


def activate(request, uidb64, token):

    context = {}
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        template_name = 'accounts/account_activation_success.html'
    else:
        template_name = 'accounts/account_activation_error.html'
    return render(request, template_name, context)


def forget_password(request, uidb64, token):

    context = {}
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and default_token_generator.check_token(user, token):
        template_name = 'accounts/forget_password_success.html'
        data = {}
        if request.is_ajax():
            password1 = request.POST.get('password1')
            password2 = request.POST.get('password2')
            if password1 != password2:
                data['is_valid'] = False
                data['message'] = 'As senhas estão diferentes!'
            else:
                user.set_password(password1)
                data['is_valid'] = True
                data['message'] = 'Senha alterada com sucesso!'
            return JsonResponse(data)
    else:
        template_name = 'accounts/forget_password_error.html'
    return render(request, template_name, context)


def profile(request, username):

    template_name = 'accounts/profile.html'
    context = {}
    return render(request, template_name, context)
