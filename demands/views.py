from django.shortcuts import render


def new_demand(request):

    template_name = "demands/new_demand.html"
    context = {}
    return render(request, template_name, context)

def demand_detail(request, slug):

    template_name = "demands/demand_detail.html"
    context = {}
    return render(request, template_name, context)