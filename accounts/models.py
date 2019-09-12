from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from core.mixins import CreationAndUpdateMixin, PhoneMixin, AddressMixin
from django.utils.translation import ugettext_lazy as _
from .managers import UserManager
from core.utils import img_path
from cloudinary.models import CloudinaryField
from django.utils.functional import cached_property


class User(AbstractBaseUser, PermissionsMixin, CreationAndUpdateMixin, PhoneMixin, AddressMixin):

    email = models.EmailField(_('email address'), unique=True,)
    is_active = models.BooleanField(_('active'), default=False,)
    photo = CloudinaryField(_('photo'), null=True, blank=True,)
    is_staff = models.BooleanField(_('is staff?'), default=False,)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:

        verbose_name = _('user')
        verbose_name_plural = _('users')

    def get_name(self):

        if hasattr(self, 'person'):
            return self.person.first_name
        else:
            return self.institution.name
        return None
    
    @cached_property
    def username(self):

        if hasattr(self, 'person'):
            return "%s-%s" % (self.person.first_name.lower().replace(" ", "."), self.pk)
        else:
            return "%s-%s" % (self.institution.name.lower().replace(" ", "."), self.pk)
        return None

    def __str__(self):

        return self.get_name()


class Person(User):

    first_name = models.CharField(_('first name'), max_length=255, blank=True)
    last_name = models.CharField(_('last name'), max_length=255, blank=True)
    cpf = models.CharField(_('cpf'), max_length=14, unique=True,)
    birthday = models.DateField(_('birthday'), blank=True)

    class Meta:

        verbose_name = _('person')
        verbose_name_plural = _('persons')

    def __str__(self):

        return self.first_name


class Institution(User):

    name = models.CharField(_('institution name'), max_length=255, blank=True)
    cnpj = models.CharField(_('cnpj'), max_length=18)
    slug = models.SlugField(max_length=50, blank=True, null=True, unique=True)
    objectives = models.TextField(_('objectives'), blank=True, null=True)

    class Meta:

        verbose_name = _('institution')
        verbose_name_plural = _('instituions')

    def __str__(self):

        return self.name


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
