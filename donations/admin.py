from django.contrib import admin
from .models import Donation, Solicitation, DonationTags

class DonationAdmin(admin.ModelAdmin):
    pass
admin.site.register(Donation, DonationAdmin)


class SolicitationAdmin(admin.ModelAdmin):
    pass
admin.site.register(Solicitation, SolicitationAdmin)


class DonationTagsAdmin(admin.ModelAdmin):
    pass
admin.site.register(DonationTags, DonationTagsAdmin)
