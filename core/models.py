from django.db import models
from donations.models import Donation
from django.utils.translation import ugettext_lazy as _
from core.utils import img_path
from core.mixins import CreationAndUpdateMixin
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField


class Photo(CreationAndUpdateMixin):

    image_file = CloudinaryField(_('file'), null=True, blank=True)
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

    MY_DONATIONS = 'my-donations'
    MY_SOLICITATIONS = 'my-solicitations'
    MY_REQUESTS = 'my-requests'

    TYPE_NOTIFICATION = (
        (MY_DONATIONS, _('my donations')),
        (MY_SOLICITATIONS, _('my solicitations')),
        (MY_REQUESTS, _('my requests')),
    )

    message = models.CharField(_('message'), null=True, blank=True, max_length=255)
    notified = models.ForeignKey(get_user_model(), related_name='notifications', null=True, blank=True, on_delete=models.CASCADE)
    sender = models.ForeignKey(get_user_model(), related_name='sended_notifications', null=True, blank=True, on_delete=models.SET_NULL)
    type = models.CharField(_('type'), max_length=20, null=True, blank=True, choices=TYPE_NOTIFICATION)
    unread = models.BooleanField(_('unread'), default=True)

    class Meta:

        verbose_name=_("notification")
        verbose_name_plural=_("notifications")
        ordering=['-created_at']

    def __str__(self):

        return '%s - %s' % (self.message, self.notified)


class UnitMeasurement(models.Model):

    name = models.CharField(_('name'), max_length=255, null=True, blank=True)
    initials = models.CharField(_('initials'), max_length=3, null=True, blank=True)

    class Meta:

        verbose_name=_("unit of measurement")
        verbose_name_plural=_("unit of measurements")
    
    def __str__(self):

        return '%s - %s' % (self.name, self.initials)