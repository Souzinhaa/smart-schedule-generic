import requests
from app.config import settings

class EvolutionAPI:
    def __init__(self):
        self.base_url = settings.evolution_api_url
        self.api_key = settings.evolution_api_key
        self.headers = {"apikey": self.api_key}

    def send_message(self, phone: str, message: str) -> bool:
        try:
            # TODO: Implement actual Evolution API integration
            # This is a stub for WhatsApp message sending
            print(f"[WhatsApp] Send to {phone}: {message}")
            return True
        except Exception as e:
            print(f"WhatsApp error: {e}")
            return False

    def send_appointment_confirmation(self, phone: str, appointment_data: dict) -> bool:
        message = f"""
Olá! Seu agendamento foi confirmado.

Data: {appointment_data.get('date')}
Serviço: {appointment_data.get('service')}
Barbeiro: {appointment_data.get('barber')}
Valor: R$ {appointment_data.get('price', 0) / 100:.2f}

Confirme este agendamento respondendo: SIM
Cancelar respondendo: NÃO

Obrigado!
        """
        return self.send_message(phone, message.strip())

    def send_appointment_reminder(self, phone: str, appointment_data: dict) -> bool:
        message = f"""
Lembrete de agendamento!

Seu agendamento está marcado para {appointment_data.get('date')}
Serviço: {appointment_data.get('service')}
Local: {appointment_data.get('barbershop')}

Até lá!
        """
        return self.send_message(phone, message.strip())

    def send_cancellation_notification(self, phone: str, appointment_data: dict) -> bool:
        message = f"""
Seu agendamento de {appointment_data.get('date')} foi cancelado.

Serviço: {appointment_data.get('service')}

Se foi um erro, entre em contato conosco.
        """
        return self.send_message(phone, message.strip())

whatsapp_client = EvolutionAPI()
