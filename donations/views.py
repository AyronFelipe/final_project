from django.shortcuts import render


def donations(request):

    template_name = "donations/home.html"
    context = {}
    return render(request, template_name, context)
