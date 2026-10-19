from django.urls import path
from .views import dashboard,asset_list,asset_create,asset_edit,asset_delete,inventory_list,inventory_create,inventory_edit,inventory_delete,assignment_list,assignment_create,assignment_edit,assignment_delete,repair_list ,repair_create, repair_edit, repair_delete,login_view,logout_view,assignment_detail,asset_detail,inventory_detail,repair_detail
from .views import chat_view
urlpatterns = [
    path('dashboard/',dashboard, name='dashboard'),
    path('assets/', asset_list, name='asset_list'),
    path('assets/add/', asset_create, name='asset_create'),
    path('assets/edit/<int:id>/', asset_edit, name='asset_edit'),
    path('assets/delete/<int:id>/', asset_delete, name='asset_delete'),
    path('inventory/', inventory_list, name='inventory_list'),
    path('inventory/add/', inventory_create, name='inventory_create'),
    path('inventory/edit/<int:id>/', inventory_edit, name='inventory_edit'),
    path('inventory/delete/<int:id>/', inventory_delete, name='inventory_delete'),
    path('assignments/', assignment_list, name='assignment_list'),
    path('assignments/add/', assignment_create, name='assignment_create'),
    path('assignments/edit/<int:id>/', assignment_edit, name='assignment_edit'),
    path('assignments/delete/<int:id>/', assignment_delete, name='assignment_delete'),
    path('repairs/', repair_list, name='repair_list'),
    path('repairs/add/', repair_create, name='repair_create'),
    path('repairs/edit/<int:id>/', repair_edit, name='repair_edit'),
    path('repairs/delete/<int:id>/', repair_delete, name='repair_delete'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('assignments/view/<int:id>/', assignment_detail, name='assignment_detail'),
    path('assets/view/<int:id>/', asset_detail, name='asset_detail'),
    path('inventory/view/<int:id>/', inventory_detail, name='inventory_detail'),
    path('repairs/view/<int:id>/', repair_detail, name='repair_detail'),


path("api/chat/", chat_view, name="chat"),
]


