from django.shortcuts import render


def new_demand(request):

    template_name = "demands/new_demand.html"
    context = {}
    return render(request, template_name, context)