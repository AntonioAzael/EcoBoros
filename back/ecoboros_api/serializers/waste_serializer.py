from rest_framework import serializers
from ecoboros_api.models import Wastes, Categories, WasteEvidences, Users
from django.core.files.storage import default_storage
from django.conf import settings
import os


class WasteEvidenceReadSerializer(serializers.ModelSerializer):
    """Serializer de solo lectura para mostrar evidencias con URL completa."""
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = WasteEvidences
        fields = ['evidence_id', 'file_path', 'file_type', 'file_url']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file_path:
            url = settings.MEDIA_URL + obj.file_path
            if request:
                return request.build_absolute_uri(url)
            return url
        return None


class WasteSerializer(serializers.ModelSerializer):
    # Campos de escritura
    category_name = serializers.CharField(write_only=True)
    publisher_id = serializers.IntegerField(write_only=True, required=False)
    evidences = serializers.ListField(
        child=serializers.FileField(), write_only=True, required=False
    )

    # Campos de solo lectura calculados
    category_name_display = serializers.SerializerMethodField(read_only=True)
    status_name = serializers.SerializerMethodField(read_only=True)
    publisher_name = serializers.SerializerMethodField(read_only=True)
    evidence_files = WasteEvidenceReadSerializer(
        source='wasteevidences_set', many=True, read_only=True
    )
    # Primera imagen de evidencias para mostrar en cards
    first_image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Wastes
        fields = [
            'waste_id',
            'publisher',
            'publisher_id',
            'publisher_name',
            'category',
            'category_name',
            'category_name_display',
            'title',
            'technical_description',
            'weight_decimal',
            'quantity',
            'unit_price',
            'generation_date',
            'availability_date',
            'status',
            'status_name',
            'quality_validator',
            'created_at',
            'evidences',
            'evidence_files',
            'first_image_url',
        ]
        read_only_fields = ['publisher', 'category', 'created_at']

    def update(self, instance, validated_data):
        current_status_id = instance.status.status_id if instance.status else None
        if current_status_id == 6 or (instance.status and instance.status.status_name.lower() == 'completado'):
            raise serializers.ValidationError(
                {"status": "La publicación ya está en estado Completado y no se puede modificar."}
            )
        return super().update(instance, validated_data)

    def get_category_name_display(self, obj):
        try:
            return obj.category.category_name if obj.category else None
        except Exception:
            return None

    def get_status_name(self, obj):
        try:
            return obj.status.status_name if obj.status else None
        except Exception:
            return None

    def get_publisher_name(self, obj):
        try:
            return obj.publisher.company_name if obj.publisher else None
        except Exception:
            return None

    def get_first_image_url(self, obj):
        request = self.context.get('request')
        try:
            evidence = obj.wasteevidences_set.filter(file_type='image').first()
            if evidence and evidence.file_path:
                url = settings.MEDIA_URL + evidence.file_path
                if request:
                    return request.build_absolute_uri(url)
                return url
        except Exception:
            pass
        return None

    def create(self, validated_data):
        evidences_data = validated_data.pop('evidences', [])
        category_name = validated_data.pop('category_name')
        publisher_id = validated_data.pop('publisher_id', None)

        # Mapeo de sinónimos comunes del frontend a la BD
        synonyms = {
            'carton': 'Cartones',
            'cartón': 'Cartones',
            'papel': 'Papeles',
            'plastico': 'Plasticos',
            'plásticos': 'Plasticos',
            'plástico': 'Plasticos',
            'metal': 'Metales',
            'electronico': 'Electronicos',
            'electrónico': 'Electronicos',
            'madera': 'Maderas'
        }
        
        search_name = synonyms.get(category_name.lower(), category_name)

        # Obtener categoría
        try:
            category = Categories.objects.get(category_name__iexact=search_name)
        except Categories.DoesNotExist:
            raise serializers.ValidationError(
                {"category_name": f"La categoría '{category_name}' (buscada como '{search_name}') no existe en la base de datos."}
            )

        # Obtener publisher desde publisher_id o usar el primero disponible
        if publisher_id:
            try:
                publisher = Users.objects.get(pk=publisher_id, is_active=True)
            except Users.DoesNotExist:
                raise serializers.ValidationError(
                    {"publisher_id": f"El usuario con ID {publisher_id} no existe o no está activo."}
                )
        else:
            # Fallback: usar el primer usuario activo (solo para desarrollo)
            publisher = Users.objects.filter(is_active=True).first()
            if not publisher:
                raise serializers.ValidationError(
                    {"publisher_id": "No hay usuarios activos disponibles. Proporciona publisher_id."}
                )

        # Obtener el estado 'Revision' (status_id = 1) por defecto si no se manda otro
        if 'status' not in validated_data:
            from ecoboros_api.models import Statuses
            try:
                validated_data['status'] = Statuses.objects.get(pk=1)
            except Statuses.DoesNotExist:
                pass

        # Crear el waste
        waste = Wastes.objects.create(
            category=category,
            publisher=publisher,
            **validated_data
        )

        # Guardar archivos de evidencia
        for evidence_file in evidences_data:
            # Organizar archivos por waste_id en la carpeta media
            file_name = evidence_file.name
            file_path = os.path.join('waste_evidences', str(waste.waste_id), file_name)

            # Guardar el archivo usando el storage de Django
            saved_path = default_storage.save(file_path, evidence_file)

            # Determinar tipo de archivo
            content_type = getattr(evidence_file, 'content_type', '')
            if content_type.startswith('image'):
                file_type = 'image'
            elif 'pdf' in content_type:
                file_type = 'pdf'
            else:
                file_type = 'document'

            # Crear registro en BD
            WasteEvidences.objects.create(
                waste=waste,
                file_path=saved_path,
                file_type=file_type
            )

        return waste