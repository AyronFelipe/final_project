from django.db import models
from django.utils.translation import ugettext_lazy as _


class CreationAndUpdateMixin(models.Model):

    created_at = models.DateTimeField(_('created at'), auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:

        abstract = True


class PhoneMixin(models.Model):

    phone = models.CharField(_('phone'), blank=True, null=True, max_length=13)
    cell_phone = models.CharField(_('cell phone'), blank=True, null=True, max_length=14)

    class Meta:

        abstract = True


class AddressMixin(models.Model):

    neighborhood = models.CharField(_('neighborhood'), max_length=255, null=True, blank=True)
    street = models.CharField(_('street'), max_length=255, null=True, blank=True)
    number = models.IntegerField(_('number'), null=True, blank=True)
    complement = models.CharField(_('complement'), null=True, blank=True, max_length=255)
    city = models.CharField(_('city'), null=True, blank=True, max_length=255)
    uf = models.CharField('UF', null=True, blank=True, max_length=2)
    unity = models.CharField(_('unity'), null=True, blank=True, max_length=255)
    ibge = models.CharField('IBGE', null=True, blank=True, max_length=255)
    gia = models.CharField('gia', null=True, blank=True, max_length=255)
    cep = models.CharField('CEP', max_length=255, null=True, blank=True)

    class Meta:

        abstract = True