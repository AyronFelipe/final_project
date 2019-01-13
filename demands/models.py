from django.db import models
from core.mixins import CreationAndUpdateMixin, PhoneMixin, AddressMixin
from django.utils.translation import ugettext_lazy as _
from django.template.defaultfilters import slugify
from django.contrib.auth import get_user_model
from core.utils import img_path
from core.models import UnitMeasurement
from datetime import datetime
from cloudinary.models import CloudinaryField


class Demand(CreationAndUpdateMixin, PhoneMixin, AddressMixin):

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    slug = models.SlugField(max_length=255, blank=True, null=True, unique=True)
    owner = models.ForeignKey(get_user_model(), related_name='demands', on_delete=models.CASCADE, null=True, blank=True,)
    main_photo = CloudinaryField(_('main photo'), null=True, blank=True)
    quantity = models.DecimalField(_('quatity'), max_digits=5, decimal_places=1, null=True, blank=True)
    unit_measurement = models.ForeignKey(UnitMeasurement, related_name='unit_demands', on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(_('status'), max_length=2, null=True, blank=True)

    class Meta:

        verbose_name = _('demand')
        verbose_name_plural = _('demands')
        ordering = ['-created_at']

    def save(self):

        super(Demand, self).save()
        date = datetime.today()
        self.slug = 'DEM.%i-%i-%i.%i.%i-%s' % (
           date.year, date.month, date.day, self.id, self.owner.pk, slugify(self.name)
        )
        super(Demand, self).save()


class Gift(CreationAndUpdateMixin):

    demand = models.ForeignKey(Demand, related_name='gifts', on_delete=models.CASCADE, null=True, blank=True,)
    owner = models.ForeignKey(get_user_model(), related_name='gifts', on_delete=models.CASCADE, null=True, blank=True,)

    class Meta:

        verbose_name = _('gift')
        verbose_name_plural = _('gifts')

