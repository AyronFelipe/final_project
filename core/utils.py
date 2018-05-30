from django.conf import settings
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.template.defaultfilters import striptags
import os
from datetime import date


def send_mail_template(subject, template_name, context, recipient_list, from_email=settings.DEFAULT_FROM_EMAIL, fail_silently=False):
    
    message_html = render_to_string(template_name, context)
    message_txt = striptags(message_html)
    email = EmailMultiAlternatives(subject=subject, body=message_txt, from_email=from_email, to=recipient_list)
    email.attach_alternative(message_html, "text/html")
    email.send(fail_silently=fail_silently)


def img_path(instance, filename):

    filename, file_extension = os.path.splitext(filename)
    filename = str(instance.pk) + file_extension
    return os.path.join(
        'photos', 
        date.today().strftime("%Y"), 
        date.today().strftime("%m"), 
        date.today().strftime("%d"), 
        filename
    )