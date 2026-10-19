from django.contrib import admin

# Register your models here.
from .models import Asset, InventoryItem, Assignment, RepairTicket



@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display=('name', 'asset_type', 'serial_number', 'status', 'purchase_date')
    search_fields=('name', 'serial_number')
    list_filter=('asset_type', 'status')
    ordering=('name',)

@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display=('item_type','quantity','threshold','low_stock')
    def low_stock(self, obj):
       return obj.is_low_stock()
    search_fields=('item_type',)
    ordering=('item_type',)

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display=('asset','employee','date_assigned','date_returned','active_status')
    def active_status(self, obj):
      return obj.is_active()

    search_fields=('asset__name','employee__username')
    list_filter=('date_assigned','date_returned')
    ordering=('-date_assigned',)

    
@admin.register(RepairTicket)
class RepairTicketAdmin(admin.ModelAdmin):
    list_display=('asset','issue','status','assigned_technician')
    search_fields=('asset__name','issue','assigned_technician__username')
    list_filter=('status',)
    ordering=('status',)