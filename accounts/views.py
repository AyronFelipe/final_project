from django.shortcuts import render
from django.contrib.auth import get_user_model
from core.tokens import account_activation_token


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

    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return HttpResponse('Thank you for your email confirmation. Now you can login your account.')
    else:
        return HttpResponse('Activation link is invalid!')
