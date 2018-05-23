from django.db import models
from django.contrib.auth import get_user_model
from core.mixins import CreationAndUpdateMixin, PhoneMixin, AddressMixin
from django.utils.translation import ugettext_lazy as _


class Donation(CreationAndUpdateMixin, AddressMixin):

    name = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    slug = models.SlugField(max_length=50, blank=True, null=True, unique=True)
    donator = models.ForeignKey(get_user_model(), related_name='donator', on_delete=models.CASCADE)
    receiver = models.ForeignKey(get_user_model(), related_name='receiver', null=True, blank=True, on_delete=models.SET_NULL)
    validity = models.DateTimeField(blank=True, null=True)
    is_valid = models.BooleanField(default=False)
    is_accepted = models.BooleanField(default=False)

    class Meta:

        verbose_name = _('donation')
        verbose_name_plural = _('donations')
        ordering = ['-created_at']

    def __str__(self):

        return self.slug

    def save(self):

        super(Donation, self).save()
        date = datetime.datetime.today()
        self.slug = 'DONA.%i-%i-%i.%i-%s' % (
            date.year, date.month, date.day, self.id, slugify(self.name)
        )
        super(Donation, self).save()


