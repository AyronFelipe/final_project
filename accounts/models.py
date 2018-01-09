from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .mixins import CreationAndUpdateMixin, PhoneMixin
from django.utils.translation import ugettext_lazy as _
from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin, CreationAndUpdateMixin):

    email = models.EmailField(_('email address'), unique=True,)
    is_active = models.BooleanField(_('active'), default=False,)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:

        verbose_name = _('user')
        verbose_name_plural = _('users')


class Person(User, PhoneMixin):

    first_name = models.CharField(_('first name'), max_length=255, blank=True)
    last_name = models.CharField(_('last name'), max_length=255, blank=True)
    cpf = models.CharField(_('cpf'), max_length=14)
    birthday = models.DateField(_('birthday'), blank=True)

    class Meta:

        verbose_name = _('person')
        verbose_name_plural = _('persons')
