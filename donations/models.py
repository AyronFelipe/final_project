from django.db import models
from django.contrib.auth import get_user_model
from core.mixins import CreationAndUpdateMixin, PhoneMixin, AddressMixin
from django.utils.translation import ugettext_lazy as _
from core.utils import img_path
from datetime import datetime
from django.template.defaultfilters import slugify
from datetime import datetime


class Donation(CreationAndUpdateMixin, AddressMixin):

    ACTIVE = 'A'
    INVALID = 'I'

    STATUS_DONATION = (
        (ACTIVE, 'Ativa'),
        (INVALID, 'Inválida'),
    )

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    slug = models.SlugField(max_length=255, blank=True, null=True, unique=True)
    donator = models.ForeignKey(get_user_model(), related_name='donated_donations', on_delete=models.CASCADE, null=True, blank=True,)
    receiver = models.ForeignKey(get_user_model(), related_name='received_donations', null=True, blank=True, on_delete=models.SET_NULL)
    validity = models.DateField(blank=True, null=True)
    validity_hour = models.TimeField(blank=True, null=True)
    is_accepted = models.BooleanField(default=False)
    main_photo = models.ImageField(_('main photo'), upload_to=img_path, null=True, blank=True)
    status = models.CharField(_('status'), null=True, blank=True, max_length=1, choices=STATUS_DONATION, default=ACTIVE)

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

    def update_status(self):
        combined_fields = datetime.combine(self.validity, self.validity_hour)
        if datetime.today() > combined_fields and self.status == Donation.ACTIVE:
            self.status = Donation.INVALID
            self.save()
        return self


class Solicitation(CreationAndUpdateMixin):

    SOLICITED = 'S'
    ACCEPTED = 'A'
    REJECTED = 'R'
    NOT_ANSWERED = 'NA'
    INVALID = 'I'

    STATUS_SOLICITATION = (
        (SOLICITED, 'Solicitada'),
        (ACCEPTED, 'Aceita'),
        (REJECTED, 'Rejeitada'),
        (NOT_ANSWERED, 'Não respondida'),
        (INVALID, 'Inválida'),
    )

    owner = models.ForeignKey(get_user_model(), related_name='solicitations', on_delete=models.CASCADE, null=True, blank=True)
    validity = models.DateField(blank=True, null=True)
    validity_hour = models.TimeField(blank=True, null=True)
    is_accepted = models.BooleanField(default=False)
    is_evaluated = models.BooleanField(default=False)
    slug = models.SlugField(max_length=255, blank=True, null=True, unique=True)
    donation = models.ForeignKey(Donation, related_name='solicitations', on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(_('status'), max_length=1, null=True, blank=True, choices=STATUS_SOLICITATION, default=SOLICITED)

    class Meta:

        verbose_name=_('solicitation')
        verbose_name_plural=_('solicitations')
        ordering = ['-created_at']

    def __str__(self):

        return self.slug

    def save(self):

        super(Solicitation, self).save()
        date = datetime.today()
        self.slug = 'SOL.%i-%i-%i.%i.%i' % (
            date.year, date.month, date.day, self.id, self.owner.pk
        )
        super(Solicitation, self).save()

    def update_status(self):
        
        combined_fields = datetime.combine(self.validity, self.validity_hour)
        combined_donation_fields = datetime.combine(self.donation.validity, self.donation.validity_hour)
        if datetime.today().toordinal() > combined_fields.toordinal() and self.status == Solicitation.SOLICITED:
            self.status = Solicitation.NOT_ANSWERED
        if datetime.today().toordinal() > combined_donation_fields.toordinal():
            self.status = Solicitation.INVALID
        return self


class DonationTags(models.Model):

    donation = models.ForeignKey(Donation, null=True, blank=True, on_delete=models.SET_NULL, related_name='donation_tags')
    tag = models.ForeignKey('core.Tag', null=True, blank=True, on_delete=models.CASCADE, related_name='tag_donations')

    def __str__(self):

        return '%s - %s' % (self.donation, self.tag)

