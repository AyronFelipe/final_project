from django.db import models
from django.utils.translation import ugettext_lazy as _


class CreationAndUpdateMixin(models.Model):

    created_at = models.DateTimeField(_('created at'), auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:

        abstract = True


class PhoneMixin(models.Model):

    phone = models.CharField(_('phone'), blank=True, null=True, max_length=13)
    cell_phone = models.CharField(_('cell_phone'), blank=True, null=True, max_length=14)

    class Meta:

        abstract = True