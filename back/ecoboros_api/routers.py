from rest_framework.routers import DefaultRouter
from ecoboros_api.viewsets.role_viewset import RoleViewSet
from ecoboros_api.viewsets.user_viewset import UserViewSet
from ecoboros_api.viewsets.category_viewset import CategoryViewSet
from ecoboros_api.viewsets.status_viewset import StatusViewSet
from ecoboros_api.viewsets.waste_viewset import WasteViewSet
from ecoboros_api.viewsets.waste_evidence_viewset import WasteEvidenceViewSet
from ecoboros_api.viewsets.purchase_request_viewset import PurchaseRequestViewSet
from ecoboros_api.viewsets.waste_status_log_viewset import WasteStatusLogViewSet
from ecoboros_api.viewsets.audit_log_viewset import AuditLogViewSet

router = DefaultRouter()
router.register(r'roles', RoleViewSet, basename='roles')
router.register(r'users', UserViewSet, basename='users')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'statuses', StatusViewSet, basename='statuses')
router.register(r'wastes', WasteViewSet, basename='wastes')
router.register(r'waste-evidences', WasteEvidenceViewSet, basename='waste-evidences')
router.register(r'purchase-requests', PurchaseRequestViewSet, basename='purchase-requests')
router.register(r'waste-status-logs', WasteStatusLogViewSet, basename='waste-status-logs')
router.register(r'audit-logs', AuditLogViewSet, basename='audit-logs')