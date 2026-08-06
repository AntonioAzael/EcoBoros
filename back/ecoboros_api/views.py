from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from ecoboros_api.models import Users


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get('email') or '').strip()
        password = request.data.get('password') or ''

        if not email or not password:
            return Response(
                {'detail': 'Email y contraseña son requeridos.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = Users.objects.get(contact_email__iexact=email, is_active=True)
        except Users.DoesNotExist:
            return Response(
                {'detail': 'Credenciales inválidas.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.password or user.password != password:
            return Response(
                {'detail': 'Credenciales inválidas.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        role_name = (user.role.role_name or '').lower()
        if 'admin' in role_name:
            role = 'admin'
            description = 'Administrador del Sistema'
            icon = '👑'
        elif 'calidad' in role_name:
            role = 'calidad'
            description = 'Control de Calidad'
            icon = '✓'
        else:
            role = 'empresa'
            description = 'Empresa Verificada'
            icon = '🏭'

        return Response({
            'user_id': user.user_id,
            'email': user.contact_email,
            'name': user.company_name,
            'role': role,
            'role_name': user.role.role_name,
            'description': description,
            'icon': icon,
            'company_name': user.company_name,
            'rfc': user.rfc,
            'contact_phone': user.contact_phone,
        }, status=status.HTTP_200_OK)
