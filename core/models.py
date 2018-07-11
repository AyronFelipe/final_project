from django.db import models
from donations.models import Donation
from django.utils.translation import ugettext_lazy as _
from core.utils import img_path
from core.mixins import CreationAndUpdateMixin
from django.contrib.auth import get_user_model


class Photo(CreationAndUpdateMixin):

    image_file = models.ImageField(_('file'), upload_to=img_path, null=True, blank=True)
    donation = models.ForeignKey(Donation, null=True, blank=True, related_name="photos", on_delete=models.CASCADE)

    class Meta:

        verbose_name = _('photo')
        verbose_name_plural = _('photos')


class Tag(CreationAndUpdateMixin):

    name = models.CharField(_('name'), null=True, blank=True, max_length=255)

    class Meta:

        verbose_name=_('tag')
        verbose_name_plural=_('tags')

    def __str__(self):

        return self.name


class Notification(CreationAndUpdateMixin):

    message = models.CharField(_('message'), null=True, blank=True, max_length=255)
    notified = models.ForeignKey(get_user_model(), related_name='notifications', null=True, blank=True, on_delete=models.CASCADE)
    sender = models.ForeignKey(get_user_model(), related_name='sended_notifications', null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:

        verbose_name=_("notification")
        verbose_name_plural=_("notifications")

    def __str__(self):

        return '%s - %s' % (self.message, self.notified)


