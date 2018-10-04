from django.contrib import admin
from .models import Demand


class DemandAdmin(admin.ModelAdmin):
    pass
admin.site.register(Demand, DemandAdmin)
