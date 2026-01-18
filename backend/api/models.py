from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50) # Allow custom categories
    date = models.DateField()
    description = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.category} - {self.amount}"

class Budget(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='budget')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.user.username} - {self.amount}"

@receiver(post_save, sender=User)
def create_budget(sender, instance, created, **kwargs):
    if created:
        Budget.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_budget(sender, instance, **kwargs):
    if hasattr(instance, 'budget'):
        instance.budget.save()
    else:
        Budget.objects.create(user=instance)
