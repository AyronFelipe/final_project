from django.contrib import admin
from .models import Photo, Tag, Notification, UnitMeasurement, Comment


class PhotoAdmin(admin.ModelAdmin):
    pass
admin.site.register(Photo, PhotoAdmin)


class TagAdmin(admin.ModelAdmin):
    pass
admin.site.register(Tag, TagAdmin)


class NotificationAdmin(admin.ModelAdmin):
    pass
admin.site.register(Notification, NotificationAdmin)


class UnitMeasurementAdmin(admin.ModelAdmin):
    pass
admin.site.register(UnitMeasurement, UnitMeasurementAdmin)


class CommentAdmin(admin.ModelAdmin):
    pass
admin.site.register(Comment, CommentAdmin)
