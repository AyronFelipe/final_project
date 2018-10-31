from django.shortcuts import render


def donations(request):

    template_name = "donations/home.html"
    context = {}
    return render(request, template_name, context)


def new_donation(request):

    template_name = "donations/new_donation.html"
    context = {}
    return render(request, template_name, context)


def donation_detail(request, slug):

    template_name = "donations/donation_detail.html"
    context = {}
    return render(request, template_name, context)


def my_solicitations(request):

    template_name = "donations/my_solicitations.html"
    context = {}
    return render(request, template_name, context)


def my_donations(request):

    template_name = "donations/my_donations.html"
    context = {}
    return render(request, template_name, context)


def solicitations_donation(request, slug):

    template_name = "donations/solicitations_donation.html"
    context = {}
    return render(request, template_name, context)
