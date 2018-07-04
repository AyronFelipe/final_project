from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from core.tokens import account_activation_token
from django.utils.http import urlsafe_base64_decode
from django.http import HttpResponse


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


def profile(request, id):

    template_name = 'accounts/profile.html'
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
