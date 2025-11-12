// src/modules/emails/email-verification.tsx
import * as React from "react";
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Tailwind,
} from "@react-email/components";

interface Props { username?: string; verifyurl: string; }

export default function EmailVerification({ username = "", verifyurl }: Props) {
  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>Verifica tu correo para completar el registro</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] px-[48px] py-[40px] mx-auto max-w-[600px]">
            <Section>
              <Heading className="text-[32px] font-bold text-gray-900 text-center mb-[32px]">
                Verifica tu correo
              </Heading>

              <Text className="text-[16px] text-gray-700 mb-[24px]">
                ¡Hola {username || "allí"}!
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[24px]">
                Gracias por crear una cuenta. Por favor, verifica tu correo.
              </Text>

              <Section className="text-center mb-[32px]">
                <Button
                  className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline"
                  href={verifyurl}
                >
                  Verificar correo
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[24px]">
                Este enlace expirará en 24 horas. Si no creaste la cuenta, puedes ignorar este mensaje.
              </Text>

             
            </Section>

            <Section className="border-t border-gray-200 pt-[24px] mt-[40px] text-center">
              <Text className="text-[12px] text-gray-500 m-0">
                © 2025 BeerSP. Todos los derechos reservados.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
