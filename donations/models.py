from django.db import models
from django.contrib.auth import get_user_model
from core.mixins import CreationAndUpdateMixin, PhoneMixin, AddressMixin
from django.utils.translation import ugettext_lazy as _
from core.utils import img_path
from datetime import datetime
from django.template.defaultfilters import slugify
from datetime import datetime
from cloudinary.models import CloudinaryField


class Donation(CreationAndUpdateMixin, AddressMixin):

    COMPLETED = 'C'
    INVALID = 'I'
    ACTIVE = 'A'
    ON_HOLD = 'O'

    STATUS_DONATION = (
        (ACTIVE, 'Ativa'),
        (INVALID, 'Inválida'),
        (COMPLETED, 'Finalizada'),
        (ON_HOLD, 'Em Espera'),
    )

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    slug = models.SlugField(max_length=255, blank=True, null=True, unique=True)
    donator = models.ForeignKey(get_user_model(), related_name='donated_donations', on_delete=models.CASCADE, null=True, blank=True,)
    receiver = models.ForeignKey(get_user_model(), related_name='received_donations', null=True, blank=True, on_delete=models.SET_NULL)
    validity = models.DateField(blank=True, null=True)
    validity_hour = models.TimeField(blank=True, null=True)
    is_accepted = models.BooleanField(default=False)
    main_photo = CloudinaryField(_('main photo'), null=True, blank=True)
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

    CREATED = 'C'
    ACCEPTED = 'A'
    REJECTED = 'R'
    INVALID = 'I'
    ON_HOLD = 'O'
    COMPLETED = 'F'
    UNCOMPLETED = 'U'

    STATUS_SOLICITATION = (
        (CREATED, 'Criada'),
        (ACCEPTED, 'Aceita'),
        (REJECTED, 'Rejeitada'),
        (INVALID, 'Inválida'),
        (ON_HOLD, 'Em Espera'),
        (COMPLETED, 'Finalizada - Doada'),
        (UNCOMPLETED, 'Finalizada - Não doada'),
    )

    owner = models.ForeignKey(get_user_model(), related_name='solicitations', on_delete=models.CASCADE, null=True, blank=True)
    validity = models.DateField(blank=True, null=True)
    validity_hour = models.TimeField(blank=True, null=True)
    is_accepted = models.BooleanField(default=False)
    is_evaluated = models.BooleanField(default=False)
    slug = models.SlugField(max_length=255, blank=True, null=True, unique=True)
    donation = models.ForeignKey(Donation, related_name='solicitations', on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(_('status'), max_length=1, null=True, blank=True, choices=STATUS_SOLICITATION, default=CREATED)
    reason_rejection = models.TextField(_('reason of rejection'), null=True, blank=True)
    comment = models.TextField(_('comment'), null=True, blank=True)

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

        if self.donation:
            if self.donation.status == Donation.INVALID and self.status != Solicitation.REJECTED and self.status != Solicitation.ACCEPTED and self.status != Solicitation.ON_HOLD and self.status != Solicitation.COMPLETED and self.status != Solicitation.UNCOMPLETED:
                self.status = Solicitation.INVALID
                self.save()
            elif self.donation.status == Donation.ACTIVE and self.status == Solicitation.INVALID and self.status != Solicitation.REJECTED and self.status != Solicitation.ACCEPTED and self.status != Solicitation.ON_HOLD and self.status != Solicitation.COMPLETED and self.status != Solicitation.UNCOMPLETED:
                self.status = Solicitation.CREATED
                self.save()
            return self


class DonationTags(models.Model):

    donation = models.ForeignKey(Donation, null=True, blank=True, on_delete=models.SET_NULL, related_name='donation_tags')
    tag = models.ForeignKey('core.Tag', null=True, blank=True, on_delete=models.CASCADE, related_name='tag_donations')
    
    class Meta:

        verbose_name=_('Tag of Donation')
        verbose_name_plural=_('Tags of Donations')

    def __str__(self):

        return '%s - %s' % (self.donation, self.tag)

