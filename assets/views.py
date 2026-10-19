from .permissions import IsAdminOrReadOnly
from django.shortcuts import render,redirect
from rest_framework import viewsets
from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login,logout
from .serializers import (AssetSerializer,InventoryItemSerializer,AssignmentSerializer,RepairTicketSerializer,)
from rest_framework.permissions import IsAuthenticated
# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from .models import Asset, InventoryItem, RepairTicket,Assignment
from rest_framework.response import Response

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .gemini_service import ask_gemini
from .models import Chat


def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect("dashboard")

    return render(request, "login.html")

def logout_view(request):
    logout(request)
    return redirect("login")
def dashboard(request):
    total_assets=Asset.objects.count()
    available_assets=Asset.objects.filter(status="Available").count()
    assigned_assets=Asset.objects.filter(status="Assigned").count()
    repair_assets=Asset.objects.filter(status="Under Repair").count()


    low_stock_items = InventoryItem.objects.filter(
       quantity__lte=models.F("threshold")).count()

    pending_repairs = RepairTicket.objects.filter(
       status="Pending").count()

    return render(request,"dashboard.html", {
        "total_assets": total_assets,
        "available_assets": available_assets,
        "assigned_assets": assigned_assets,
        "repair_assets": repair_assets,
    })


def asset_list(request):
    assets = Asset.objects.all()

    return render(request,"assets.html",{"assets": assets})

def asset_detail(request, id):
    asset = Asset.objects.get(id=id)
    return render(request, "asset_detail.html", {"asset": asset})

def asset_create(request):
    if request.method == "POST":
        name = request.POST["name"]
        asset_type = request.POST["asset_type"]
        serial_number = request.POST["serial_number"]
        status = request.POST["status"]
        purchase_date = request.POST["purchase_date"]

        Asset.objects.create(
            name=name,
            asset_type=asset_type,
            serial_number=serial_number,
            status=status,
            purchase_date=purchase_date
        )
        return redirect("asset_list")
    return render(request, "asset_create.html")

def asset_edit(request, id):
    asset = Asset.objects.get(id=id)
    if request.method == "POST":
        asset.name = request.POST["name"]
        asset.asset_type = request.POST["asset_type"]
        asset.serial_number = request.POST["serial_number"]
        asset.status = request.POST["status"]
        asset.purchase_date = request.POST["purchase_date"]
        asset.save()

        return redirect("asset_list")
    return render(request, "asset_edit.html",{"asset": asset})

def asset_delete(request, id):
    asset = Asset.objects.get(id=id)

    if request.method == "POST":
        asset.delete()
        return redirect("asset_list")

    return render(request, "asset_delete.html",{"asset": asset})

def inventory_list(request):
    items = InventoryItem.objects.all()

    return render(request, "inventory.html",{"items": items})

def inventory_detail(request, id):
    item = InventoryItem.objects.get(id=id)
    return render(request, "inventory_detail.html", {"item": item})


def inventory_create(request):
    if request.method == "POST":
        item_type = request.POST["item_type"]
        quantity = request.POST["quantity"]
        threshold = request.POST["threshold"]

        InventoryItem.objects.create(item_type=item_type,quantity=quantity,threshold=threshold)
        return redirect("inventory_list")
    return render(request, "inventory_create.html")

def inventory_edit(request, id):
    item = InventoryItem.objects.get(id=id)

    if request.method == "POST":
        item.item_type = request.POST["item_type"]
        item.quantity = request.POST["quantity"]
        item.threshold = request.POST["threshold"]
        item.save()
        return redirect("inventory_list")
    return render(request, "inventory_edit.html",{"item": item})

def inventory_delete(request, id):
    item = InventoryItem.objects.get(id=id)

    if request.method == "POST":
        item.delete()
        return redirect("inventory_list")
    return render(request, "inventory_delete.html",{"item": item})

def assignment_list(request):
    assignments = Assignment.objects.all()
    return render(request, "assignments.html",{"assignments": assignments})

def assignment_detail(request, id):
    assignment = Assignment.objects.get(id=id)

    return render(request, "assignment_detail.html", {
        "assignment": assignment
    })


def assignment_create(request):
    if request.method == "POST":
        asset_id = request.POST["asset"]
        employee_id = request.POST["employee"]
        date_assigned = request.POST["date_assigned"]

        Assignment.objects.create(
            asset_id=asset_id,
            employee_id=employee_id,
            date_assigned=date_assigned
        )

        return redirect("assignment_list")

    assets = Asset.objects.all()
    employees = User.objects.all()

    return render(request, "assignment_create.html",{"assets": assets, "employees": employees})

def assignment_edit(request, id):
    assignment = Assignment.objects.get(id=id)

    if request.method == "POST":
        assignment.asset_id = request.POST["asset"]
        assignment.employee_id = request.POST["employee"]
        assignment.date_assigned = request.POST["date_assigned"]
        assignment.date_returned = request.POST["date_returned"]

        assignment.save()

        return redirect("assignment_list")

    assets = Asset.objects.all()
    employees = User.objects.all()

    return render(request, "assignment_edit.html",{"assignment": assignment,"assets": assets,"employees": employees})

def assignment_delete(request, id):
    assignment = Assignment.objects.get(id=id)

    if request.method == "POST":
        assignment.delete()
        return redirect("assignment_list")

    return render(request, "assignment_delete.html", {"assignment": assignment})

def repair_create(request):
    if request.method == "POST":
        asset_id = request.POST["asset"]
        issue = request.POST["issue"]
        status = request.POST["status"]
        technician_id = request.POST["assigned_technician"]

        RepairTicket.objects.create(
            asset_id=asset_id,
            issue=issue,
            status=status,
            assigned_technician_id=technician_id
        )
        return redirect("repair_list")
    assets = Asset.objects.all()
    employees = User.objects.all()
    return render(request, "repair_create.html", {"assets": assets,"employees": employees})


def repair_edit(request, id):
    repair = RepairTicket.objects.get(id=id)

    if request.method == "POST":
        repair.asset_id = request.POST["asset"]
        repair.issue = request.POST["issue"]
        repair.status = request.POST["status"]
        repair.assigned_technician_id = request.POST["assigned_technician"]
        repair.save()
        return redirect("repair_list")
    assets = Asset.objects.all()
    employees = User.objects.all()
    return render(request, "repair_edit.html", {"repair": repair,"assets": assets,"employees": employees})


def repair_delete(request, id):
    repair = RepairTicket.objects.get(id=id)

    if request.method == "POST":
        repair.delete()
        return redirect("repair_list")
    return render(request, "repair_delete.html",{"repair": repair})

def repair_list(request):
    repairs = RepairTicket.objects.all()

    return render(request, "repairs.html",{"repairs": repairs})
def repair_detail(request, id):
    repair = RepairTicket.objects.get(id=id)
    return render(request, "repair_detail.html", {"repair": repair})


class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [IsAdminOrReadOnly]

    filterset_fields = ['asset_type', 'status']
    search_fields = ['name', 'serial_number']


class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAdminOrReadOnly]

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAdminOrReadOnly]


class RepairTicketViewSet(viewsets.ModelViewSet):
    queryset = RepairTicket.objects.all()
    serializer_class = RepairTicketSerializer
    permission_classes = [IsAdminOrReadOnly]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_analytics(request):
    total_assets = Asset.objects.count()
    available_assets = Asset.objects.filter(status="Available").count()
    assigned_assets = Asset.objects.filter(status="Assigned").count()
    repair_assets = Asset.objects.filter(status="Under Repair").count()

    low_stock_items = InventoryItem.objects.filter(
        quantity__lte=models.F("threshold")
    ).count()

    pending_repairs = RepairTicket.objects.filter(
        status="Pending"
    ).count()

    return Response({
        "total_assets": total_assets,
        "available_assets": available_assets,
        "assigned_assets": assigned_assets,
        "repair_assets": repair_assets,
        "low_stock_items": low_stock_items,
        "pending_repairs": pending_repairs,
    })

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def chat_view(request):

    if request.method == 'GET':
        chats = Chat.objects.all().order_by('-created_at')

        data = []

        for chat in chats:
            data.append({
                "id": chat.id,
                "prompt": chat.prompt,
                "response": chat.response,
                "created_at": chat.created_at
            })

        return Response(data)

    prompt = request.data.get("prompt")

    try:
        response_text = ask_gemini(prompt)

    except Exception as e:
       print("GEMINI ERROR:", e)

       return Response(
        {
            "error": str(e)
        },
        status=500
       )

    Chat.objects.create(
        prompt=prompt,
        response=response_text
    )

    return Response({
        "prompt": prompt,
        "response": response_text
    })