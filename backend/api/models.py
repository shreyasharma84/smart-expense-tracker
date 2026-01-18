from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('Food', 'Food'),
        ('Travel', 'Travel'),
        ('Rent', 'Rent'),
        ('Shopping', 'Shopping'),
        ('Entertainment', 'Entertainment'),
        ('Utilities', 'Utilities'),
        ('Health', 'Health'),
        ('Other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    date = models.DateField()
    description = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.category} - {self.amount}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    monthly_budget = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.user.username

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
