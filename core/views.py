from django.shortcuts import render


def home(request):

    template_name = "core/app.html"
    context = {}
    return render(request, template_name, context)


def new_comments(request):

    template_name = "core/new_comments.html"
    context = {}
    return render(request, template_name, context)