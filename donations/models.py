from django.db import models
from django.contrib.auth import get_user_model
from core.mixins import CreationAndUpdateMixin, PhoneMixin, AddressMixin
from django.utils.translation import ugettext_lazy as _
from core.utils import img_path
from datetime import datetime
from django.template.defaultfilters import slugify


class Donation(CreationAndUpdateMixin, AddressMixin):

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    slug = models.SlugField(max_length=255, blank=True, null=True, unique=True)
    donator = models.ForeignKey(get_user_model(), related_name='donated_donations', on_delete=models.CASCADE, null=True, blank=True,)
    receiver = models.ForeignKey(get_user_model(), related_name='received_donations', null=True, blank=True, on_delete=models.SET_NULL)
    validity = models.DateField(blank=True, null=True)
    validity_hour = models.TimeField(blank=True, null=True)
    is_valid = models.BooleanField(default=False)
    is_accepted = models.BooleanField(default=False)
    main_photo = models.ImageField(_('main photo'), upload_to=img_path, null=True, blank=True)

    class Meta:

        verbose_name = _('donation')
        verbose_name_plural = _('donations')
        ordering = ['-created_at']

    def __str__(self):

        return self.slug

    def save(self):

        super(Donation, self).save()
        date = datetime.today()
        self.slug = 'DONA.%i-%i-%i.%i.%i-%s' % (
            date.year, date.month, date.day, self.id, self.donator.pk, slugify(self.name)
        )
        super(Donation, self).save()


class Solicitation(CreationAndUpdateMixin):

    owner = models.ForeignKey(get_user_model(), related_name='solicitations', on_delete=models.CASCADE)
    validity = models.DateField(blank=True, null=True)
    validity_hour = models.TimeField(blank=True, null=True)
    is_accepted = models.BooleanField(default=False)
    slug = models.SlugField(max_length=255, blank=True, null=True, unique=True)

    class Meta:

        verbose_name=_('solicitation')
        verbose_name_plural=_('solicitations')
        ordering = ['-created_at']

    def __str__(self):

        return self.slug

    def save(self):

        super(Donation, self).save()
        date = datetime.today()
        self.slug = 'SOL.%i-%i-%i.%i.%i-%s' % (
            date.year, date.month, date.day, self.id, self.owner.pk
        )
        super(Solicitation, self).save()





