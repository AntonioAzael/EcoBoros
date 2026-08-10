# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuditLogs(models.Model):
    log_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    action_type = models.CharField(max_length=100)
    entity_affected = models.CharField(max_length=50)
    entity_id = models.IntegerField()
    action_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'audit_logs'


class Categories(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(unique=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'categories'


class PurchaseRequests(models.Model):
    request_id = models.AutoField(primary_key=True)
    waste = models.ForeignKey('Wastes', models.DO_NOTHING)
    buyer = models.ForeignKey('Users', models.DO_NOTHING)
    requested_weight = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    offered_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    quantity = models.CharField(max_length=100, blank=True, null=True)
    negotiation_comment = models.TextField(blank=True, null=True)
    quality_validator = models.ForeignKey('Users', models.DO_NOTHING, related_name='purchaserequests_quality_validator_set', blank=True, null=True)
    seller_payment_confirmed = models.BooleanField(default=False, blank=True, null=True)
    platform_fee_confirmed = models.BooleanField(default=False, blank=True, null=True)
    status = models.ForeignKey('Statuses', models.DO_NOTHING, blank=True, null=True)
    request_date = models.DateTimeField(blank=True, null=True)
    response_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'purchase_requests'


class Roles(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_name = models.CharField(unique=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'roles'


class Statuses(models.Model):
    status_id = models.AutoField(primary_key=True)
    status_name = models.CharField(unique=True, max_length=50)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'statuses'


class Users(models.Model):
    user_id = models.AutoField(primary_key=True)
    role = models.ForeignKey(Roles, models.DO_NOTHING)
    company_name = models.CharField(max_length=150)
    rfc = models.CharField(unique=True, max_length=13, blank=True, null=True)
    contact_email = models.CharField(max_length=100)
    contact_phone = models.CharField(max_length=20)
    password = models.CharField(max_length=128, blank=True, null=True)
    is_active = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'


class WasteEvidences(models.Model):
    evidence_id = models.AutoField(primary_key=True)
    waste = models.ForeignKey('Wastes', models.DO_NOTHING, related_name='wasteevidences_set')
    file_path = models.CharField(max_length=500)
    file_type = models.CharField(max_length=50)  # 'image', 'pdf', 'document'

    class Meta:
        managed = False
        db_table = 'waste_evidences'


class WasteStatusLogs(models.Model):
    log_id = models.AutoField(primary_key=True)
    waste = models.ForeignKey('Wastes', models.DO_NOTHING)
    purchase_request = models.ForeignKey(PurchaseRequests, models.DO_NOTHING, blank=True, null=True)
    previous_status = models.CharField(max_length=50)
    status_changed = models.CharField(max_length=50)
    partial_weight = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    changed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'waste_status_logs'


class Wastes(models.Model):
    waste_id = models.AutoField(primary_key=True)
    publisher = models.ForeignKey(Users, models.DO_NOTHING)
    category = models.ForeignKey(Categories, models.DO_NOTHING)
    title = models.CharField(max_length=255)
    technical_description = models.TextField()
    weight_decimal = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.CharField(max_length=100, blank=True, null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    generation_date = models.DateField()
    availability_date = models.DateField()
    status = models.ForeignKey(Statuses, models.DO_NOTHING, blank=True, null=True)
    quality_validator = models.ForeignKey(Users, models.DO_NOTHING, related_name='wastes_quality_validator_set', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'wastes'
