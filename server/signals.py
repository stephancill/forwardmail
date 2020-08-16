import django.db.models.signals as signals
from django.dispatch import receiver
from .models import Alias
from .utilities import remove_remote_alias, create_remote_alias

@receiver(signals.post_save, sender=Alias)
def update_remote(sender, instance, update_fields, created, **kwargs):
    if created and not update_fields:
        print("New alias, not doing anything")
        return

    if "is_disconnected" in update_fields:
        if instance.is_disconnected:
            success = remove_remote_alias(instance.proxy_address)
            print("Remove remote alias", instance.proxy_address, success)
        else:
            success = create_remote_alias(instance.proxy_address, instance.user.email)
            print("Create remote alias", instance.proxy_address, success)

@receiver(signals.post_delete, sender=Alias)
def delete_remote(sender, instance, **kwargs):
    success = remove_remote_alias(instance.proxy_address)
    print("Remove remote alias", instance.proxy_address, success)