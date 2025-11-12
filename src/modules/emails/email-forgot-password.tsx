import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import { user } from '@/db/schema';

interface Props{
    username:string;
    resetUrl: string;
    userEmail: string;
}

const ForgotPasswordEmail = ({username,userEmail,resetUrl}:Props) => {

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>Reset your password - Action required</Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-[8px]">
                Reset Your Password
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                We received a request to reset your password
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-700 leading-[24px] m-0 mb-[16px]">
                Hello, {username}
              </Text>
              <Text className="text-[16px] text-gray-700 leading-[24px] m-0 mb-[16px]">
                Someone requested a password reset for your account associated with <strong>{userEmail}</strong>.
              </Text>
              <Text className="text-[16px] text-gray-700 leading-[24px] m-0 mb-[24px]">
                If this was you, click the button below to reset your password. This link will expire in 24 hours for security reasons.
              </Text>

              {/* Reset Button */}
              <Section className="text-center mb-[24px]">
                <Button
                  href={resetUrl}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-[12px] px-[24px] rounded-[6px] text-[16px] no-underline box-border"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 leading-[20px] m-0 mb-[16px]">
                If the button does not work, copy and paste this link into your browser:
              </Text>
              <Text className="text-[14px] text-blue-600 break-all m-0 mb-[24px]">
                {resetUrl}
              </Text>

              {/* Security Notice */}
              <Section className="bg-gray-50 p-[16px] rounded-[6px] border-l-[4px] border-orange-400 mb-[24px]">
                <Text className="text-[14px] text-gray-700 leading-[20px] m-0 mb-[8px] font-semibold">
                  Security Notice
                </Text>
                <Text className="text-[14px] text-gray-600 leading-[20px] m-0">
                  If you did not request this password reset, please ignore this email. Your password will remain unchanged, and your account is secure.
                </Text>
              </Section>

              <Text className="text-[16px] text-gray-700 leading-[24px] m-0">
                Need help? Contact our support team at{' '}
                <Link href="mailto:support@company.com" className="text-blue-600 no-underline">
                  support@company.com
                </Link>
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px] text-center">
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0 mb-[8px]">
                This email was sent by BeerSP
              </Text>
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0 mb-[8px]">
                123 Business Street, Suite 100, City, State 12345
              </Text>
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                © 2025 BeerSP. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ForgotPasswordEmail.PreviewProps = {
  userEmail: "samuel.caraballo@alumnos.upm.es",
  resetUrl: "https://yourapp.com/reset-password?token=abc123xyz789",
  companyName: "YourApp",
};

export default ForgotPasswordEmail;