from django.db import models
from django.utils.translation import ugettext_lazy as _


class CreationAndUpdateMixin(models.Model):

    created_at = models.DateTimeField(_('created at'), auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:

        abstract = True