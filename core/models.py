from django.db import models
from donations.models import Donation
from django.utils.translation import ugettext_lazy as _
from core.utils import img_path
from core.mixins import CreationAndUpdateMixin


class Photo(CreationAndUpdateMixin):

    image_file = models.ImageField(_('file'), upload_to=img_path, null=True, blank=True)
    donation = models.ForeignKey(Donation, null=True, blank=True, related_name="photos", on_delete=models.SET_NULL)

    class Meta:
        verbose_name = _('photo')
        verbose_name_plural = _('photos')

