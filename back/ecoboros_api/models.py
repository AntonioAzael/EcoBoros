# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Auditlogs(models.Model):
    logid = models.AutoField(primary_key=True)
    userid = models.ForeignKey('Users', models.DO_NOTHING, db_column='userid')
    actiontype = models.CharField(max_length=100)
    entityaffected = models.CharField(max_length=50)
    entityid = models.IntegerField()
    actiondate = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'auditlogs'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Categories(models.Model):
    categoryid = models.AutoField(primary_key=True)
    categoryname = models.CharField(unique=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'categories'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Purchaserequests(models.Model):
    requestid = models.AutoField(primary_key=True)
    wasteid = models.ForeignKey('Wastes', models.DO_NOTHING, db_column='wasteid')
    buyerid = models.ForeignKey('Users', models.DO_NOTHING, db_column='buyerid')
    requestedweight = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    offeredprice = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    requeststatus = models.CharField(max_length=30, blank=True, null=True)
    requestdate = models.DateTimeField(blank=True, null=True)
    responsedate = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'purchaserequests'


class Roles(models.Model):
    roleid = models.AutoField(primary_key=True)
    rolename = models.CharField(unique=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'roles'


class Users(models.Model):
    userid = models.AutoField(primary_key=True)
    roleid = models.ForeignKey(Roles, models.DO_NOTHING, db_column='roleid')
    companyname = models.CharField(max_length=150)
    rfc = models.CharField(unique=True, max_length=13, blank=True, null=True)
    contactemail = models.CharField(max_length=100)
    contactphone = models.CharField(max_length=20)
    isactive = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'


class Wasteevidences(models.Model):
    evidenceid = models.AutoField(primary_key=True)
    wasteid = models.ForeignKey('Wastes', models.DO_NOTHING, db_column='wasteid')
    filepath = models.CharField(max_length=255)
    filetype = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'wasteevidences'


class Wastes(models.Model):
    wasteid = models.AutoField(primary_key=True)
    publisherid = models.ForeignKey(Users, models.DO_NOTHING, db_column='publisherid')
    categoryid = models.ForeignKey(Categories, models.DO_NOTHING, db_column='categoryid')
    technicaldescription = models.TextField()
    weightdecimal = models.DecimalField(max_digits=10, decimal_places=2)
    unitprice = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    generationdate = models.DateField()
    availabilitydate = models.DateField()
    publishstatus = models.CharField(max_length=20, blank=True, null=True)
    qualityvalidatorid = models.ForeignKey(Users, models.DO_NOTHING, db_column='qualityvalidatorid', related_name='wastes_qualityvalidatorid_set', blank=True, null=True)
    createdat = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'wastes'


class Wastestatuslogs(models.Model):
    logid = models.AutoField(primary_key=True)
    wasteid = models.ForeignKey(Wastes, models.DO_NOTHING, db_column='wasteid')
    statuschanged = models.CharField(max_length=50)
    partialweight = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    changedat = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'wastestatuslogs'
