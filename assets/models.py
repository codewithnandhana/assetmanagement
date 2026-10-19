from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Asset(models.Model):
    name=models.CharField(max_length=100)
    asset_type=models.CharField(max_length=50)
    serial_number=models.CharField(max_length=100, unique=True)
    status=models.CharField(max_length=30,choices=[
        ('Available', 'Available'),
        ('Assigned', 'Assigned'),
        ('Under Repair', 'Under Repair'),
    ],
    default='Available')
    purchase_date=models.DateField()

    def __str__(self):
        return self.name

class InventoryItem(models.Model):
    item_type=models.CharField(max_length=100)
    quantity=models.PositiveIntegerField(default=0)
    threshold=models.PositiveIntegerField(default=0)

    def is_low_stock(self):
      return self.quantity <= self.threshold
    def __str__(self):
        return self.item_type

class Assignment(models.Model):
    asset=models.ForeignKey(Asset, on_delete=models.CASCADE)
    employee=models.ForeignKey(User, on_delete=models.CASCADE)
    date_assigned=models.DateField()
    date_returned=models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.asset.name} - {self.employee.username}"
    def is_active(self):
        return self.date_returned is None

class RepairTicket(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    issue = models.TextField()
    status = models.CharField(max_length=30,choices=[('Pending','Pending'),('In Progress','In Progress'),('Completed','Completed')],default="Pending")
    assigned_technician = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.asset.name} - {self.issue}"


class Chat(models.Model):
    prompt = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.prompt