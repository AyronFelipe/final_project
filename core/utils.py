from django.conf import settings
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.template.defaultfilters import striptags
import os
from datetime import date
import pusher
from decouple import config
import threading


class EmailThread(threading.Thread):

    def __init__(self, subject, template_name, context, recipient_list, from_email, fail_silently):
        self.subject = subject
        self.template_name = template_name
        self.context = context
        self.recipient_list = recipient_list
        self.from_email = settings.DEFAULT_FROM_EMAIL
        self.fail_silently = False
        threading.Thread.__init__(self)

    def run(self):
        message_html = render_to_string(self.template_name, self.context)
        message_txt = striptags(message_html)
        email = EmailMultiAlternatives(subject=self.subject, body=message_txt, from_email=self.from_email, to=self.recipient_list)
        email.attach_alternative(message_html, "text/html")
        email.send(fail_silently=self.fail_silently) 



def send_mail_template(subject, template_name, context, recipient_list, from_email=settings.DEFAULT_FROM_EMAIL, fail_silently=False):

    EmailThread(subject, template_name, context, recipient_list, from_email=settings.DEFAULT_FROM_EMAIL, fail_silently=False).start()


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

pusher_client = pusher.Pusher(
    app_id=config('PUSHER_APP_ID'),
    key=config('PUSHER_APP_KEY'),
    secret=config('PUSHER_APP_SECRET'),
    cluster=config('PUSHER_CLUSTER'),
    ssl=config('PUSHER_SSL', cast=bool),
)

def send_push_notification(notification):

    pusher_client.trigger('my-channel', 'my-event', {'message': notification.message, 'type': notification.type, 'pk': notification.notified.pk })