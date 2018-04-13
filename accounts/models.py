from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from core.mixins import CreationAndUpdateMixin, PhoneMixin, AddressMixin
from django.utils.translation import ugettext_lazy as _
from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin, CreationAndUpdateMixin):

    email = models.EmailField(_('email address'), unique=True,)
    is_active = models.BooleanField(_('active'), default=False,)
    photo = models.ImageField(_('photo'), upload_to='users/photos/', null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:

        verbose_name = _('user')
        verbose_name_plural = _('users')


class Person(User, PhoneMixin, AddressMixin):

    first_name = models.CharField(_('first name'), max_length=255, blank=True)
    last_name = models.CharField(_('last name'), max_length=255, blank=True)
    cpf = models.CharField(_('cpf'), max_length=14, unique=True,)
    birthday = models.DateField(_('birthday'), blank=True)

    class Meta:

        verbose_name = _('person')
        verbose_name_plural = _('persons')


class Institution(User, PhoneMixin, AddressMixin):

    name = models.CharField(_('institution name'), max_length=255, blank=True)
    cnpj = models.CharField(_('cnpj'), max_length=18)
    slug = models.SlugField(max_length=50, blank=True, null=True, unique=True)
    objectives = models.TextField(_('objectives'), blank=True, null=True)

    class Meta:

        verbose_name = _('institution')
        verbose_name_plural = _('instituions')


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
