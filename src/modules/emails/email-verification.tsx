import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';


interface Props{
    username:string;
    verifyurl:string;
}

const EmailVerification = ({
    username,
    verifyurl,
}:Props) => {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>Please verify your email address to complete your registration</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] px-[48px] py-[40px] mx-auto max-w-[600px]">
            <Section>
              <Heading className="text-[32px] font-bold text-gray-900 text-center mb-[32px]">
                Verify Your Email
              </Heading>
              
              <Text className="text-[16px] text-gray-700 mb-[24px]">
                Hi there!
              </Text>
              
              <Text className="text-[16px] text-gray-700 mb-[24px]">
                Gracias {username} por crear una cuenta.
                Por favor, verifica tu correo.
              </Text>
              
              <Section className="text-center mb-[32px]">
                <Button
                  className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold box-border"
                  href={verifyurl}
                >
                  Verify Email Address
                </Button>
              </Section>
              
              <Text className="text-[14px] text-gray-600 mb-[24px]">
                This verification link will expire in 24 hours. If you did not create an account, 
                you can safely ignore this email.
              </Text>
              
              <Text className="text-[14px] text-gray-600">
                If you are having trouble clicking the button, copy and paste this URL into your browser:
                <br />
                https://example.com/verify
              </Text>
            </Section>
            
            <Section className="border-t border-gray-200 pt-[24px] mt-[40px]">
              <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
                © 2024 Your Company Name. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
                123 Business Street, Suite 100, Madrid, Spain
              </Text>
              <Text className="text-[12px] text-gray-500 text-center m-0">
                <a href="#" className="text-gray-500 underline">Unsubscribe</a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailVerification;