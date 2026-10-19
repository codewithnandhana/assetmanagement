from rest_framework.routers import DefaultRouter
from .views import (
    AssetViewSet,
    InventoryItemViewSet,
    AssignmentViewSet,
    RepairTicketViewSet,
)

router = DefaultRouter()

router.register("assets", AssetViewSet)
router.register("inventory", InventoryItemViewSet)
router.register("assignments", AssignmentViewSet)
router.register("tickets", RepairTicketViewSet)

urlpatterns = router.urls