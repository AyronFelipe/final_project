from django.contrib import admin
from .models import *


class DemandAdmin(admin.ModelAdmin):
    pass
admin.site.register(Demand, DemandAdmin)


class DemandTagsAdmin(admin.ModelAdmin):
    pass
admin.site.register(DemandTags, DemandTagsAdmin)
