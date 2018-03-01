from django.shortcuts import render


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
