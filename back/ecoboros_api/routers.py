from rest_framework.routers import DefaultRouter
from ecoboros_api.viewsets.role_viewset import RolesViewSet
from ecoboros_api.viewsets.user_viewset import UsersViewSet
from ecoboros_api.viewsets.category_viewset import CategoriesViewSet
from ecoboros_api.viewsets.waste_viewset import WastesViewSet
from ecoboros_api.viewsets.wasteevidence_viewset import WasteevidencesViewSet
from ecoboros_api.viewsets.purchaserequest_viewset import PurchaserequestsViewSet
from ecoboros_api.viewsets.wastestatuslog_viewset import WastestatuslogsViewSet
from ecoboros_api.viewsets.auditlog_viewset import AuditlogsViewSet

router = DefaultRouter()
router.register(r'roles', RolesViewSet, basename='roles')
router.register(r'users', UsersViewSet, basename='users')
router.register(r'categories', CategoriesViewSet, basename='categories')
router.register(r'wastes', WastesViewSet, basename='wastes')
router.register(r'waste-evidences', WasteevidencesViewSet, basename='waste-evidences')
router.register(r'purchase-requests', PurchaserequestsViewSet, basename='purchase-requests')
router.register(r'waste-status-logs', WastestatuslogsViewSet, basename='waste-status-logs')
router.register(r'audit-logs', AuditlogsViewSet, basename='audit-logs')